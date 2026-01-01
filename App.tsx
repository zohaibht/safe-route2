
import React, { useState, useEffect, useMemo } from 'react';
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
  Alert
} from 'react-native';

// --- Types ---
type UserRole = 'ADMIN' | 'DRIVER' | 'PARENT';
type Screen = 'ROLE_SELECTION' | 'LOGIN' | 'DASHBOARD' | 'HISTORY' | 'DRIVER_PORTAL' | 'SOS' | 'ANALYTICS';

interface User {
  id: string;
  role: UserRole;
  name: string;
}

// --- Mock Data ---
const MOCK_DRIVERS = [
  { id: 'd1', name: 'Mr. Roberts', plate: 'V-402', route: 'Morning Run - North' }
];

const COLORS = {
  primary: '#1973f0',
  admin: '#2563eb',
  driver: '#10b981',
  parent: '#8b5cf6',
  error: '#ef4444',
  light: {
    background: '#f8fafc',
    surface: '#ffffff',
    text: '#0f172a',
    subtext: '#64748b',
    border: '#e2e8f0',
  },
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

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('ROLE_SELECTION');

  const theme = isDarkMode ? COLORS.dark : COLORS.light;

  // Persistence simulation
  const handleLogout = () => {
    setUser(null);
    setPendingRole(null);
    setCurrentScreen('ROLE_SELECTION');
  };

  const handleRoleSelect = (role: UserRole) => {
    setPendingRole(role);
    setCurrentScreen('LOGIN');
  };

  const handleLoginSuccess = (loggedInUser: User) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'ADMIN') setCurrentScreen('DASHBOARD');
    else if (loggedInUser.role === 'DRIVER') setCurrentScreen('DRIVER_PORTAL');
    else if (loggedInUser.role === 'PARENT') setCurrentScreen('DASHBOARD');
  };

  // Permission Logic Wrapper
  const navigateTo = (screen: Screen) => {
    if (!user) {
      setCurrentScreen('ROLE_SELECTION');
      return;
    }
    
    const adminPages: Screen[] = ['DASHBOARD', 'ANALYTICS', 'SOS', 'HISTORY'];
    const driverPages: Screen[] = ['DRIVER_PORTAL'];
    const parentPages: Screen[] = ['DASHBOARD', 'HISTORY']; // Parent sees main dashboard (ParentHome) and history

    if (user.role === 'PARENT' && !parentPages.includes(screen)) return;
    if (user.role === 'DRIVER' && !driverPages.includes(screen)) return;
    
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'ROLE_SELECTION':
        return <RoleSelectionScreen onSelect={handleRoleSelect} theme={theme} />;
      case 'LOGIN':
        return <LoginScreen role={pendingRole!} onLogin={handleLoginSuccess} onBack={() => setCurrentScreen('ROLE_SELECTION')} theme={theme} />;
      case 'DASHBOARD':
        return user?.role === 'ADMIN' ? 
          <AdminDashboard navigateTo={navigateTo} theme={theme} /> : 
          <ParentHome navigateTo={navigateTo} theme={theme} />;
      case 'HISTORY':
        return <HistoryScreen onBack={() => navigateTo('DASHBOARD')} theme={theme} />;
      case 'DRIVER_PORTAL':
        return <DriverPortal theme={theme} user={user!} />;
      case 'SOS':
        return <SOSScreen onBack={() => navigateTo('DASHBOARD')} theme={theme} />;
      case 'ANALYTICS':
        return <AnalyticsScreen onBack={() => navigateTo('DASHBOARD')} theme={theme} />;
      default:
        return <RoleSelectionScreen onSelect={handleRoleSelect} theme={theme} />;
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      
      {/* Global Theme Toggle */}
      <View style={styles.topActions}>
        <TouchableOpacity 
          style={[styles.iconButton, { backgroundColor: theme.surface }]} 
          onPress={() => setIsDarkMode(!isDarkMode)}
        >
          <Icon name={isDarkMode ? 'light_mode' : 'dark_mode'} color={theme.text} />
        </TouchableOpacity>
        
        {user && (
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: theme.surface }]} 
            onPress={handleLogout}
          >
            <Icon name="home" color={theme.text} />
          </TouchableOpacity>
        )}
      </View>

      {renderScreen()}
    </SafeAreaView>
  );
}

// --- Screens ---

const RoleSelectionScreen = ({ onSelect, theme }: any) => (
  <View style={styles.screenCenter}>
    <View style={[styles.logoContainer, { backgroundColor: COLORS.primary }]}>
      <Icon name="shield_person" color="#fff" size={48} />
    </View>
    <Text style={[styles.title, { color: theme.text }]}>SafeRoute 360</Text>
    <Text style={[styles.subtitle, { color: theme.subtext }]}>Select access portal</Text>

    <View style={styles.roleList}>
      <RoleCard icon="admin_panel_settings" title="Administrator" color={COLORS.admin} onPress={() => onSelect('ADMIN')} theme={theme} />
      <RoleCard icon="directions_bus" title="Driver Portal" color={COLORS.driver} onPress={() => onSelect('DRIVER')} theme={theme} />
      <RoleCard icon="family_history" title="Parent App" color={COLORS.parent} onPress={() => onSelect('PARENT')} theme={theme} />
    </View>
  </View>
);

