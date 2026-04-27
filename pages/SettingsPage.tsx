import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface SettingsPageProps {
  onNavigate: (screen: string) => void;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

interface UserData {
  name: string;
  email: string;
  role: string;
  organization: string;
  location: string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onNavigate, userId, userEmail, userName }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const [userData, setUserData] = useState<UserData>({
    name: userName || '',
    email: userEmail || '',
    role: '',
    organization: '',
    location: '',
  });
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          setUserData({
            name: profile.full_name || userName || 'User',
            email: user.email || '',
            role: profile.role || 'volunteer',
            organization: profile.organization || '',
            location: profile.location || '',
          });
        }
      }
    } catch {
      // Silently handle
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: userData.name,
            organization: userData.organization,
            location: userData.location,
          })
          .eq('id', user.id);

        if (error) throw error;
        Alert.alert('Success', 'Profile updated successfully');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setShowLogoutModal(false);
      onNavigate('Auth');
    } catch {
      Alert.alert('Error', 'Failed to sign out');
    }
  }, [onNavigate]);

  const SettingRow = ({ icon, label, value, onPress, trailing, editable, onChangeText, keyboardType = 'default' }: {
    icon: any;
    label: string;
    value?: string;
    onPress?: () => void;
    trailing?: React.ReactNode;
    editable?: boolean;
    onChangeText?: (text: string) => void;
    keyboardType?: any;
  }) => (
    <TouchableOpacity
      style={styles.settingRow}
      onPress={onPress}
      activeOpacity={onPress ? 0.6 : 1}
      disabled={!onPress && !editable}
    >
      <Ionicons name={icon} size={20} color={colors.textSecondary} style={{ marginRight: 16 }} />
      <View style={styles.settingContent}>
        <Text style={styles.settingLabel}>{label}</Text>
        {editable ? (
          <TextInput
            style={styles.settingInput}
            value={value}
            onChangeText={onChangeText}
            placeholder={`Enter ${label}`}
            placeholderTextColor={colors.textTertiary}
            keyboardType={keyboardType}
          />
        ) : (
          value ? <Text style={styles.settingValue}>{value}</Text> : null
        )}
      </View>
      {trailing || (onPress && <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />)}
    </TouchableOpacity>
  );

  const ToggleSwitch = ({ value, onToggle }: { value: boolean; onToggle: () => void }) => (
    <TouchableOpacity
      style={[styles.toggle, value && styles.toggleActive]}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.toggleKnob, value && styles.toggleKnobActive]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Dashboard')} style={styles.backButton} activeOpacity={0.6}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userData.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : <Ionicons name="person" size={32} color="#FFFFFF" />}
          </Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{userData.name || 'User'}</Text>
          <Text style={styles.profileEmail}>{userData.email}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{userData.role?.toUpperCase() || 'VOLUNTEER'}</Text>
          </View>
        </View>
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeaderRow}>
          <Text style={[styles.sectionTitle, { marginBottom: 0, paddingLeft: 0 }]}>Account</Text>
          <TouchableOpacity onPress={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Text style={styles.saveButtonText}>Save</Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.sectionCard}>
          <SettingRow
            icon="person"
            label="Full Name"
            value={userData.name}
            editable
            onChangeText={(text) => setUserData({ ...userData, name: text })}
          />
          <SettingRow
            icon="mail"
            label="Email"
            value={userData.email}
            editable
            keyboardType="email-address"
            onChangeText={(text) => setUserData({ ...userData, email: text })}
          />
          <SettingRow
            icon="business"
            label="Organization"
            value={userData.organization}
            editable
            onChangeText={(text) => setUserData({ ...userData, organization: text })}
          />
          <SettingRow
            icon="location"
            label="Location"
            value={userData.location}
            editable
            onChangeText={(text) => setUserData({ ...userData, location: text })}
          />
        </View>
      </View>

      {/* Preferences Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.sectionCard}>
          <SettingRow
            icon={theme === 'dark' ? 'moon' : 'sunny'}
            label="Dark Mode"
            trailing={<ToggleSwitch value={theme === 'dark'} onToggle={toggleTheme} />}
          />
          <SettingRow
            icon="notifications"
            label="Notifications"
            trailing={<ToggleSwitch value={notifications} onToggle={() => setNotifications(v => !v)} />}
          />
          <SettingRow
            icon="location"
            label="Location Services"
            trailing={<ToggleSwitch value={locationServices} onToggle={() => setLocationServices(v => !v)} />}
          />
        </View>
      </View>

      {/* Data Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="sync" label="Sync Frequency" value="Real-time" onPress={() => { }} />
          <SettingRow icon="save" label="Offline Data" value="23 MB" onPress={() => { }} />
          <SettingRow icon="stats-chart" label="Export Reports" onPress={() => { }} />
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingRow icon="help-circle" label="Help Center" onPress={() => { }} />
          <SettingRow icon="bug" label="Report an Issue" onPress={() => { }} />
          <SettingRow icon="information-circle" label="About" value="v1.0.0" onPress={() => { }} />
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => setShowLogoutModal(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />

      {/* Logout Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Sign Out</Text>
            <Text style={styles.modalMessage}>Are you sure you want to sign out?</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setShowLogoutModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmButton}
                onPress={handleLogout}
                activeOpacity={0.7}
              >
                <Text style={styles.modalConfirmText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.lg,
    },
    backButton: {
      marginBottom: spacing.md,
    },
    backText: {
      ...typography.callout,
      color: colors.primary,
      fontWeight: '500',
    },
    headerTitle: {
      ...typography.largeTitle,
      color: colors.text,
    },
    profileCard: {
      flexDirection: 'row',
      alignItems: 'center',
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      padding: spacing.xl,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatar: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatarText: {
      ...typography.headline,
      color: '#FFFFFF',
    },
    profileInfo: {
      marginLeft: spacing.lg,
      flex: 1,
    },
    profileName: {
      ...typography.headline,
      color: colors.text,
    },
    profileEmail: {
      ...typography.caption1,
      color: colors.textSecondary,
      marginTop: 2,
    },
    roleBadge: {
      backgroundColor: colors.primaryLight,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: radius.sm,
      alignSelf: 'flex-start',
      marginTop: spacing.sm,
    },
    roleText: {
      ...typography.caption2,
      color: colors.primary,
      fontWeight: '700',
    },
    section: {
      marginHorizontal: spacing.lg,
      marginBottom: spacing.xl,
    },
    sectionTitle: {
      ...typography.footnote,
      color: colors.textSecondary,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: spacing.sm,
      paddingLeft: spacing.sm,
    },
    sectionCard: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md + 2,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.borderLight,
    },
    settingIcon: {
      fontSize: 18,
      width: 28,
      textAlign: 'center',
    },
    settingContent: {
      flex: 1,
      marginLeft: spacing.md,
    },
    settingLabel: {
      ...typography.callout,
      color: colors.text,
    },
    settingValue: {
      ...typography.caption1,
      color: colors.textSecondary,
      marginTop: 1,
    },
    settingInput: {
      ...typography.caption1,
      color: colors.text,
      marginTop: 1,
      padding: 0,
    },
    sectionHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
      paddingLeft: spacing.sm,
    },
    saveButtonText: {
      ...typography.caption1,
      color: colors.primary,
      fontWeight: '600',
    },
    chevron: {
      fontSize: 22,
      color: colors.textTertiary,
      fontWeight: '300',
    },
    toggle: {
      width: 51,
      height: 31,
      borderRadius: 16,
      backgroundColor: colors.surfaceVariant,
      padding: 2,
      justifyContent: 'center',
    },
    toggleActive: {
      backgroundColor: colors.success,
    },
    toggleKnob: {
      width: 27,
      height: 27,
      borderRadius: 14,
      backgroundColor: '#FFFFFF',
    },
    toggleKnobActive: {
      alignSelf: 'flex-end',
    },
    logoutButton: {
      marginHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      borderWidth: 1,
      borderColor: colors.border,
    },
    logoutText: {
      ...typography.callout,
      color: colors.error,
      fontWeight: '600',
    },
    bottomSpacer: {
      height: 40,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: colors.overlay,
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xxl,
    },
    modalContainer: {
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.xxl,
      width: '100%',
      maxWidth: 320,
      alignItems: 'center',
    },
    modalTitle: {
      ...typography.title3,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    modalMessage: {
      ...typography.subhead,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xl,
    },
    modalActions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    modalCancelButton: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: colors.surfaceVariant,
      borderRadius: radius.md,
    },
    modalCancelText: {
      ...typography.callout,
      color: colors.text,
      fontWeight: '600',
    },
    modalConfirmButton: {
      flex: 1,
      paddingVertical: spacing.md,
      alignItems: 'center',
      backgroundColor: colors.error,
      borderRadius: radius.md,
    },
    modalConfirmText: {
      ...typography.callout,
      color: '#FFFFFF',
      fontWeight: '600',
    },
  });

export default React.memo(SettingsPage);