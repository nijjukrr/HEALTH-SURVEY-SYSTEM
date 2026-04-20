import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { dashboardStats } from '../lib/mockData';

interface HeroSectionProps {
  userName: string;
  selectedRegion?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userName, selectedRegion }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    });
  };

  const stats = [
    { value: dashboardStats.activeCases, label: 'Active\nCases', color: colors.error },
    { value: dashboardStats.waterSourcesUnsafe, label: 'Unsafe\nSources', color: colors.warning },
    { value: dashboardStats.alertsActive, label: 'Active\nAlerts', color: '#FF9500' },
    { value: dashboardStats.reportsToday, label: 'Reports\nToday', color: colors.primary },
  ];

  return (
    <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
      {/* Greeting */}
      <View style={styles.greetingSection}>
        <View style={styles.greetingLeft}>
          <Text style={styles.greeting}>{getGreeting()}</Text>
          <Text style={styles.dateText}>{getCurrentDate()}</Text>
        </View>
        <View style={styles.logoCircle}>
          <Image
            source={require('../assets/app_logo.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsRow}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Summary Bar */}
      <View style={styles.summaryBar}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dashboardStats.fieldWorkers}</Text>
          <Text style={styles.summaryLabel}>Field Workers</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dashboardStats.villagesAffected}/{dashboardStats.villagesTotal}</Text>
          <Text style={styles.summaryLabel}>Villages Affected</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{dashboardStats.peopleEducated}</Text>
          <Text style={styles.summaryLabel}>People Educated</Text>
        </View>
      </View>
    </BlurView>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: {
    margin: spacing.lg,
    backgroundColor: colors.glass,
    borderRadius: radius.xxl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    overflow: 'hidden',
  },
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greetingLeft: {
    flex: 1,
  },
  greeting: {
    ...typography.title2,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  dateText: {
    ...typography.subhead,
    color: colors.textSecondary,
  },
  logoCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 26,
    height: 26,
    tintColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'center',
  },
  statValue: {
    ...typography.title2,
    marginBottom: 2,
  },
  statLabel: {
    ...typography.caption2,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 14,
  },
  summaryBar: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    ...typography.headline,
    color: colors.text,
    marginBottom: 2,
  },
  summaryLabel: {
    ...typography.caption2,
    color: colors.textSecondary,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.xs,
  },
});

export default React.memo(HeroSection);