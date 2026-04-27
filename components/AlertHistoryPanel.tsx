import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { AlertItem } from '../lib/mockData';

interface AlertHistoryPanelProps {
    alerts: AlertItem[];
    maxItems?: number;
}

const AlertHistoryPanel: React.FC<AlertHistoryPanelProps> = ({ alerts, maxItems = 5 }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const sortedAlerts = useMemo(
        () => [...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, maxItems),
        [alerts, maxItems]
    );

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return colors.error;
            case 'high': return colors.warning;
            case 'medium': return '#FF9500';
            default: return colors.success;
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'outbreak': return 'bug';
            case 'water': return 'water';
            case 'prediction': return 'color-wand';
            default: return 'radio';
        }
    };

    const getTimeAgo = (timestamp: string) => {
        const now = new Date();
        const date = new Date(timestamp);
        const diffMs = now.getTime() - date.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `${diffDays}d ago`;
        if (diffHours > 0) return `${diffHours}h ago`;
        return 'Just now';
    };

    return (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Alert History</Text>
                <Text style={styles.count}>{alerts.length} total</Text>
            </View>

            {sortedAlerts.map((alert, index) => {
                const severityColor = getSeverityColor(alert.severity);
                return (
                    <View
                        key={alert.id}
                        style={[
                            styles.alertItem,
                            index === sortedAlerts.length - 1 && styles.lastItem,
                        ]}
                    >
                        <View style={styles.alertLeft}>
                            <View style={[styles.severityDot, { backgroundColor: severityColor }]} />
                            <Ionicons name={getCategoryIcon(alert.category) as any} size={16} color={colors.text} style={styles.categoryIcon} />
                        </View>

                        <View style={styles.alertContent}>
                            <View style={styles.alertTitleRow}>
                                <Text style={styles.alertTitle} numberOfLines={1}>{alert.title}</Text>
                                {!alert.isRead && <View style={styles.unreadDot} />}
                            </View>
                            <Text style={styles.alertMessage} numberOfLines={1}>{alert.message}</Text>
                            <View style={styles.alertMeta}>
                                <Text style={styles.alertRegion}>{alert.region}</Text>
                                <Text style={styles.alertTime}>{getTimeAgo(alert.timestamp)}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
        </BlurView>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.glass,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            overflow: 'hidden',
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: spacing.lg,
        },
        title: {
            ...typography.headline,
            color: colors.text,
        },
        count: {
            ...typography.caption1,
            color: colors.textSecondary,
            backgroundColor: colors.surfaceVariant,
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderRadius: radius.sm,
            overflow: 'hidden',
        },
        alertItem: {
            flexDirection: 'row',
            paddingVertical: spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: colors.borderLight,
        },
        lastItem: {
            borderBottomWidth: 0,
        },
        alertLeft: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: spacing.md,
        },
        severityDot: {
            width: 6,
            height: 6,
            borderRadius: 3,
            marginRight: spacing.sm,
        },
        categoryIcon: {
            fontSize: 16,
        },
        alertContent: {
            flex: 1,
        },
        alertTitleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        alertTitle: {
            ...typography.subhead,
            fontWeight: '600',
            color: colors.text,
            flex: 1,
        },
        unreadDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: colors.primary,
            marginLeft: spacing.sm,
        },
        alertMessage: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 2,
        },
        alertMeta: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: spacing.xs,
        },
        alertRegion: {
            ...typography.caption2,
            color: colors.primary,
            fontWeight: '500',
        },
        alertTime: {
            ...typography.caption2,
            color: colors.textTertiary,
        },
    });

export default React.memo(AlertHistoryPanel);
