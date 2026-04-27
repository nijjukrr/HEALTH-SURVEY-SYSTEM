import React, { useEffect, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  isGuest?: boolean;
  currentScreen?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onNavigate, isGuest = false, currentScreen }) => {
  const translateX = useRef(new Animated.Value(-300)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const { theme, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: isVisible ? 0 : -300,
        tension: 65,
        friction: 11,
        useNativeDriver: true,
      }),
      Animated.timing(overlayOpacity, {
        toValue: isVisible ? 1 : 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isVisible]);

  const menuItems = [
    { icon: 'grid', label: 'Dashboard', screen: 'Dashboard' },
    { icon: 'clipboard', label: 'Self-Assessment', screen: 'SelfAssessment' },
    { icon: 'stats-chart', label: 'National Statistics', screen: 'NationalStats' },
    { icon: 'bug', label: 'Outbreaks', screen: 'Outbreaks' },
    { icon: 'water', label: 'Water Quality', screen: 'WaterQuality' },
    { icon: 'notifications', label: 'Alerts', screen: 'Warnings' },
    { icon: 'map', label: 'Hotspot Map', screen: 'HotspotMap' },
    { icon: 'flask', label: 'Testing Labs', screen: 'TestingLabs' },
    { icon: 'warning', label: 'Emergency Helpline', screen: 'Helpline' },
    { icon: 'document-text', label: 'Health Certificate', screen: 'HealthCertificate' },
    { icon: 'cube', label: 'Field Logistics', screen: 'FieldWorkerLogistics' },
    ...(!isGuest ? [{ icon: 'person', label: 'Profile', screen: 'Profile' }] : []),
    { icon: 'settings', label: 'Settings', screen: 'Settings' },
    {
      icon: theme === 'dark' ? 'sunny' : 'moon',
      label: theme === 'dark' ? 'Light Mode' : 'Dark Mode',
      action: toggleTheme,
    },
    ...(isGuest ? [{ icon: 'log-in', label: 'Sign In', screen: 'Auth' }] : []),
  ];

  return (
    <>
      {isVisible && (
        <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={onClose}
          />
        </Animated.View>
      )}
      <Animated.View
        style={[
          styles.sidebar,
          { transform: [{ translateX }] },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/app_logo.png')}
                style={styles.logoImage}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>HealthDrop</Text>
              <Text style={styles.headerSubtext}>Surveillance System</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Ionicons name="close" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* User card */}
        {!isGuest && (
          <View style={styles.userCard}>
            <View style={styles.userAvatar}>
              <Ionicons name="person" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Health Worker</Text>
              <View style={styles.statusRow}>
                <View style={styles.onlineDot} />
                <Text style={styles.userStatus}>Online</Text>
              </View>
            </View>
          </View>
        )}

        {/* Menu */}
        <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
          {menuItems.map((item, index) => {
            const isActive = 'screen' in item && currentScreen === item.screen;

            return (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  isActive && { backgroundColor: colors.primary + '20' }
                ]}
                activeOpacity={0.6}
                onPress={() => {
                  if ('action' in item && item.action) {
                    item.action();
                  } else if ('screen' in item && item.screen) {
                    onNavigate(item.screen);
                    onClose();
                  }
                }}
              >
                <Ionicons name={item.icon as any} size={22} color={isActive ? colors.primary : colors.textSecondary} style={{ width: 28, textAlign: 'center' }} />
                <Text style={[styles.menuItemText, isActive && { color: colors.primary }]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </Animated.View>
    </>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlay,
    zIndex: 10,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 280,
    backgroundColor: colors.surface,
    zIndex: 11,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: colors.border,
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 22,
    height: 22,
    tintColor: '#FFFFFF',
  },
  headerInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerText: {
    ...typography.headline,
    color: colors.text,
  },
  headerSubtext: {
    ...typography.caption2,
    color: colors.textSecondary,
    marginTop: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceVariant,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    ...typography.caption1,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginVertical: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
  },
  userAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    fontSize: 16,
  },
  userDetails: {
    marginLeft: spacing.md,
    flex: 1,
  },
  userName: {
    ...typography.subhead,
    fontWeight: '600',
    color: colors.text,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
    marginRight: spacing.xs,
  },
  userStatus: {
    ...typography.caption2,
    color: colors.success,
    fontWeight: '500',
  },
  menuItems: {
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.md,
    marginVertical: 1,
  },
  menuItemIcon: {
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  menuItemText: {
    ...typography.callout,
    color: colors.text,
    marginLeft: spacing.md,
    fontWeight: '500',
  },
});

export default React.memo(Sidebar);