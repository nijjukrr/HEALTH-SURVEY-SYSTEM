import React, { useState, useMemo, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);
import { AlertItem } from '../lib/mockData';

interface AlertBannerProps {
    alerts: AlertItem[];
    onAlertPress?: (alert: AlertItem) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onAlertPress }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [dismissed, setDismissed] = useState<Set<number>>(new Set());
    const slideAnim = useRef(new Animated.Value(0)).current;

    const unreadAlerts = alerts.filter(
        a => !a.isRead && !dismissed.has(a.id) && (a.severity === 'critical' || a.severity === 'high')
    );

    useEffect(() => {
        if (unreadAlerts.length > 0) {
            Animated.spring(slideAnim, {
                toValue: 1,
                tension: 60,
                friction: 10,
                useNativeDriver: true,
            }).start();
        }
    }, [unreadAlerts.length]);

    if (unreadAlerts.length === 0) return null;

    const currentAlert = unreadAlerts[0];

    const getSeverityColor = (severity: string) => {
        if (severity === 'critical') return colors.error;
        if (severity === 'high') return colors.warning;
        return colors.primary;
    };

    const getSeverityIcon = (severity: string) => {
        if (severity === 'critical') return 'warning';
        if (severity === 'high') return 'alert-circle';
        return 'information-circle';
    };

    const handleDismiss = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
        }).start(() => {
            setDismissed(prev => new Set([...prev, currentAlert.id]));
            slideAnim.setValue(1);
        });
    };

    const severityColor = getSeverityColor(currentAlert.severity);

    return (
        <AnimatedBlurView
            intensity={80}
            tint={colors.background === '#000000' ? 'dark' : 'light'}
            style={[
                styles.container,
                {
                    borderLeftColor: severityColor,
                    transform: [
                        {
                            translateY: slideAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-80, 0],
                            }),
                        },
                    ],
                    opacity: slideAnim,
                },
            ]}
        >
            <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
                onPress={() => onAlertPress && onAlertPress(currentAlert)}
                activeOpacity={0.7}
            >
                <View style={[styles.iconContainer, { backgroundColor: severityColor + '18' }]}>
                    <Ionicons name={getSeverityIcon(currentAlert.severity) as any} size={18} color={severityColor} />
                </View>

                <View style={styles.content}>
                    <Text style={styles.title} numberOfLines={1}>{currentAlert.title}</Text>
                    <Text style={styles.message} numberOfLines={2}>{currentAlert.message}</Text>
                    {unreadAlerts.length > 1 && (
                        <Text style={styles.moreAlerts}>
                            +{unreadAlerts.length - 1} more alert{unreadAlerts.length > 2 ? 's' : ''}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleDismiss} style={styles.dismissButton} activeOpacity={0.7}>
                <Ionicons name="close" size={20} color={colors.textTertiary} />
            </TouchableOpacity>
        </AnimatedBlurView>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.glass,
            marginHorizontal: spacing.lg,
            marginVertical: spacing.sm,
            padding: spacing.lg,
            borderRadius: radius.lg,
            borderLeftWidth: 4,
            borderWidth: 1,
            borderColor: colors.glassBorder,
            overflow: 'hidden',
        },
        iconContainer: {
            width: 36,
            height: 36,
            borderRadius: 18,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: spacing.md,
        },
        icon: {
            fontSize: 18,
            fontWeight: '700',
        },
        content: {
            flex: 1,
        },
        title: {
            ...typography.subhead,
            fontWeight: '600',
            color: colors.text,
        },
        message: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 2,
            lineHeight: 16,
        },
        moreAlerts: {
            ...typography.caption2,
            color: colors.primary,
            fontWeight: '500',
            marginTop: spacing.xs,
        },
        dismissButton: {
            padding: spacing.sm,
            marginLeft: spacing.sm,
        },
        dismissText: {
            ...typography.subhead,
            color: colors.textTertiary,
            fontWeight: '500',
        },
    });

export default React.memo(AlertBanner);
