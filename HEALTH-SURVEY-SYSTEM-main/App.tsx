import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { ThemeProvider, useTheme } from './lib/ThemeContext';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import IndexPage from './pages/IndexPage';
import { Profile } from './types/profile';

function AppContent() {
  const { theme, colors } = useTheme();
  // Dummy session state
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);

  const handleAuthSuccess = (dummyData?: any) => {
    const email = dummyData?.email || 'demo@healthdrop.app';
    const fullName = dummyData?.fullName || 'Demo Worker';
    const role = dummyData?.role || 'volunteer';
    const organization = dummyData?.organization || 'Health Dept';
    const location = dummyData?.location || 'New Delhi';

    setSession({ user: { id: 'dummy-user-id', email } });
    setProfile({
      id: 'dummy-user-id',
      full_name: fullName,
      role: role as any,
      organization: organization,
      location: location,
      created_at: new Date().toISOString(),
      is_active: true,
    });
  };

  const handleProfileComplete = () => {
    // No-op for dummy mode
  };

  const handleLogout = () => {
    setSession(null);
    setProfile(null);
  };

  if (!session) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Profile setup skipped for dummy mode if we auto-set profile
  if (!profile) {
    return (
      <ProfileSetup
        userId={session.user.id}
        onProfileComplete={handleProfileComplete}
      />
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <IndexPage
        userName={profile.full_name || session.user.email?.split('@')[0] || 'User'}
        userEmail={session.user.email || ''}
        userId={session.user.id}
        onLogout={handleLogout}
      />
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});