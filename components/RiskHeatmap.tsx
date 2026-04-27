import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { regions as allRegions, waterQualityAlerts } from '../lib/mockData';
import MapView, { Circle, Marker } from './Map';

interface RiskHeatmapProps {
    selectedRegion?: string;
}

// Map real regions to coordinates for the map
const regionCoordinates: Record<string, { lat: number; lng: number }> = {
    'shillong': { lat: 25.5788, lng: 91.8833 },
    'mawsynram': { lat: 25.2975, lng: 91.5826 },
    'sohra': { lat: 25.2890, lng: 91.7314 },
    'nongpoh': { lat: 25.9038, lng: 91.8805 },
    'tura': { lat: 25.5147, lng: 90.2033 },
    'jowai': { lat: 25.4485, lng: 92.2001 },
    'dawki': { lat: 25.1884, lng: 92.0156 },
    'coimbatore': { lat: 11.0168, lng: 76.9558 },
    'chiyanda': { lat: 13.0827, lng: 80.2707 }, // Chennai
    'bengaluru': { lat: 12.9716, lng: 77.5946 },
    'mysuru': { lat: 12.2958, lng: 76.6394 },
};

// Exact locations for water sources
const contaminationCoordinates: Record<string, { lat: number; lng: number }> = {
    'nongpoh': { lat: 25.9138, lng: 91.8905 }, // Market area well
    'shillong': { lat: 25.5688, lng: 91.8733 }, // Mountain stream
    'tura': { lat: 25.5247, lng: 90.2133 }, // Municipal supply
    // Mock new alerts near southern areas to pair with the newly mapped regions
    'coimbatore': { lat: 11.0268, lng: 76.9658 },
};

const RiskHeatmap: React.FC<RiskHeatmapProps> = ({ selectedRegion = 'all' }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const displayRegions = allRegions.filter(r => r.id !== 'all');

    const getRiskColor = (level: string, score: number) => {
        if (level === 'critical') return colors.error;
        if (level === 'high') return colors.warning;
        if (level === 'medium') return '#FF9500';
        return colors.success;
    };

    const getRiskBg = (level: string) => {
        if (level === 'critical') return 'rgba(255, 59, 48, 0.4)';
        if (level === 'high') return 'rgba(255, 149, 0, 0.4)';
        if (level === 'medium') return 'rgba(255, 149, 0, 0.2)'; // Lighter orange
        return 'rgba(52, 199, 89, 0.4)';
    };

    const activeContaminations = waterQualityAlerts.filter(w => selectedRegion === 'all' || w.regionId === selectedRegion);

    return (
        <BlurView intensity={80} tint={colors.background === '#000000' ? 'dark' : 'light'} style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Regional Risk Map & Contamination Data</Text>
                <Text style={styles.subtitle}>Geospatial overview of risk levels and water quality alerts</Text>
            </View>

            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    initialRegion={{
                        latitude: 12.0, // Center on South India for the new priorities
                        longitude: 77.0,
                        latitudeDelta: 6.0,
                        longitudeDelta: 6.0,
                    }}
                >
                    {displayRegions.map((region) => {
                        const coords = regionCoordinates[region.id];
                        if (!coords) return null; // Fallback if no coords

                        const isSelected = selectedRegion === 'all' || selectedRegion === region.id;
                        if (!isSelected) return null; // Filter out

                        const riskColor = getRiskColor(region.riskLevel, region.riskScore);
                        const riskBg = getRiskBg(region.riskLevel);

                        // Proportional radius based on cases (with minimum base radius)
                        const activeCases = region.activeCases || 1;
                        const radiusSize = Math.max(5000, activeCases * 600);

                        return (
                            <React.Fragment key={region.id}>
                                <Circle
                                    center={{ latitude: coords.lat, longitude: coords.lng }}
                                    radius={radiusSize}
                                    fillColor={riskBg}
                                    strokeColor={riskColor}
                                    strokeWidth={3}
                                />
                                <Marker
                                    coordinate={{ latitude: coords.lat, longitude: coords.lng }}
                                    title={region.name}
                                    description={`Risk Level: ${region.riskLevel.toUpperCase()} | Active Cases: ${activeCases}`}
                                />
                            </React.Fragment>
                        );
                    })}


                    {/* Render specific water contamination alerts */}
                    {activeContaminations.map((alert) => {
                        const coords = contaminationCoordinates[alert.regionId];
                        if (!coords) return null;

                        const isResolved = alert.status === 'resolved';
                        const dangerColor = isResolved ? colors.success : colors.error;
                        const dangerBg = isResolved ? 'rgba(52, 199, 89, 0.6)' : 'rgba(255, 59, 48, 0.8)';

                        return (
                            <React.Fragment key={`contamination-${alert.id}`}>
                                <Circle
                                    center={{ latitude: coords.lat, longitude: coords.lng }}
                                    radius={2000} // Smaller precision radius for specific sources
                                    fillColor={dangerBg}
                                    strokeColor={dangerColor}
                                    strokeWidth={4}
                                />
                                <Marker
                                    coordinate={{ latitude: coords.lat, longitude: coords.lng }}
                                    title={`🚱 ${alert.title}`}
                                    description={`${alert.location} - Status: ${alert.status.toUpperCase()}`}
                                />
                            </React.Fragment>
                        );
                    })}
                </MapView>
            </View>

            <View style={styles.legend}>
                {[
                    { label: 'Safe', color: colors.success },
                    { label: 'Medium', color: '#FF9500' },
                    { label: 'High Risk', color: colors.warning },
                    { label: 'Critical / Contaminated', color: colors.error },
                ].map((item) => (
                    <View key={item.label} style={styles.legendItem}>
                        <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                        <Text style={styles.legendLabel}>{item.label}</Text>
                    </View>
                ))}
            </View>
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
            marginBottom: spacing.lg,
        },
        title: {
            ...typography.headline,
            color: colors.text,
        },
        subtitle: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 2,
        },
        mapContainer: {
            height: 400,
            borderRadius: radius.lg,
            overflow: 'hidden',
            marginBottom: spacing.lg,
            borderWidth: 1,
            borderColor: colors.border,
        },
        map: {
            width: '100%',
            height: '100%'
        },
        legend: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: spacing.xs,
            gap: spacing.lg,
            flexWrap: 'wrap',
        },
        legendItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 4,
        },
        legendDot: {
            width: 8,
            height: 8,
            borderRadius: 4,
            marginRight: spacing.xs,
        },
        legendLabel: {
            ...typography.caption2,
            color: colors.textSecondary,
        },
    });

export default React.memo(RiskHeatmap);
