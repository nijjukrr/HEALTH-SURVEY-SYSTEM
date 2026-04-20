import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import MapView, { Marker, Circle } from './Map';

interface HotspotZone {
    id: string;
    name: string;
    level: 'safe' | 'caution' | 'contaminated' | 'outbreak';
    cases: number;
    waterSources: number;
    latitude: number;
    longitude: number;
}

interface HotspotMapProps {
    zones?: HotspotZone[];
    onZonePress?: (zone: HotspotZone) => void;
}

const defaultZones: HotspotZone[] = [
    { id: '1', name: 'Singanallur Lake', level: 'outbreak', cases: 22, waterSources: 1, latitude: 10.9934, longitude: 77.0188 },
    { id: '2', name: 'Ukkadam Tank', level: 'contaminated', cases: 8, waterSources: 2, latitude: 10.9856, longitude: 76.9583 },
    { id: '3', name: 'Kuruchi Kulam', level: 'caution', cases: 5, waterSources: 4, latitude: 10.9542, longitude: 76.9611 },
    { id: '4', name: 'Vellalore Dump', level: 'outbreak', cases: 18, waterSources: 1, latitude: 10.9634, longitude: 77.0016 },
    { id: '5', name: 'Bhavani River (Sirumugai)', level: 'contaminated', cases: 11, waterSources: 2, latitude: 11.3323, longitude: 77.0003 },
    { id: '6', name: 'Jadayampalayam', level: 'caution', cases: 4, waterSources: 3, latitude: 11.2589, longitude: 76.9832 },
    { id: '7', name: 'Saravanampatti', level: 'caution', cases: 3, waterSources: 3, latitude: 11.0776, longitude: 76.9942 },
    { id: '8', name: 'RS Puram', level: 'safe', cases: 0, waterSources: 5, latitude: 11.0069, longitude: 76.9454 },
    { id: '9', name: 'Peelamedu', level: 'safe', cases: 0, waterSources: 6, latitude: 11.0264, longitude: 77.0041 },
    { id: '10', name: 'Town Hall', level: 'safe', cases: 0, waterSources: 7, latitude: 10.9997, longitude: 76.9636 },
    { id: '11', name: 'Gandhipuram', level: 'safe', cases: 1, waterSources: 5, latitude: 11.0181, longitude: 76.9669 },
    { id: '12', name: 'Thudiyalur', level: 'safe', cases: 0, waterSources: 8, latitude: 11.0722, longitude: 76.9419 },
];

const levelConfig = {
    safe: { color: '#34C759', bg: 'rgba(52, 199, 89, 0.4)', icon: 'water', label: 'Safe' },
    caution: { color: '#FF9500', bg: 'rgba(255, 149, 0, 0.4)', icon: 'warning', label: 'Caution' },
    contaminated: { color: '#FF6B35', bg: 'rgba(255, 107, 53, 0.4)', icon: 'skull', label: 'Contaminated' },
    outbreak: { color: '#FF3B30', bg: 'rgba(255, 59, 48, 0.4)', icon: 'nuclear', label: 'Outbreak' },
};

const HotspotMap: React.FC<HotspotMapProps> = ({ zones = defaultZones, onZonePress }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const cols = 4;
    const rows = Math.ceil(zones.length / cols);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contamination Hotspots</Text>
            <Text style={styles.subtitle}>Real-time monitoring across sectors</Text>

            {/* Map Area */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 11.0500, // Roughly Center on Coimbatore and surrounding spots
                        longitude: 76.9800,
                        latitudeDelta: 0.40,
                        longitudeDelta: 0.40,
                    }}
                    zoomEnabled={true}
                    scrollEnabled={true}
                    pitchEnabled={true}
                >
                    {zones.map((zone) => {
                        const cfg = levelConfig[zone.level];
                        return (
                            <React.Fragment key={zone.id}>
                                <Circle
                                    center={{ latitude: zone.latitude, longitude: zone.longitude }}
                                    radius={1000 + (zone.cases * 150)}
                                    fillColor={cfg.bg}
                                    strokeColor={cfg.color}
                                    strokeWidth={2}
                                />
                                <Marker
                                    coordinate={{ latitude: zone.latitude, longitude: zone.longitude }}
                                    title={zone.name}
                                    description={`${zone.cases} cases`}
                                    onPress={() => onZonePress?.(zone)}
                                >
                                    <View style={[styles.markerBadge, { backgroundColor: cfg.color }]}>
                                        <Ionicons name={cfg.icon as any} size={12} color="#FFF" />
                                    </View>
                                </Marker>
                            </React.Fragment>
                        );
                    })}
                </MapView>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                {Object.entries(levelConfig).map(([key, cfg]) => (
                    <View key={key} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: cfg.color }]} />
                        <Text style={styles.legendLabel}>{cfg.label}</Text>
                    </View>
                ))}
            </View>

            {/* Summary */}
            <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.error }]}>
                        {zones.filter(z => z.level === 'outbreak').length}
                    </Text>
                    <Text style={styles.summaryLabel}>Outbreak Zones</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>
                        {zones.filter(z => z.level === 'contaminated').length}
                    </Text>
                    <Text style={styles.summaryLabel}>Contaminated</Text>
                </View>
                <View style={styles.summaryItem}>
                    <Text style={[styles.summaryValue, { color: colors.success }]}>
                        {zones.filter(z => z.level === 'safe').length}
                    </Text>
                    <Text style={styles.summaryLabel}>Safe Zones</Text>
                </View>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xl,
            borderWidth: 1, borderColor: colors.border,
        },
        title: { ...typography.title3, color: colors.text },
        subtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
        mapContainer: {
            height: 300, borderRadius: radius.lg, overflow: 'hidden', marginBottom: spacing.lg,
            borderWidth: 1, borderColor: colors.border,
        },
        map: { width: '100%', height: '100%' },
        grid: { gap: spacing.sm, marginBottom: spacing.lg },
        gridRow: { flexDirection: 'row', gap: spacing.sm },
        gridCell: {
            flex: 1, aspectRatio: 1, borderRadius: radius.lg, borderWidth: 1,
            justifyContent: 'center', alignItems: 'center', padding: spacing.xs,
        },
        cellName: { ...typography.caption2, fontWeight: '700' },
        cellCases: { ...typography.caption2, color: colors.textTertiary, marginTop: 1 },
        markerBadge: {
            width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center',
            borderWidth: 2, borderColor: '#FFFFFF', shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5,
        },
        legend: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: spacing.lg },
        legendItem: { flexDirection: 'row', alignItems: 'center' },
        legendDot: { width: 8, height: 8, borderRadius: 4, marginRight: spacing.xs },
        legendLabel: { ...typography.caption2, color: colors.textSecondary },
        summaryRow: {
            flexDirection: 'row', justifyContent: 'space-around',
            paddingTop: spacing.md, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.borderLight,
        },
        summaryItem: { alignItems: 'center' },
        summaryValue: { ...typography.title2 },
        summaryLabel: { ...typography.caption2, color: colors.textSecondary, marginTop: 2 },
    });

export default React.memo(HotspotMap);