const RoleCard = ({ icon, title, color, onPress, theme }: any) => (
  <TouchableOpacity style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]} onPress={onPress}>
    <View style={[styles.cardIcon, { backgroundColor: color }]}>
      <Icon name={icon} color="#fff" />
    </View>
    <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
    <Icon name="chevron_right" color={theme.subtext} />
  </TouchableOpacity>
);

const LoginScreen = ({ role, onLogin, onBack, theme }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleAuth = () => {
    if (role === 'ADMIN' && username === 'Admin' && password === '12345') {
      onLogin({ id: 'a1', role: 'ADMIN', name: 'Super Admin' });
    } else if (role === 'PARENT' && username === 'Parent' && password === '12345') {
      onLogin({ id: 'p1', role: 'PARENT', name: 'Emma' });
    } else if (role === 'DRIVER') {
      const driver = MOCK_DRIVERS.find(d => d.name.toLowerCase() === username.toLowerCase() && d.plate === password);
      if (driver) {
        onLogin({ id: driver.id, role: 'DRIVER', name: driver.name });
      } else {
        setError('Driver not found or plate mismatch');
      }
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <View style={styles.screenPadding}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Icon name="arrow_back" color={theme.text} />
        <Text style={[styles.backText, { color: theme.text }]}>BACK</Text>
      </TouchableOpacity>
      
      <Text style={[styles.loginTitle, { color: theme.text }]}>{role} Login</Text>
      
      <View style={styles.form}>
        <Text style={[styles.label, { color: theme.subtext }]}>{role === 'DRIVER' ? 'DRIVER NAME' : 'USERNAME'}</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]} 
          value={username}
          onChangeText={setUsername}
          placeholder="Enter name"
          placeholderTextColor={theme.subtext}
        />

        <Text style={[styles.label, { color: theme.subtext, marginTop: 20 }]}>{role === 'DRIVER' ? 'VAN PLATE #' : 'PASSWORD'}</Text>
        <TextInput 
          style={[styles.input, { backgroundColor: theme.surface, color: theme.text, borderColor: theme.border }]} 
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter password"
          placeholderTextColor={theme.subtext}
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.primaryButton} onPress={handleAuth}>
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AdminDashboard = ({ navigateTo, theme }: any) => (
  <ScrollView style={styles.screenPadding}>
    <Text style={[styles.screenHeader, { color: theme.text }]}>Admin Panel</Text>
    
    <View style={styles.grid}>
      <MenuBtn icon="analytics" label="Analytics" color={COLORS.primary} onPress={() => navigateTo('ANALYTICS')} theme={theme} />
      <MenuBtn icon="sos" label="SOS" color={COLORS.error} onPress={() => navigateTo('SOS')} theme={theme} />
      <MenuBtn icon="group" label="Students" color={COLORS.parent} theme={theme} />
      <MenuBtn icon="local_taxi" label="Fleet" color={COLORS.driver} theme={theme} />
    </View>

    <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>
    <View style={[styles.activityCard, { backgroundColor: theme.surface }]}>
      <Text style={[styles.activityText, { color: theme.text }]}>All routes operational</Text>
      <Text style={{ color: theme.subtext, fontSize: 12 }}>Last update: 2 mins ago</Text>
    </View>
  </ScrollView>
);

const ParentHome = ({ navigateTo, theme }: any) => (
  <View style={styles.screenPadding}>
    <Text style={[styles.screenHeader, { color: theme.text }]}>Parent App</Text>
    
    <View style={[styles.statusCard, { backgroundColor: COLORS.primary }]}>
      <Text style={styles.statusLabel}>BUS STATUS</Text>
      <Text style={styles.statusTime}>Arriving: 4 mins</Text>
      <View style={styles.progressBar}><View style={[styles.progress, { width: '80%' }]} /></View>
    </View>

    <TouchableOpacity style={[styles.wideCard, { backgroundColor: theme.surface }]} onPress={() => navigateTo('HISTORY')}>
      <Icon name="history" color={COLORS.primary} />
      <Text style={[styles.wideCardText, { color: theme.text }]}>Attendance History</Text>
    </TouchableOpacity>
  </View>
);

