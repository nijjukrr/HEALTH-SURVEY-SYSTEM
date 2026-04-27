import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface ProfilePageProps {
    onBack: () => void;
    onNavigate: (screen: string) => void;
    onLogout?: () => void;
    userName?: string;
    userEmail?: string;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onBack, onNavigate, onLogout, userName = 'User', userEmail = '' }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const menuItems = [
        { icon: 'settings-outline', label: 'Preferences', onPress: () => onNavigate('Settings') },
        { icon: 'document-text-outline', label: 'Health Certificate', onPress: () => onNavigate('HealthCertificate') },
        { icon: 'log-out-outline', label: 'Sign Out', onPress: () => onLogout && onLogout(), color: colors.error },
    ];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onBack} style={styles.backButton} activeOpacity={0.6}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            <View style={styles.profileHeader}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{getInitials(userName)}</Text>
                    <View style={styles.statusBadge}>
                        <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
                    </View>
                </View>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
                <View style={styles.roleBadge}>
                    <Text style={styles.roleText}>HEALTH WORKER</Text>
                </View>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>156</Text>
                    <Text style={styles.statLabel}>Reports</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>32</Text>
                    <Text style={styles.statLabel}>Regions</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>4</Text>
                    <Text style={styles.statLabel}>Badges</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account Options</Text>
                <View style={styles.card}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity
                            key={item.label}
                            style={[styles.menuRow, index < menuItems.length - 1 && styles.borderBottom]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuLeft}>
                                <Ionicons name={item.icon as any} size={22} color={item.color || colors.textSecondary} />
                                <Text style={[styles.menuLabel, item.color && { color: item.color }]}>{item.label}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color={colors.textTertiary} />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: colors.background },
        header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, flexDirection: 'row', alignItems: 'center' },
        backButton: { marginRight: spacing.md },
        headerTitle: { ...typography.largeTitle, color: colors.text },
        profileHeader: { alignItems: 'center', paddingVertical: spacing.xl },
        avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md, position: 'relative' },
        avatarText: { ...typography.largeTitle, color: '#FFF', fontSize: 36 },
        statusBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.success, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: colors.background },
        userName: { ...typography.title2, color: colors.text, marginBottom: 4 },
        userEmail: { ...typography.subhead, color: colors.textSecondary, marginBottom: spacing.md },
        roleBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: spacing.md, paddingVertical: 4, borderRadius: radius.sm },
        roleText: { ...typography.caption2, color: colors.primary, fontWeight: '700' },
        statsContainer: { flexDirection: 'row', backgroundColor: colors.surface, marginHorizontal: spacing.lg, borderRadius: radius.xl, paddingVertical: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.xl },
        statBox: { flex: 1, alignItems: 'center' },
        statValue: { ...typography.title3, color: colors.text },
        statLabel: { ...typography.caption1, color: colors.textSecondary, marginTop: 4 },
        divider: { width: 1, backgroundColor: colors.borderLight, marginVertical: spacing.sm },
        section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
        sectionTitle: { ...typography.footnote, color: colors.textSecondary, fontWeight: '600', textTransform: 'uppercase', marginBottom: spacing.sm, paddingLeft: spacing.sm },
        card: { backgroundColor: colors.surface, borderRadius: radius.xl, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
        menuRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
        borderBottom: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight },
        menuLeft: { flexDirection: 'row', alignItems: 'center' },
        menuLabel: { ...typography.callout, color: colors.text, marginLeft: spacing.md },
    });

export default React.memo(ProfilePage);
