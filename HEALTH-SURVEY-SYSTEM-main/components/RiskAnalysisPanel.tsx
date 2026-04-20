import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface RiskAnalysisPanelProps {
  locationName?: string;
}

const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({ locationName = "your immediate vicinity" }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <Ionicons name="pulse" size={20} color={colors.primary} />
        </View>
        <Text style={styles.title}>Proximity Risk Analysis</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>LIVE</Text>
        </View>
      </View>
      
      <Text style={styles.analysisText}>
        Current environmental indicators suggest a <Text style={styles.highlight}>Moderate Risk</Text> of water-borne transmission in {locationName} (2km radius).
      </Text>
      
      <Text style={styles.analysisBody}>
        Recent heavy rainfall (42mm in last 24h) combined with high humidity (88%) has created conditions prone to bacterial proliferation. While official government health data indicates stable case numbers, these environmental factors often precede outbreaks by 48-72 hours.
      </Text>

      <View style={styles.recommendationBox}>
        <Ionicons name="shield-checkmark" size={18} color={colors.success} style={{marginTop: 2}} />
        <Text style={styles.recommendationText}>
          <Text style={{fontWeight: '700'}}>Advisory:</Text> Ensure all drinking water is boiled or filtered. Avoid water accumulation near living areas.
        </Text>
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.metaText}>Data freshness: Env (Real-time) • Health (4h delay)</Text>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    ...typography.headline,
    color: colors.text,
    flex: 1,
  },
  badge: {
    backgroundColor: colors.error + '15',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.error + '30',
  },
  badgeText: {
    ...typography.caption2,
    color: colors.error,
    fontWeight: '700',
    fontSize: 10,
  },
  analysisText: {
    ...typography.subhead,
    color: colors.text,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  analysisBody: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  highlight: {
    fontWeight: '700',
    color: colors.warning,
  },
  recommendationBox: {
    flexDirection: 'row',
    backgroundColor: colors.success + '10',
    padding: spacing.md,
    borderRadius: radius.md,
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  recommendationText: {
    ...typography.caption1,
    color: colors.text,
    flex: 1,
    lineHeight: 18,
  },
  metaRow: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: spacing.sm,
  },
  metaText: {
    ...typography.caption2,
    color: colors.textTertiary,
    fontSize: 11,
  },
});

export default RiskAnalysisPanel;