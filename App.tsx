
import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  TextInput, 
  ScrollView, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Image,
  FlatList
} from 'react-native';
import { repository } from './db';
import { UserRole, Student, Driver, AppState } from './types';

// --- Constants ---
const { width, height } = Dimensions.get('window');
const COLORS = {
  primary: '#1973f0',
  admin: '#2563eb',
  driver: '#10b981',
  parent: '#8b5cf6',
  error: '#ef4444',
  dark: {
    background: '#0B1120',
    surface: '#1E293B',
    text: '#f8fafc',
    subtext: '#94a3b8',
    border: '#334155',
  }
};

// --- Components ---
const Icon = ({ name, color, size = 24 }: { name: string; color: string; size?: number }) => (
  <Text style={{ fontFamily: 'Material Symbols Outlined', fontSize: size, color }}>
    {name}
  </Text>
);

// --- Main Application ---
export default function App() {
  const [screen, setScreen] = useState<'ROLES' | 'LOGIN' | 'DASHBOARD' | 'SOS' | 'HISTORY' | 'ANALYTICS'>('ROLES');
  const [user, setUser] = useState<any>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [appData, setAppData] = useState<AppState>(repository.getData());

  const theme = COLORS.dark;

  const refreshData = () => setAppData(repository.getData());

  const navigate = (to: typeof screen) => setScreen(to);

  const logout = () => {
    setUser(null);
    setPendingRole(null);
    setScreen('ROLES');
  };

  const handleLogin = (u: any) => {
    setUser(u);
    navigate('DASHBOARD');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Global Header Actions */}
      {user && (
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.circleBtn} onPress={logout}>
            <Icon name="logout" color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {screen === 'ROLES' && (
        <RoleSelectionScreen onSelect={(r) => { setPendingRole(r); setScreen('LOGIN'); }} />
      )}

      {screen === 'LOGIN' && (
        <LoginScreen 
          role={pendingRole!} 
          onBack={() => setScreen('ROLES')} 
          onLogin={handleLogin} 
          db={appData}
        />
      )}

      {screen === 'DASHBOARD' && (
        <Dashboard 
          user={user} 
          db={appData} 
          onRefresh={refreshData} 
          navigate={navigate}
        />
      )}

      {screen === 'SOS' && <SOSScreen onBack={() => navigate('DASHBOARD')} />}
      {screen === 'HISTORY' && <HistoryScreen onBack={() => navigate('DASHBOARD')} />}
      {screen === 'ANALYTICS' && <AnalyticsScreen onBack={() => navigate('DASHBOARD')} />}
    </SafeAreaView>
  );
}

// --- Screens ---

const RoleSelectionScreen = ({ onSelect }: any) => (
  <View style={styles.centered}>
    <View style={styles.logoContainer}>
      <Icon name="shield_person" color="#fff" size={60} />
    </View>
    <Text style={styles.title}>SafeRoute 360</Text>
    <Text style={styles.subtitle}>Institutional Mobility Secured</Text>

    <View style={styles.roleList}>
      <RoleCard icon="admin_panel_settings" title="Administrator" color={COLORS.admin} onPress={() => onSelect('ADMIN')} />
      <RoleCard icon="directions_bus" title="Driver Portal" color={COLORS.driver} onPress={() => onSelect('DRIVER')} />
      <RoleCard icon="family_history" title="Parent Access" color={COLORS.parent} onPress={() => onSelect('PARENT')} />
    </View>
  </View>
);

const RoleCard = ({ icon, title, color, onPress }: any) => (
  <TouchableOpacity style={styles.roleCard} onPress={onPress}>
    <View style={[styles.roleIcon, { backgroundColor: color }]}>
      <Icon name={icon} color="#fff" />
    </View>
    <Text style={styles.roleText}>{title}</Text>
    <Icon name="chevron_right" color={COLORS.dark.subtext} />
  </TouchableOpacity>
);

