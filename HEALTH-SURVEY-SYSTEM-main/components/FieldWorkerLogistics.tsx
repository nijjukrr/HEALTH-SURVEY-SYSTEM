import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface DispatchMission {
    id: string;
    title: string;
    location: string;
    priority: 'high' | 'medium' | 'low';
    requires: string[];
    status: 'pending' | 'in-progress' | 'completed';
}

interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    unit: string;
    reorderLevel: number;
    icon: string;
}

const defaultInventory: InventoryItem[] = [
    { id: '1', name: 'ORS Packets', stock: 1250, unit: 'pkts', reorderLevel: 500, icon: 'medical' },
    { id: '2', name: 'Chlorine Tablets', stock: 450, unit: 'btls', reorderLevel: 1000, icon: 'water' },
    { id: '3', name: 'IV Fluids (RL)', stock: 85, unit: 'bags', reorderLevel: 200, icon: 'flask' },
    { id: '4', name: 'Rapid Test Kits', stock: 320, unit: 'kits', reorderLevel: 150, icon: 'eyedrop' },
];

const defaultMissions: DispatchMission[] = [
    { id: 'm1', title: 'Containment Line Setup', location: 'Singanallur (Ward 12)', priority: 'high', requires: ['ORS Packets', 'Chlorine Tablets'], status: 'pending' },
    { id: 'm2', title: 'Water Source Testing', location: 'Ukkadam Tank', priority: 'high', requires: ['Rapid Test Kits'], status: 'in-progress' },
    { id: 'm3', title: 'Routine Clinic Supply', location: 'City General (RS Puram)', priority: 'medium', requires: ['IV Fluids (RL)'], status: 'pending' },
];

const priorityColors = {
    high: '#FF3B30',
    medium: '#FF9500',
    low: '#34C759',
};

