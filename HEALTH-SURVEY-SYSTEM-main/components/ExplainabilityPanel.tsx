import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

interface ProximityRiskAnalysisProps {
    insight?: any; // Assuming PredictionInsight type from mockData
}

const ExplainabilityPanel: React.FC<ProximityRiskAnalysisProps> = ({
    insight
}) => {
    // If insight is provided, use its properties, else default
    const riskLevel = insight?.riskLevel || 'Severe';
    const distanceToHotspot = insight?.distanceToHotspot || 1.2;
    const delay = insight?.delay || "Data fresh as of 12 mins ago";
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getProbabilityColor = (level: string) => {
        if (level === 'Severe' || level === 'High') return colors.error;
        if (level === 'Moderate') return colors.warning;
        return colors.success;
    };

    const probColor = getProbabilityColor(riskLevel);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.diseaseLabel}>Public Health Advisory</Text>
                    <Text style={styles.regionLabel}>Localized Analysis within 2km radius</Text>
                </View>
                <View style={styles.headerRight}>
                    <Text style={[styles.probability, { color: probColor }]}>
                        {riskLevel} Risk
                    </Text>
                    <Text style={styles.timeframe}>{delay}</Text>
                </View>
            </View>

            {/* Analysis Text */}
            <View style={styles.reasoningSection}>
                <Text style={styles.reasoningTitle}>Why does this risk exist?</Text>
                <Text style={styles.reasoningText}>
                    You are currently located {distanceToHotspot}km from a confirmed water contamination source.
                    During the last 14 days, overlapping environmental factors and verified health records
                    indicate a highly contagious environment for diarrheal diseases in your immediate vicinity.
                </Text>
            </View>

            {/* Key Contributing Factors */}
            <View style={styles.factorsSection}>
                <Text style={styles.factorsTitle}>Signal Integration</Text>

                <View style={styles.factorRow}>
                    <Ionicons name="cloud-download-outline" size={20} color={colors.warning} style={styles.factorIcon} />
                    <View style={styles.factorTextContainer}>
                        <Text style={styles.factorName}>Environmental Early Warning</Text>
                        <Text style={styles.factorDesc}>85mm of heavy rainfall preceded by 32°C high temperatures created ideal vector breeding grounds and overwhelmed local drainage systems.</Text>
                    </View>
                </View>

                <View style={styles.factorRow}>
                    <Ionicons name="analytics-outline" size={20} color={colors.error} style={styles.factorIcon} />
                    <View style={styles.factorTextContainer}>
                        <Text style={styles.factorName}>Government Ground Truth</Text>
                        <Text style={styles.factorDesc}>Local authorities confirmed 22 active cholera cases linked to the Singanallur water distribution sector adjacent to your location.</Text>
                    </View>
                </View>
            </View>

            {/* Practical Advice */}
            <View style={[styles.reasoningSection, { backgroundColor: colors.primary + '10' }]}>
                <Text style={[styles.reasoningTitle, { color: colors.primary, marginBottom: spacing.xs }]}>
                    <Ionicons name="shield-checkmark" size={16} /> Protective Actions
                </Text>
                <Text style={styles.reasoningText}>
                    • Boil all drinking water for at least 3 minutes.
                    {'\n'}• Avoid consuming raw street food or unwashed vegetables.
                    {'\n'}• Immediately report symptoms of dehydration via the Telemedicine portal.
                </Text>
            </View>

        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
        },
        headerLeft: {
            flex: 1,
        },
        diseaseLabel: {
            ...typography.title3,
            color: colors.text,
        },
        regionLabel: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 4,
        },
        headerRight: {
            alignItems: 'flex-end',
        },
        probability: {
            ...typography.headline,
        },
        timeframe: {
            ...typography.caption2,
            color: colors.textTertiary,
            marginTop: 4,
        },
        factorsSection: {
            marginBottom: spacing.xl,
        },
        factorsTitle: {
            ...typography.subhead,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.md,
        },
        factorRow: {
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: spacing.md,
        },
        factorIcon: {
            marginRight: spacing.md,
            marginTop: 2,
        },
        factorTextContainer: {
            flex: 1,
        },
        factorName: {
            ...typography.subhead,
            color: colors.text,
            fontWeight: '600',
            marginBottom: 2,
        },
        factorDesc: {
            ...typography.caption1,
            color: colors.textSecondary,
            lineHeight: 18,
        },
        reasoningSection: {
            backgroundColor: colors.surfaceVariant,
            borderRadius: radius.md,
            padding: spacing.lg,
            marginBottom: spacing.lg,
        },
        reasoningTitle: {
            ...typography.subhead,
            fontWeight: '600',
            color: colors.text,
            marginBottom: spacing.sm,
            flexDirection: 'row',
            alignItems: 'center'
        },
        reasoningText: {
            ...typography.callout,
            color: colors.textSecondary,
            lineHeight: 22,
        },
    });

export default React.memo(ExplainabilityPanel);