const LoginScreen = ({ role, onBack, onLogin, db }: any) => {
  const [id, setId] = useState('');
  const [pwd, setPwd] = useState('');
  const [err, setErr] = useState('');

  const auth = () => {
    if (role === 'ADMIN' && id === 'Admin' && pwd === '12345') return onLogin({ role: 'ADMIN', name: 'Admin' });
    if (role === 'PARENT' && id === 'Parent' && pwd === '12345') return onLogin({ role: 'PARENT', name: 'Emma' });
    if (role === 'DRIVER') {
      const driver = db.drivers.find((d: any) => d.driverName === id && d.vanNumberPlate === pwd);
      if (driver) return onLogin({ ...driver, role: 'DRIVER' });
    }
    setErr('Invalid Credentials');
  };

  return (
    <View style={styles.screenPadding}>
      <TouchableOpacity onPress={onBack} style={styles.backRow}>
        <Icon name="arrow_back" color="#fff" />
        <Text style={styles.backText}>BACK</Text>
      </TouchableOpacity>
      <Text style={styles.screenTitle}>{role} PORTAL</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>ID / USERNAME</Text>
        <TextInput style={styles.input} value={id} onChangeText={setId} placeholder="Enter ID" placeholderTextColor={COLORS.dark.subtext} />
        <Text style={[styles.inputLabel, { marginTop: 24 }]}>PASSWORD / PLATE</Text>
        <TextInput style={styles.input} value={pwd} onChangeText={setPwd} secureTextEntry placeholder="••••••" placeholderTextColor={COLORS.dark.subtext} />
        {err ? <Text style={styles.errorText}>{err}</Text> : null}
        <TouchableOpacity style={styles.primaryBtn} onPress={auth}>
          <Text style={styles.btnText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Dashboard = ({ user, db, onRefresh, navigate }: any) => {
  const [tab, setTab] = useState<'FLEET' | 'STUDENTS'>('FLEET');
  const [adding, setAdding] = useState(false);

  // --- Admin ---
  if (user.role === 'ADMIN') return (
    <View style={styles.full}>
      <View style={styles.headerRow}>
        <Text style={styles.dashboardTitle}>Admin Console</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setAdding(!adding)}>
          <Icon name={adding ? 'close' : 'add'} color="#fff" />
        </TouchableOpacity>
      </View>

      {adding ? (
        <ScrollView style={styles.padding}>
          <EntityForm type={tab} onDone={() => { setAdding(false); onRefresh(); }} />
        </ScrollView>
      ) : (
        <View style={styles.full}>
          <View style={styles.actionGrid}>
            <QuickAction icon="analytics" label="Analytics" color={COLORS.primary} onPress={() => navigate('ANALYTICS')} />
            <QuickAction icon="sos" label="SOS Monitor" color={COLORS.error} onPress={() => navigate('SOS')} />
          </View>
          <View style={styles.tabs}>
            <TouchableOpacity style={[styles.tab, tab === 'FLEET' && styles.activeTab]} onPress={() => setTab('FLEET')}>
              <Text style={[styles.tabLabel, tab === 'FLEET' && styles.activeTabText]}>FLEET</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tab, tab === 'STUDENTS' && styles.activeTab]} onPress={() => setTab('STUDENTS')}>
              <Text style={[styles.tabLabel, tab === 'STUDENTS' && styles.activeTabText]}>STUDENTS</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.padding}>
            {tab === 'FLEET' ? 
              db.drivers.map((d: Driver) => <ListCard key={d.id} title={d.driverName} sub={d.vanNumberPlate} icon="local_taxi" color={COLORS.driver} />) :
              db.students.map((s: Student) => <ListCard key={s.id} title={s.studentName} sub={`Grade ${s.classGrade}`} icon="school" color={COLORS.parent} />)
            }
          </ScrollView>
        </View>
      )}
    </View>
  );

  // --- Driver ---
  if (user.role === 'DRIVER') return (
    <View style={styles.screenPadding}>
      <Text style={styles.dashboardTitle}>Active Route</Text>
      <View style={[styles.heroCard, { backgroundColor: COLORS.driver }]}>
        <Text style={styles.heroLabel}>CURRENT VAN</Text>
        <Text style={styles.heroValue}>{user.vanNumberPlate}</Text>
        <Text style={styles.heroSub}>{user.routeName}</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <Icon name="explore" color={COLORS.dark.subtext} size={64} />
        <Text style={styles.mapText}>Live GPS Tracking Active</Text>
      </View>
    </View>
  );

  // --- Parent ---
  return (
    <View style={styles.screenPadding}>
      <Text style={styles.dashboardTitle}>Parent App</Text>
      <View style={[styles.heroCard, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.heroLabel}>STATUS: LEO'S BUS</Text>
        <Text style={styles.heroValue}>4 mins away</Text>
        <View style={styles.progressContainer}><View style={styles.progressFill} /></View>
      </View>
      <TouchableOpacity style={styles.menuItem} onPress={() => navigate('HISTORY')}>
        <Icon name="history" color={COLORS.primary} />
        <Text style={styles.menuText}>View Attendance Logs</Text>
        <Icon name="chevron_right" color={COLORS.dark.subtext} />
      </TouchableOpacity>
    </View>
  );
};

