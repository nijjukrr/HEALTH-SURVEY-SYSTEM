import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types/profile';
import { useTheme, Theme, spacing, radius, typography } from '../lib/ThemeContext';

interface AuthScreenProps {
  onAuthSuccess: (data?: any) => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const { theme, toggleTheme, colors } = useTheme();
  // We recreate styles when colors or theme changes
  const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('volunteer');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');

  const roles: { value: Profile['role']; label: string; icon: string }[] = [
    { value: 'admin', label: 'Admin', icon: 'shield-checkmark' },
    { value: 'clinic', label: 'Clinic', icon: 'medkit' },
    { value: 'asha_worker', label: 'ASHA Worker', icon: 'medical' },
    { value: 'volunteer', label: 'Volunteer', icon: 'people' },
  ];

  const isValidEmail = (text: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);

  const handleGoogleLogin = async () => {
    setLoading(true);
    // Simulate network delay for dummy login
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        email: 'google.user@healthdrop.app',
        fullName: 'Google User',
        role: 'volunteer',
        organization: 'Independent',
        location: 'Unknown'
      });
    }, 800);
  };

  const handleAuth = async () => {
    if (isLogin) {
      if (!email || !password) {
        Alert.alert('Missing Fields', 'Please enter email and password');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
    } else {
      if (!email || !password || !fullName || !organization || !location) {
        Alert.alert('Missing Fields', 'Please fill in all required fields');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Invalid Email', 'Please enter a valid email address');
        return;
      }
    }

    setLoading(true);

    // Simulate network delay for dummy login
    setTimeout(() => {
      setLoading(false);
      onAuthSuccess({
        email: email,
        fullName: isLogin ? 'Demo User' : fullName,
        role: role,
        organization: isLogin ? 'Demo Org' : organization,
        location: isLogin ? 'Demo City' : location
      });
    }, 800);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Top bar with theme toggle */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons
              name={theme === 'dark' ? 'sunny' : 'moon'}
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Header */}
        <View style={styles.headerContainer}>
          <View style={styles.logoWrapper}>
            <Image source={require('../assets/app_logo.png')} style={styles.logo} resizeMode="contain" />
          </View>
          <Text style={styles.title}>HealthDrop</Text>
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.formContainer}>
          {/* Google OAuth Button */}
          <TouchableOpacity
            style={styles.googleButton}
            onPress={handleGoogleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
              style={styles.googleIcon}
            />
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {isLogin ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your full name"
                  placeholderTextColor={colors.textTertiary}
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone (Optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+91 XXXXX XXXXX"
                  placeholderTextColor={colors.textTertiary}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role</Text>
                <View style={styles.roleContainer}>
                  {roles.map((roleOption) => (
                    <TouchableOpacity
                      key={roleOption.value}
                      style={[
                        styles.roleButton,
                        role === roleOption.value && styles.roleButtonSelected,
                      ]}
                      onPress={() => setRole(roleOption.value)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={roleOption.icon as any}
                        size={16}
                        color={role === roleOption.value ? colors.primary : colors.textSecondary}
                        style={styles.roleIcon}
                      />
                      <Text
                        style={[
                          styles.roleButtonText,
                          role === roleOption.value && styles.roleButtonTextSelected,
                        ]}
                      >
                        {roleOption.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Organization</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your organization"
                  placeholderTextColor={colors.textTertiary}
                  value={organization}
                  onChangeText={setOrganization}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your location"
                  placeholderTextColor={colors.textTertiary}
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading && !email && !password ? ( // simple check if google login is loading vs email
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                {isLogin ? 'Sign In' : 'Create Account'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setEmail('');
              setPhone('');
              setPassword('');
              setFullName('');
              setOrganization('');
              setLocation('');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.switchText}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: Theme, themeMode: 'light' | 'dark') => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
    zIndex: 10,
  },
  themeToggle: {
    padding: 10,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoWrapper: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 0.36,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 17,
    color: colors.textSecondary,
    letterSpacing: -0.41,
  },
  formContainer: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  googleIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 12,
    color: colors.textTertiary,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    letterSpacing: -0.08,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    fontSize: 17,
    backgroundColor: colors.background,
    color: colors.text,
    letterSpacing: -0.41,
  },
  roleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  roleButtonSelected: {
    backgroundColor: colors.primary + '18',
    borderColor: colors.primary,
  },
  roleIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  roleButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  roleButtonTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.textTertiary,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.41,
  },
  switchButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  switchText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
  switchTextBold: {
    color: colors.primary,
    fontWeight: '600',
  },
});