const DriverPortal = ({ theme, user }: any) => (
  <View style={styles.screenPadding}>
    <Text style={[styles.screenHeader, { color: theme.text }]}>Driver Portal</Text>
    <Text style={[styles.subtitle, { color: theme.subtext }]}>Welcome, {user.name}</Text>

    <View style={[styles.mapPlaceholder, { backgroundColor: theme.surface }]}>
       <Icon name="map" color={theme.subtext} size={48} />
       <Text style={{ color: theme.subtext, marginTop: 10 }}>Active Tracking Map</Text>
    </View>

    <TouchableOpacity style={[styles.primaryButton, { marginTop: 20 }]}>
      <Text style={styles.buttonText}>START ROUTE</Text>
    </TouchableOpacity>
  </View>
);

const HistoryScreen = ({ onBack, theme }: any) => (
  <View style={styles.screenPadding}>
    <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow_back" color={theme.text} />
      <Text style={[styles.backText, { color: theme.text }]}>DASHBOARD</Text>
    </TouchableOpacity>
    <Text style={[styles.screenHeader, { color: theme.text }]}>History</Text>
    <ScrollView>
      <HistoryItem date="Oct 24" status="Arrived" time="3:45 PM" theme={theme} />
      <HistoryItem date="Oct 24" status="Boarded" time="7:30 AM" theme={theme} />
      <HistoryItem date="Oct 23" status="Arrived" time="3:50 PM" theme={theme} />
    </ScrollView>
  </View>
);

const HistoryItem = ({ date, status, time, theme }: any) => (
  <View style={[styles.historyItem, { borderBottomColor: theme.border }]}>
    <View>
      <Text style={[styles.historyDate, { color: theme.text }]}>{date}</Text>
      <Text style={[styles.historyStatus, { color: theme.subtext }]}>{status}</Text>
    </View>
    <Text style={[styles.historyTime, { color: COLORS.primary }]}>{time}</Text>
  </View>
);

const SOSScreen = ({ onBack, theme }: any) => (
  <View style={[styles.screenPadding, { backgroundColor: '#450a0a' }]}>
     <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow_back" color="#fff" />
      <Text style={[styles.backText, { color: '#fff' }]}>ADMIN</Text>
    </TouchableOpacity>
    <View style={styles.sosCenter}>
      <TouchableOpacity style={styles.sosButton}>
        <Text style={styles.sosText}>SOS</Text>
      </TouchableOpacity>
      <Text style={styles.sosInstruction}>HOLD FOR 3 SECONDS</Text>
    </View>
  </View>
);

const AnalyticsScreen = ({ onBack, theme }: any) => (
  <View style={styles.screenPadding}>
     <TouchableOpacity onPress={onBack} style={styles.backButton}>
      <Icon name="arrow_back" color={theme.text} />
      <Text style={[styles.backText, { color: theme.text }]}>ADMIN</Text>
    </TouchableOpacity>
    <Text style={[styles.screenHeader, { color: theme.text }]}>Analytics</Text>
    <View style={[styles.analyticsCard, { backgroundColor: theme.surface }]}>
      <Text style={[styles.label, { color: theme.subtext }]}>WEEKLY EFFICIENCY</Text>
      <Text style={[styles.analyticsVal, { color: theme.text }]}>94%</Text>
    </View>
  </View>
);

const MenuBtn = ({ icon, label, color, onPress, theme }: any) => (
  <TouchableOpacity style={[styles.gridBtn, { backgroundColor: theme.surface }]} onPress={onPress}>
    <Icon name={icon} color={color} size={32} />
    <Text style={[styles.gridLabel, { color: theme.text }]}>{label}</Text>
  </TouchableOpacity>
);

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    gap: 12,
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 100,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  screenCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  screenPadding: {
    flex: 1,
    padding: 24,
    paddingTop: 80,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    marginBottom: 40,
  },
  roleList: {
    width: '100%',
    gap: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 32,
  },
  form: {
    width: '100%',
  },
  label: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    height: 60,
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 12,
    textAlign: 'center',
  },
  screenHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridBtn: {
    width: '48%',
    height: 120,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 32,
    marginBottom: 16,
  },
  activityCard: {
    padding: 20,
    borderRadius: 24,
  },
  activityText: {
    fontWeight: '600',
    marginBottom: 4,
  },
  statusCard: {
    padding: 24,
    borderRadius: 30,
    marginBottom: 20,
  },
  statusLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusTime: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
    marginVertical: 10,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    marginTop: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  wideCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 24,
    gap: 16,
  },
  wideCardText: {
    fontWeight: 'bold',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyStatus: {
    fontSize: 12,
  },
  historyTime: {
    fontWeight: '700',
  },
  mapPlaceholder: {
    height: 250,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sosButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLORS.error,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 10,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  sosText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '900',
  },
  sosInstruction: {
    color: '#fff',
    marginTop: 40,
    fontWeight: 'bold',
    letterSpacing: 2,
    opacity: 0.6,
  },
  analyticsCard: {
    padding: 24,
    borderRadius: 30,
  },
  analyticsVal: {
    fontSize: 48,
    fontWeight: '900',
  }
});