// --- Helper UI Components ---

const EntityForm = ({ type, onDone }: any) => {
  const [v1, setV1] = useState('');
  const [v2, setV2] = useState('');
  const save = () => {
    if (type === 'FLEET') repository.addDriver({ driverName: v1, vanNumberPlate: v2, routeName: 'Route A', phoneNumber: '555' });
    else repository.addStudent({ studentName: v1, classGrade: v2, parentName: 'P', parentPhone: '555', homeLocation: 'H', driverId: '' });
    onDone();
  };
  return (
    <View style={styles.form}>
      <Text style={styles.inputLabel}>{type === 'FLEET' ? 'DRIVER NAME' : 'STUDENT NAME'}</Text>
      <TextInput style={styles.input} value={v1} onChangeText={setV1} />
      <Text style={[styles.inputLabel, { marginTop: 20 }]}>{type === 'FLEET' ? 'PLATE #' : 'GRADE'}</Text>
      <TextInput style={styles.input} value={v2} onChangeText={setV2} />
      <TouchableOpacity style={styles.primaryBtn} onPress={save}>
        <Text style={styles.btnText}>SAVE RECORD</Text>
      </TouchableOpacity>
    </View>
  );
};

const QuickAction = ({ icon, label, color, onPress }: any) => (
  <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
    <View style={[styles.actionIcon, { backgroundColor: color + '22' }]}>
      <Icon name={icon} color={color} size={32} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

const ListCard = ({ title, sub, icon, color }: any) => (
  <View style={styles.listCard}>
    <View style={[styles.listIcon, { backgroundColor: color }]}>
      <Icon name={icon} color="#fff" size={18} />
    </View>
    <View style={styles.listInfo}>
      <Text style={styles.listTitle}>{title}</Text>
      <Text style={styles.listSub}>{sub}</Text>
    </View>
  </View>
);

const SOSScreen = ({ onBack }: any) => (
  <View style={[styles.full, { backgroundColor: '#450a0a', padding: 24, paddingTop: 60 }]}>
    <TouchableOpacity onPress={onBack} style={styles.backRow}><Icon name="arrow_back" color="#fff" /><Text style={styles.backText}>BACK</Text></TouchableOpacity>
    <View style={styles.centered}>
      <TouchableOpacity style={styles.sosCircle}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
      <Text style={styles.sosInstruction}>HOLD FOR 3 SECONDS</Text>
    </View>
  </View>
);

const AnalyticsScreen = ({ onBack }: any) => (
  <View style={styles.screenPadding}>
    <TouchableOpacity onPress={onBack} style={styles.backRow}><Icon name="arrow_back" color="#fff" /><Text style={styles.backText}>BACK</Text></TouchableOpacity>
    <Text style={styles.screenTitle}>Fuel & Safety</Text>
    <View style={styles.analyticsBox}>
      <Text style={styles.inputLabel}>AVERAGE EFFICIENCY</Text>
      <Text style={styles.analyticsBig}>9.4 <Text style={styles.unit}>MPG</Text></Text>
    </View>
  </View>
);

const HistoryScreen = ({ onBack }: any) => (
  <View style={styles.screenPadding}>
    <TouchableOpacity onPress={onBack} style={styles.backRow}><Icon name="arrow_back" color="#fff" /><Text style={styles.backText}>BACK</Text></TouchableOpacity>
    <Text style={styles.screenTitle}>Attendance History</Text>
    <View style={styles.historyItem}><Text style={styles.historyText}>Oct 24 - Boarded Bus</Text><Text style={styles.historyTime}>7:32 AM</Text></View>
    <View style={styles.historyItem}><Text style={styles.historyText}>Oct 24 - Arrived School</Text><Text style={styles.historyTime}>8:05 AM</Text></View>
  </View>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: { flex: 1 },
  full: { flex: 1 },
  padding: { padding: 24 },
  screenPadding: { flex: 1, padding: 24, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  headerActions: { position: 'absolute', top: 12, right: 12, zIndex: 100 },
  circleBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: COLORS.dark.surface, justifyContent: 'center', alignItems: 'center' },
  logoContainer: { width: 100, height: 100, borderRadius: 30, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 32, fontWeight: '900', color: '#fff', letterSpacing: -1 },
  subtitle: { fontSize: 14, color: COLORS.dark.subtext, marginTop: 8, marginBottom: 40 },
  roleList: { width: '100%', paddingHorizontal: 20, gap: 12 },
  roleCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.surface, padding: 16, borderRadius: 20 },
  roleIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  roleText: { flex: 1, color: '#fff', fontSize: 16, fontWeight: 'bold' },
  backRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  backText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 8 },
  screenTitle: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 30 },
  inputGroup: { width: '100%' },
  inputLabel: { color: COLORS.dark.subtext, fontSize: 10, fontWeight: '900', letterSpacing: 1.5 },
  input: { height: 56, backgroundColor: COLORS.dark.surface, borderRadius: 16, paddingHorizontal: 16, color: '#fff', fontSize: 16, marginTop: 6 },
  primaryBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  errorText: { color: COLORS.error, fontSize: 12, marginTop: 12, textAlign: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingTop: 60 },
  dashboardTitle: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  addBtn: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center' },
  tabs: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  tab: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  activeTab: { borderBottomWidth: 2, borderBottomColor: COLORS.primary },
  tabLabel: { color: COLORS.dark.subtext, fontSize: 12, fontWeight: 'bold' },
  activeTabText: { color: COLORS.primary },
  actionGrid: { flexDirection: 'row', gap: 12, padding: 24 },
  actionBtn: { flex: 1, backgroundColor: COLORS.dark.surface, borderRadius: 24, padding: 20, alignItems: 'center' },
  actionIcon: { width: 60, height: 60, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  actionLabel: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  listCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.surface, padding: 16, borderRadius: 16, marginBottom: 10 },
  listIcon: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  listTitle: { color: '#fff', fontSize: 15, fontWeight: 'bold' },
  listSub: { color: COLORS.dark.subtext, fontSize: 11 },
  // FIX: Added missing listInfo style property
  listInfo: { flex: 1 },
  heroCard: { padding: 24, borderRadius: 24, marginBottom: 20 },
  heroLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: 'bold' },
  heroValue: { color: '#fff', fontSize: 28, fontWeight: 'bold', marginTop: 4 },
  heroSub: { color: '#fff', fontSize: 14, opacity: 0.8, marginTop: 2 },
  mapPlaceholder: { height: 260, backgroundColor: COLORS.dark.surface, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  mapText: { color: COLORS.dark.subtext, marginTop: 12, fontSize: 12 },
  menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.dark.surface, padding: 20, borderRadius: 20, gap: 16 },
  menuText: { flex: 1, color: '#fff', fontWeight: 'bold' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.dark.border },
  historyText: { color: '#fff', fontSize: 14 },
  historyTime: { color: COLORS.primary, fontWeight: 'bold' },
  sosCircle: { width: 180, height: 180, borderRadius: 90, backgroundColor: COLORS.error, justifyContent: 'center', alignItems: 'center', borderWidth: 8, borderColor: 'rgba(255,255,255,0.1)' },
  sosText: { color: '#fff', fontSize: 44, fontWeight: '900' },
  sosInstruction: { color: '#fff', marginTop: 32, opacity: 0.5, fontWeight: 'bold' },
  analyticsBox: { backgroundColor: COLORS.dark.surface, padding: 24, borderRadius: 24 },
  analyticsBig: { fontSize: 48, fontWeight: '900', color: '#fff' },
  unit: { fontSize: 16, color: COLORS.dark.subtext },
  progressContainer: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, marginTop: 20 },
  progressFill: { width: '70%', height: '100%', backgroundColor: '#fff', borderRadius: 3 },
  form: { gap: 10 }
});
