import React, { useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

type RiskLevel = 'low' | 'moderate' | 'high' | 'critical';

interface HealthStatusBadgeProps {
    riskLevel: RiskLevel;
    lastAssessed?: string;
    compact?: boolean;
}

const riskConfig: Record<RiskLevel, { color: string; bg: string; label: string; icon: string; message: string }> = {
    low: { color: '#34C759', bg: '#34C75915', label: 'Low Risk', icon: 'checkmark-circle', message: 'You are safe. Continue practicing good hygiene.' },
    moderate: { color: '#FF9500', bg: '#FF950015', label: 'Moderate Risk', icon: 'warning', message: 'Take precautions. Boil drinking water.' },
    high: { color: '#FF6B35', bg: '#FF6B3515', label: 'High Risk', icon: 'warning', message: 'Visit a health center for a check-up.' },
    critical: { color: '#FF3B30', bg: '#FF3B3015', label: 'Critical', icon: 'close-circle', message: 'Seek medical attention immediately.' },
};

const HealthStatusBadge: React.FC<HealthStatusBadgeProps> = ({ riskLevel, lastAssessed, compact = false }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const config = riskConfig[riskLevel];

    useEffect(() => {
        if (riskLevel === 'critical' || riskLevel === 'high') {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.05, duration: 1000, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                ])
            ).start();
        }
    }, [riskLevel]);

    if (compact) {
        return (
            <View style={[styles.compactBadge, { backgroundColor: config.bg, borderColor: config.color }]}>
                <View style={[styles.compactDot, { backgroundColor: config.color }]} />
                <Text style={[styles.compactLabel, { color: config.color }]}>{config.label}</Text>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { backgroundColor: config.bg, borderColor: config.color, transform: [{ scale: pulseAnim }] }]}>
            <View style={styles.topRow}>
                <View style={[styles.iconCircle, { backgroundColor: config.color }]}>
                    <Ionicons name={config.icon as any} size={24} color="#FFFFFF" />
                </View>
                <View style={styles.labelContainer}>
                    <Text style={styles.statusLabel}>Your Health Status</Text>
                    <Text style={[styles.riskLabel, { color: config.color }]}>{config.label}</Text>
                </View>
            </View>
            <Text style={styles.message}>{config.message}</Text>
            {lastAssessed && (
                <Text style={styles.timestamp}>Last assessed: {lastAssessed}</Text>
            )}
        </Animated.View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            borderRadius: radius.xl, padding: spacing.xl, borderWidth: 1.5,
            marginHorizontal: spacing.lg, marginBottom: spacing.lg,
        },
        topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
        iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
        iconText: { fontSize: 20, color: '#FFFFFF', fontWeight: '700' },
        labelContainer: { marginLeft: spacing.lg, flex: 1 },
        statusLabel: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
        riskLabel: { ...typography.title3, marginTop: 2 },
        message: { ...typography.subhead, color: colors.textSecondary, lineHeight: 22 },
        timestamp: { ...typography.caption2, color: colors.textTertiary, marginTop: spacing.sm },
        compactBadge: {
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md,
            paddingVertical: spacing.xs, borderRadius: radius.md, borderWidth: 1, alignSelf: 'flex-start',
        },
        compactDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.sm },
        compactLabel: { ...typography.caption1, fontWeight: '700' },
    });

export default React.memo(HealthStatusBadge);
