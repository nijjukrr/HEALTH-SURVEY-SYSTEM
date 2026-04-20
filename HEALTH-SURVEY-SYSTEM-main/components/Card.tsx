import React, { useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, themes, typography, spacing, radius } from '../lib/ThemeContext';

interface CardProps {
  title: string;
  date: string;
  description: string;
  location: string;
  type: 'outbreak' | 'water_quality' | 'prevention' | 'alert';
  severity: 'critical' | 'high' | 'medium' | 'low';
  caseCount?: number;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ title, date, description, location, type, severity, caseCount, onPress }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.98,
      tension: 100,
      friction: 10,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      tension: 40,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getSeverityColor = () => {
    if (severity === 'high') return colors.error;
    if (severity === 'medium') return colors.warning;
    return colors.success;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'outbreak': return 'bug';
      case 'water_quality': return 'water';
      case 'prevention': return 'shield-checkmark';
      case 'alert': return 'warning';
      default: return 'stats-chart';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'outbreak': return 'Disease Outbreak';
      case 'water_quality': return 'Water Quality';
      case 'prevention': return 'Prevention';
      case 'alert': return 'Alert';
      default: return 'Report';
    }
  };

  const severityColor = getSeverityColor();

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.card}>
          {/* Severity indicator bar */}
          <View style={[styles.severityBar, { backgroundColor: severityColor }]} />

          <View style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <View style={styles.headerLeft}>
                <Ionicons name={getTypeIcon() as any} size={24} color={colors.text} style={styles.icon} />
                <View style={styles.headerText}>
                  <Text style={styles.title} numberOfLines={2}>{title}</Text>
                  <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
                </View>
              </View>
              <View style={[styles.severityBadge, { backgroundColor: severityColor + '18' }]}>
                <Text style={[styles.severityText, { color: severityColor }]}>
                  {severity.toUpperCase()}
                </Text>
              </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>{description}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.location}>📍 {location}</Text>
              <Text style={styles.date}>{formatDate(date)}</Text>
            </View>

            {caseCount !== undefined && (
              <View style={styles.caseCountRow}>
                <Text style={styles.caseCountLabel}>Reported Cases</Text>
                <Text style={[styles.caseCountValue, { color: severityColor }]}>{caseCount}</Text>
              </View>
            )}
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  card: {
    backgroundColor: colors.glass,
    borderRadius: radius.xl,
    marginBottom: spacing.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  severityBar: {
    height: 3,
    width: '100%',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: spacing.md,
  },
  icon: {
    fontSize: 20,
    marginRight: spacing.md,
    marginTop: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    ...typography.headline,
    color: colors.text,
    lineHeight: 22,
  },
  typeLabel: {
    ...typography.caption2,
    color: colors.primary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 2,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
  },
  severityText: {
    ...typography.caption2,
    fontWeight: '700',
  },
  description: {
    ...typography.subhead,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  location: {
    ...typography.caption1,
    color: colors.textSecondary,
    flex: 1,
  },
  date: {
    ...typography.caption1,
    color: colors.textTertiary,
    fontWeight: '500',
  },
  caseCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  caseCountLabel: {
    ...typography.caption1,
    color: colors.textSecondary,
  },
  caseCountValue: {
    ...typography.title3,
  },
});

export default React.memo(Card);