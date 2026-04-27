import React, { useMemo, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface HealthCertificateProps {
    userName?: string;
    riskLevel?: 'low' | 'moderate' | 'high' | 'critical';
    lastAssessedDate?: string;
    location?: string;
    certificateId?: string;
}

const HealthCertificate: React.FC<HealthCertificateProps> = ({
    userName = 'Google User',
    riskLevel = 'low',
    lastAssessedDate = '20 Feb 2026, 12:00 PM',
    location = 'New Delhi, India',
    certificateId = 'HD-2026-00482',
}) => {
    const { colors, theme } = useTheme();
    const styles = useMemo(() => createStyles(colors, theme), [colors, theme]);
    const [pulseAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 2000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [pulseAnim]);

    const statusConfig = {
        low: { color: '#00E676', bg: 'rgba(0, 230, 118, 0.15)', label: 'CLEARED', icon: 'shield-checkmark', message: 'No water-borne disease risk detected' },
        moderate: { color: '#FFAB00', bg: 'rgba(255, 171, 0, 0.15)', label: 'ADVISORY', icon: 'warning', message: 'Moderate risk — precautions advised' },
        high: { color: '#FF3D00', bg: 'rgba(255, 61, 0, 0.15)', label: 'RESTRICTED', icon: 'alert-circle', message: 'High risk — medical clearance needed' },
        critical: { color: '#D50000', bg: 'rgba(213, 0, 0, 0.15)', label: 'NOT CLEARED', icon: 'close-circle', message: 'Active infection suspected' },
    };

    const status = statusConfig[riskLevel];

    // Encoded QR code data
    const qrData = useMemo(() => JSON.stringify({
        name: userName,
        risk: riskLevel,
        id: certificateId,
        date: lastAssessedDate,
        location: location
    }), [userName, riskLevel, certificateId, lastAssessedDate, location]);

    const pulseBackgroundColor = pulseAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [status.bg, `${status.color}30`]
    });

    return (
        <View style={styles.container}>
            <View style={[styles.card, { shadowColor: status.color }]}>
                {/* Decorative Background Elements */}
                <View style={[styles.bgCircleTop, { backgroundColor: status.color }]} />
                <View style={[styles.bgCircleBottom, { backgroundColor: colors.primary }]} />
                <View style={styles.glassmorphismLayer} />

                {/* Subdued Watermark */}
                <Text style={styles.watermark} numberOfLines={1}>
                    {status.label}
                </Text>

                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerTextGroup}>
                            <Text style={styles.certTitle}>Health Clearance Verify</Text>
                            <Text style={styles.certSubtitle}>Official Digital Credentials</Text>
                        </View>
                        <Animated.View style={[styles.statusBadge, { borderColor: status.color, backgroundColor: pulseBackgroundColor }]}>
                            <Ionicons name={status.icon as any} size={16} color={status.color} />
                            <Text style={[styles.statusLabel, { color: status.color }]}>{status.label}</Text>
                        </Animated.View>
                    </View>

                    {/* Divider */}
                    <View style={styles.divider} />

                    {/* Info Section */}
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Cardholder Name</Text>
                            <Text style={styles.infoValue}>{userName}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Region</Text>
                            <Text style={styles.infoValue}>{location}</Text>
                        </View>
                    </View>

                    <View style={[styles.infoGrid, { marginTop: spacing.lg }]}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Certificate ID</Text>
                            <Text style={[styles.infoValue, styles.mono]}>{certificateId}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Validation Period</Text>
                            <Text style={styles.infoValue}>72 hours</Text>
                        </View>
                    </View>

                    {/* QR Code and Status Box Row */}
                    <View style={styles.middleSection}>
                        <View style={styles.qrWrapper}>
                            <View style={styles.qrInner}>
                                <QRCode
                                    value={qrData}
                                    size={100}
                                    color="black"
                                    backgroundColor="white"
                                />
                            </View>
                        </View>
                        <View style={styles.statusBoxContainer}>
                            <View style={[styles.statusBanner, { backgroundColor: status.bg, borderColor: status.color }]}>
                                <Ionicons name="information-circle" size={20} color={status.color} style={{ marginRight: 8 }} />
                                <Text style={[styles.statusText, { color: status.color }]}>{status.message}</Text>
                            </View>
                            <Text style={styles.qrLabel}>Tap QR to expand</Text>
                        </View>
                    </View>

                    {/* Footer Info */}
                    <View style={styles.footerInfo}>
                        <Text style={styles.timestamp}>Generated: {lastAssessedDate}</Text>
                        <Text style={styles.authority}>Secured by HealthDrop Blockchain</Text>
                    </View>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnSecondary]} activeOpacity={0.8}>
                        <Ionicons name="share-social" size={18} color={colors.text} style={{ marginRight: 8 }} />
                        <Text style={styles.actionBtnSecondaryText}>Share</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} activeOpacity={0.8}>
                        <Ionicons name="download" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                        <Text style={styles.actionBtnPrimaryText}>Save to Device</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme, themeMode: 'light' | 'dark') => {
    const isDark = themeMode === 'dark';
    return StyleSheet.create({
        container: { paddingVertical: spacing.md },
        card: {
            backgroundColor: isDark ? '#1C1C1E' : '#FFFFFF',
            borderRadius: radius.xxl,
            borderWidth: 1,
            borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
            overflow: 'hidden',
            shadowOffset: { width: 0, height: 12 },
            shadowOpacity: 0.15,
            shadowRadius: 24,
            elevation: 10,
        },
        bgCircleTop: {
            position: 'absolute', width: 200, height: 200, borderRadius: 100,
            top: -80, right: -60, opacity: 0.15, filter: 'blur(40px)',
        },
        bgCircleBottom: {
            position: 'absolute', width: 250, height: 250, borderRadius: 125,
            bottom: -100, left: -80, opacity: 0.1, filter: 'blur(50px)',
        },
        glassmorphismLayer: {
            ...StyleSheet.absoluteFillObject,
            backgroundColor: isDark ? 'rgba(28, 28, 30, 0.7)' : 'rgba(255, 255, 255, 0.7)',
        },
        watermark: {
            position: 'absolute', top: '35%', left: '-5%', width: '110%',
            ...typography.largeTitle, fontSize: 80, fontWeight: '900',
            color: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)',
            textTransform: 'uppercase', textAlign: 'center', transform: [{ rotate: '-15deg' }],
            letterSpacing: 10,
        },
        content: { padding: spacing.xl, paddingTop: spacing.xxl },
        header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
        headerTextGroup: { flex: 1, paddingRight: spacing.md },
        certTitle: { ...typography.title2, color: colors.text, fontWeight: '800', letterSpacing: -0.5 },
        certSubtitle: { ...typography.caption1, color: colors.primary, fontWeight: '600', marginTop: 4, textTransform: 'uppercase' },
        statusBadge: {
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.sm, paddingVertical: 6,
            borderRadius: radius.full, borderWidth: 1,
        },
        statusLabel: { ...typography.caption2, fontWeight: '800', marginLeft: 4, letterSpacing: 0.5 },
        divider: {
            height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            marginVertical: spacing.xl, borderStyle: 'dashed',
        },
        infoGrid: { flexDirection: 'row' },
        infoItem: { flex: 1 },
        infoLabel: { ...typography.caption2, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
        infoValue: { ...typography.body, color: colors.text, fontWeight: '600' },
        mono: { fontFamily: 'monospace', color: colors.primary, letterSpacing: 1 },
        middleSection: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.xxl, gap: spacing.md },
        qrWrapper: {
            padding: spacing.sm, backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : '#F7F7F7',
            borderRadius: radius.xl, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
        },
        qrInner: {
            padding: spacing.sm, backgroundColor: '#FFFFFF', borderRadius: radius.md,
        },
        statusBoxContainer: { flex: 1 },
        statusBanner: {
            flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderRadius: radius.lg,
            borderWidth: 1, borderLeftWidth: 4,
        },
        statusText: { ...typography.caption1, fontWeight: '700', flex: 1 },
        qrLabel: { ...typography.caption2, color: colors.textTertiary, marginTop: spacing.md, textAlign: 'center' },
        footerInfo: { marginTop: spacing.sm, borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', paddingTop: spacing.md },
        timestamp: { ...typography.caption2, color: colors.textTertiary },
        authority: { ...typography.caption2, color: colors.textSecondary, fontWeight: '600', marginTop: 2 },
        actions: {
            flexDirection: 'row', padding: spacing.lg, paddingBottom: spacing.xl,
            backgroundColor: isDark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
            borderTopWidth: 1, borderTopColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)', gap: spacing.md,
        },
        actionBtn: {
            flex: 1, flexDirection: 'row', paddingVertical: spacing.md, justifyContent: 'center', alignItems: 'center', borderRadius: radius.full,
        },
        actionBtnSecondary: { backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)' },
        actionBtnSecondaryText: { ...typography.callout, color: colors.text, fontWeight: '700' },
        actionBtnPrimary: { backgroundColor: colors.primary, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
        actionBtnPrimaryText: { ...typography.callout, color: '#FFFFFF', fontWeight: '700' },
    });
};

export default React.memo(HealthCertificate);