const FieldWorkerLogistics: React.FC = () => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const [missions, setMissions] = useState<DispatchMission[]>(defaultMissions);

    const handleAction = (missionId: string, currentStatus: string) => {
        setMissions(prev => prev.map(m => {
            if (m.id === missionId) {
                if (currentStatus === 'pending') {
                    return { ...m, status: 'in-progress' };
                } else if (currentStatus === 'in-progress') {
                    return { ...m, status: 'completed' };
                }
            }
            return m;
        }));
    };

    const handleAutoDispatch = () => {
        setMissions(prev => prev.map(m => {
            if (m.status === 'pending') {
                return { ...m, status: 'in-progress' };
            }
            return m;
        }));
    };

    return (
        <View style={styles.container}>
            {/* Inventory Section */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Critical Supplies Inventory</Text>
                <Text style={styles.sectionSubtitle}>Real-time stock across district warehouses</Text>
                <View style={styles.inventoryGrid}>
                    {defaultInventory.map(item => {
                        const isLow = item.stock <= item.reorderLevel;
                        return (
                            <View key={item.id} style={[styles.inventoryCard, isLow && { borderColor: priorityColors.high }]}>
                                <View style={styles.inventoryHeader}>
                                    <View style={[styles.iconBg, { backgroundColor: isLow ? `${priorityColors.high}15` : `${colors.primary}15` }]}>
                                        <Ionicons name={item.icon as any} size={20} color={isLow ? priorityColors.high : colors.primary} />
                                    </View>
                                    {isLow && <Text style={styles.lowStockBadge}>Low Stock</Text>}
                                </View>
                                <Text style={styles.inventoryName}>{item.name}</Text>
                                <View style={styles.stockRow}>
                                    <Text style={[styles.inventoryStock, isLow && { color: priorityColors.high }]}>{item.stock}</Text>
                                    <Text style={styles.inventoryUnit}>{item.unit}</Text>
                                </View>
                                <Text style={styles.inventoryReorder}>Reorder at {item.reorderLevel}</Text>
                            </View>
                        );
                    })}
                </View>
            </View>

            {/* Dispatches Section */}
            <View style={styles.section}>
                <View style={styles.dispatchHeaderRow}>
                    <Text style={styles.sectionTitle}>Active Dispatches</Text>
                    <TouchableOpacity style={styles.autoDispatchBtn} activeOpacity={0.7} onPress={handleAutoDispatch}>
                        <Ionicons name="flash" size={14} color="#fff" style={{ marginRight: 4 }} />
                        <Text style={styles.autoDispatchText}>AI Auto-Dispatch</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.sectionSubtitle}>Missions triggered by real-time hotspots</Text>

                {missions.filter(m => m.status !== 'completed').map(mission => (
                    <View key={mission.id} style={styles.missionCard}>
                        <View style={styles.missionHeader}>
                            <View style={[styles.priorityDot, { backgroundColor: priorityColors[mission.priority] }]} />
                            <Text style={styles.missionTitle}>{mission.title}</Text>
                            <View style={[styles.statusBadge, mission.status === 'in-progress' && styles.statusActive]}>
                                <Text style={[styles.statusText, mission.status === 'in-progress' && styles.statusTextActive]}>
                                    {mission.status.replace('-', ' ').toUpperCase()}
                                </Text>
                            </View>
                        </View>

                        <View style={styles.missionDetails}>
                            <View style={styles.missionDetailItem}>
                                <Ionicons name="location" size={14} color={colors.textTertiary} />
                                <Text style={styles.missionDetailText}>{mission.location}</Text>
                            </View>
                        </View>

                        <View style={styles.requiresList}>
                            <Text style={styles.requiresLabel}>Required Supplies:</Text>
                            {mission.requires.map(req => (
                                <View key={req} style={styles.requireChip}>
                                    <Text style={styles.requireText}>{req}</Text>
                                </View>
                            ))}
                        </View>

                        <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => handleAction(mission.id, mission.status)}>
                            <Text style={styles.actionButtonText}>
                                {mission.status === 'pending' ? 'Start Deployment' : 'Complete Mission'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) => StyleSheet.create({
    container: { flex: 1, paddingBottom: spacing.xl },
    section: { marginBottom: spacing.xl },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: 4 },
    sectionSubtitle: { ...typography.caption1, color: colors.textSecondary, marginBottom: spacing.md },

    inventoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
    inventoryCard: {
        width: '47%', backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md,
        borderWidth: 1, borderColor: colors.borderLight, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2
    },
    inventoryHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.sm },
    iconBg: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    lowStockBadge: { backgroundColor: '#FF3B3015', color: '#FF3B30', fontSize: 10, fontWeight: '700', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, overflow: 'hidden' },
    inventoryName: { ...typography.footnote, color: colors.textSecondary, marginBottom: 4 },
    stockRow: { flexDirection: 'row', alignItems: 'baseline', marginBottom: 2 },
    inventoryStock: { ...typography.title2, color: colors.text, fontWeight: '700', marginRight: 4 },
    inventoryUnit: { ...typography.caption1, color: colors.textSecondary },
    inventoryReorder: { ...typography.caption2, color: colors.textTertiary, marginTop: spacing.sm },

    dispatchHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    autoDispatchBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.primary, paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.full },
    autoDispatchText: { ...typography.caption1, color: '#fff', fontWeight: '600' },

    missionCard: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.borderLight },
    missionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm },
    priorityDot: { width: 8, height: 8, borderRadius: 4, marginRight: 8 },
    missionTitle: { ...typography.callout, fontWeight: '600', color: colors.text, flex: 1 },
    statusBadge: { backgroundColor: colors.surfaceVariant, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    statusActive: { backgroundColor: `${colors.primary}15` },
    statusText: { fontSize: 10, fontWeight: '700', color: colors.textSecondary },
    statusTextActive: { color: colors.primary },

    missionDetails: { marginBottom: spacing.md },
    missionDetailItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    missionDetailText: { ...typography.footnote, color: colors.textSecondary, marginLeft: 6 },

    requiresList: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: spacing.md },
    requiresLabel: { ...typography.caption2, color: colors.textTertiary, marginRight: 8 },
    requireChip: { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.borderLight, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, marginRight: 6, marginBottom: 4 },
    requireText: { ...typography.caption1, color: colors.textSecondary },

    actionButton: { backgroundColor: colors.surfaceVariant, paddingVertical: 10, borderRadius: radius.md, alignItems: 'center' },
    actionButtonText: { ...typography.footnote, fontWeight: '600', color: colors.primary },
});

export default React.memo(FieldWorkerLogistics);
