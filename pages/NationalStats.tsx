import React, { useMemo, useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { fetchCholeraCases, fetchCholeraDeaths, GhoDataPoint } from '../lib/ghoApi';

interface StateData {
    name: string;
    active: number;
    recovered: number;
    deceased: number;
    total: number;
}

interface DiseaseCounter {
    name: string;
    count: number;
    icon: string;
    color: string;
    isLive?: boolean;
}

const nationalSummary = {
    totalCases: 148327,
    activeCases: 12841,
    recovered: 132156,
    deceased: 3330,
    waterSourcesTested: 45200,
    contaminated: 3812,
};

const stateData: StateData[] = [
    { name: 'West Bengal', active: 2340, recovered: 18420, deceased: 480, total: 21240 },
    { name: 'Uttar Pradesh', active: 1890, recovered: 16800, deceased: 520, total: 19210 },
    { name: 'Bihar', active: 1650, recovered: 14200, deceased: 390, total: 16240 },
    { name: 'Maharashtra', active: 1420, recovered: 13600, deceased: 410, total: 15430 },
    { name: 'Madhya Pradesh', active: 1180, recovered: 11400, deceased: 280, total: 12860 },
    { name: 'Rajasthan', active: 980, recovered: 10200, deceased: 250, total: 11430 },
    { name: 'Odisha', active: 870, recovered: 9800, deceased: 220, total: 10890 },
    { name: 'Assam', active: 760, recovered: 8400, deceased: 190, total: 9350 },
    { name: 'Tamil Nadu', active: 620, recovered: 7800, deceased: 170, total: 8590 },
    { name: 'Karnataka', active: 540, recovered: 7200, deceased: 150, total: 7890 },
    { name: 'Kerala', active: 320, recovered: 5600, deceased: 110, total: 6030 },
    { name: 'Gujarat', active: 271, recovered: 4736, deceased: 160, total: 5167 },
];

const trendData = [42, 38, 55, 47, 62, 58, 71, 65, 53, 48, 44, 39, 35, 41, 52, 49, 37, 33, 29, 31, 28, 25, 22, 26, 30, 34, 28, 24, 21, 19];

interface NationalStatsProps {
    onNavigate: (screen: string) => void;
}

const NationalStats: React.FC<NationalStatsProps> = ({ onNavigate }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [sortBy, setSortBy] = useState<'total' | 'active'>('total');

    // Live API Data State
    const [choleraCases, setCholeraCases] = useState<number | null>(null);
    const [choleraDeaths, setCholeraDeaths] = useState<number | null>(null);
    const [isLoadingLive, setIsLoadingLive] = useState(true);

    useEffect(() => {
        const loadLiveData = async () => {
            setIsLoadingLive(true);
            try {
                // Fetching for India (IND)
                const casesData = await fetchCholeraCases('IND', 1);
                const deathsData = await fetchCholeraDeaths('IND', 1);

                if (casesData.length > 0) setCholeraCases(Number(casesData[0].Value));
                if (deathsData.length > 0) setCholeraDeaths(Number(deathsData[0].Value));
            } catch (error) {
                console.error("Failed to load live GHO data", error);
            } finally {
                setIsLoadingLive(false);
            }
        };

        loadLiveData();
    }, []);

    const diseases: DiseaseCounter[] = [
        { name: 'Cholera (API IND)', count: choleraCases ?? 14210, icon: 'water', color: '#FF3B30', isLive: choleraCases !== null },
        { name: 'Typhoid', count: 42890, icon: 'thermometer', color: '#FF9500' },
        { name: 'Dysentery', count: 28310, icon: 'bug', color: '#AF52DE' },
        { name: 'Hepatitis A', count: 18940, icon: 'warning', color: '#FFCC00' },
        { name: 'Leptospirosis', count: 12450, icon: 'paw', color: '#5AC8FA' },
        { name: 'Gastroenteritis', count: 11216, icon: 'sad', color: '#34C759' },
    ];

    const sortedStates = useMemo(() =>
        [...stateData].sort((a, b) => b[sortBy] - a[sortBy]),
        [sortBy]
    );

    const maxTrend = Math.max(...trendData);

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => onNavigate('Dashboard')} activeOpacity={0.6} style={{ marginBottom: spacing.md }}>
                    <Ionicons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>National Statistics</Text>
                <Text style={styles.headerSubtitle}>Water-Borne Disease Surveillance · India</Text>
                {isLoadingLive && <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 8, alignSelf: 'flex-start' }} />}
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryGrid}>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={[styles.summaryCard, styles.summaryCardLarge]}>
                    <Text style={styles.summaryLabel}>Total Cases</Text>
                    <Text style={[styles.summaryValue, { color: colors.text }]}>
                        {nationalSummary.totalCases.toLocaleString()}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Active</Text>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                        {nationalSummary.activeCases.toLocaleString()}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Recovered</Text>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                        {nationalSummary.recovered.toLocaleString()}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Deceased</Text>
                    <Text style={[styles.summaryValue, { color: colors.textSecondary }]}>
                        {nationalSummary.deceased.toLocaleString()}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={[styles.summaryCard, styles.summaryCardLarge]}>
                    <Text style={[styles.summaryLabel, { color: colors.primary }]}>{isLoadingLive ? 'Fetching Live Data...' : 'Cholera Deaths (WHO GHO API)'}</Text>
                    <Text style={[styles.summaryValue, { color: colors.primary, fontWeight: '800' }]}>
                        {choleraDeaths ? choleraDeaths.toLocaleString() : 'Loading...'}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Water Sources Tested</Text>
                    <Text style={[styles.summaryValue, { color: colors.primary }]}>
                        {nationalSummary.waterSourcesTested.toLocaleString()}
                    </Text>
                </BlurView>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Contaminated</Text>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>
                        {nationalSummary.contaminated.toLocaleString()}
                    </Text>
                </BlurView>
            </View>

            {/* 30-Day Trend */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>30-Day Trend</Text>
                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.trendCard}>
                    <View style={styles.trendChart}>
                        {trendData.map((val, idx) => (
                            <View key={idx} style={styles.trendBarContainer}>
                                <View
                                    style={[styles.trendBar, {
                                        height: `${(val / maxTrend) * 100}%`,
                                        backgroundColor: val > 50 ? colors.error : val > 30 ? colors.warning : colors.success,
                                        opacity: 0.5 + (idx / trendData.length) * 0.5,
                                    }]}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={styles.trendLabels}>
                        <Text style={styles.trendLabel}>30 days ago</Text>
                        <Text style={styles.trendLabel}>Today</Text>
                    </View>
                </BlurView>
            </View>

            {/* Disease Breakdown */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>By Disease Type</Text>
                <View style={styles.diseaseGrid}>
                    {diseases.map((disease) => (
                        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} key={disease.name} style={[styles.diseaseCard]}>
                            {disease.isLive && <View style={{ position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: disease.color }} />}
                            <Ionicons name={disease.icon as any} size={28} color={disease.color} style={{ marginBottom: 4 }} />
                            <Text style={styles.diseaseName}>{disease.name}</Text>
                            <Text style={[styles.diseaseCount, { color: disease.color }]}>
                                {isLoadingLive && disease.isLive ? '...' : disease.count.toLocaleString()}
                            </Text>
                        </BlurView>
                    ))}
                </View>
            </View>

            {/* State-wise Table */}
            <View style={styles.section}>
                <View style={styles.tableHeader}>
                    <Text style={styles.sectionTitle}>State-wise Data</Text>
                    <View style={styles.sortButtons}>
                        <TouchableOpacity
                            style={[styles.sortBtn, sortBy === 'total' && styles.sortBtnActive]}
                            onPress={() => setSortBy('total')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sortBtnText, sortBy === 'total' && styles.sortBtnTextActive]}>Total</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.sortBtn, sortBy === 'active' && styles.sortBtnActive]}
                            onPress={() => setSortBy('active')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sortBtnText, sortBy === 'active' && styles.sortBtnTextActive]}>Active</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.stateTable}>
                    <View style={styles.stateTableHead}>
                        <Text style={[styles.stateColHead, { flex: 2 }]}>State</Text>
                        <Text style={styles.stateColHead}>Active</Text>
                        <Text style={styles.stateColHead}>Recovered</Text>
                        <Text style={styles.stateColHead}>Deceased</Text>
                        <Text style={styles.stateColHead}>Total</Text>
                    </View>
                    {sortedStates.map((state, idx) => (
                        <View key={state.name} style={[styles.stateRow, idx % 2 === 0 && styles.stateRowAlt]}>
                            <Text style={[styles.stateName, { flex: 2 }]}>{state.name}</Text>
                            <Text style={[styles.stateVal, { color: colors.error }]}>{state.active.toLocaleString()}</Text>
                            <Text style={[styles.stateVal, { color: colors.success }]}>{state.recovered.toLocaleString()}</Text>
                            <Text style={[styles.stateVal, { color: colors.textSecondary }]}>{state.deceased.toLocaleString()}</Text>
                            <Text style={[styles.stateVal, { fontWeight: '700' }]}>{state.total.toLocaleString()}</Text>
                        </View>
                    ))}
                </BlurView>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Data source: National Water-Borne Disease Surveillance Program</Text>
                <Text style={styles.footerSubtext}>Last updated: 20 Feb 2026, 10:00 AM IST</Text>
            </View>
        </ScrollView>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: { flex: 1, backgroundColor: 'transparent' },
        header: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingTop: spacing.xxl },
        backText: { ...typography.callout, color: colors.primary, fontWeight: '500', marginBottom: spacing.md },
        headerTitle: { ...typography.largeTitle, color: colors.text },
        headerSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
        summaryGrid: {
            flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.lg,
            gap: spacing.sm, marginBottom: spacing.xl,
        },
        summaryCard: {
            flex: 1, minWidth: '30%', backgroundColor: colors.glass, borderRadius: radius.xl,
            padding: spacing.lg, borderWidth: 1, borderColor: colors.glassBorder, overflow: 'hidden'
        },
        summaryCardLarge: { minWidth: '100%' },
        summaryLabel: { ...typography.caption2, color: colors.textTertiary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
        summaryValue: { ...typography.title2, marginTop: spacing.xs },
        section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
        sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.md },
        trendCard: {
            backgroundColor: colors.glass, borderRadius: radius.xl, padding: spacing.lg,
            borderWidth: 1, borderColor: colors.glassBorder, overflow: 'hidden'
        },
        trendChart: { flexDirection: 'row', height: 100, alignItems: 'flex-end', gap: 2, marginBottom: spacing.sm },
        trendBarContainer: { flex: 1, height: '100%', justifyContent: 'flex-end' },
        trendBar: { width: '100%', borderRadius: 2, minHeight: 2 },
        trendLabels: { flexDirection: 'row', justifyContent: 'space-between' },
        trendLabel: { ...typography.caption2, color: colors.textTertiary },
        diseaseGrid: {
            flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, justifyContent: 'space-between'
        },
        diseaseCard: {
            width: '48%', backgroundColor: colors.glass, borderRadius: radius.xl,
            padding: spacing.lg, borderWidth: 1, borderColor: colors.glassBorder, alignItems: 'center', overflow: 'hidden'
        },
        diseaseIcon: { fontSize: 24, marginBottom: spacing.xs },
        diseaseName: { ...typography.caption1, color: colors.textSecondary, fontWeight: '500' },
        diseaseCount: { ...typography.title3, marginTop: 2 },
        tableHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
        sortButtons: { flexDirection: 'row', gap: spacing.xs },
        sortBtn: {
            paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
            borderRadius: radius.md, backgroundColor: colors.surfaceVariant,
        },
        sortBtnActive: { backgroundColor: colors.primary },
        sortBtnText: { ...typography.caption1, color: colors.textSecondary, fontWeight: '600' },
        sortBtnTextActive: { color: '#FFFFFF' },
        stateTable: {
            backgroundColor: colors.glass, borderRadius: radius.xl,
            borderWidth: 1, borderColor: colors.glassBorder, overflow: 'hidden',
        },
        stateTableHead: {
            flexDirection: 'row', paddingVertical: spacing.sm, paddingHorizontal: spacing.md,
            backgroundColor: colors.surfaceVariant,
        },
        stateColHead: {
            ...typography.caption2, color: colors.textSecondary, fontWeight: '700',
            flex: 1, textTransform: 'uppercase', letterSpacing: 0.3, textAlign: 'center',
        },
        stateRow: {
            flexDirection: 'row', paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.md,
            borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight,
        },
        stateRowAlt: { backgroundColor: colors.surfaceVariant + '40' },
        stateName: { ...typography.caption1, color: colors.text, fontWeight: '500', flex: 1 },
        stateVal: { ...typography.caption1, color: colors.text, flex: 1, textAlign: 'center' },
        footer: { alignItems: 'center', paddingVertical: spacing.xxl, marginBottom: spacing.xl },
        footerText: { ...typography.caption2, color: colors.textTertiary },
        footerSubtext: { ...typography.caption2, color: colors.textTertiary, marginTop: 2 },
    });

export default NationalStats;
