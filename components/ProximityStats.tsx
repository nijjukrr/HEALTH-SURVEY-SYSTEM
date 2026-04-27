import React, { useMemo, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { outbreaks } from '../lib/mockData';

interface ProximityData {
    radius: string;
    cases: number;
    contamination: number;
}

interface ProximityStatsProps {
    userLocation?: { lat: number; lng: number };
}

// Simulated User Location (Coimbatore Center)
const defaultLocation = { lat: 11.0168, lng: 76.9558 };

// Haversine formula to calculate distance between two coordinates in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

const ProximityStats: React.FC<ProximityStatsProps> = ({ userLocation = defaultLocation }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const data = useMemo(() => {
        const rings = [
            { limit: 5.0, label: '5 km' },
            { limit: 15.0, label: '15 km' },
            { limit: 30.0, label: '30 km' },
            { limit: 50.0, label: '50 km' },
            { limit: 100.0, label: '100 km' }
        ];

        const aggregatedData = rings.map(ring => ({
            radius: ring.label,
            limit: ring.limit,
            cases: 0,
            contamination: 0
        }));

        // In our mock data, regions are named 'mawsynram', 'coimbatore', etc.
        // We will just process all active outbreaks to see what falls in the radius
        const activeOutbreaks = outbreaks.filter(o => o.status === 'active');

        activeOutbreaks.forEach(outbreak => {
            const distance = calculateDistance(
                userLocation.lat,
                userLocation.lng,
                outbreak.coordinates?.latitude || userLocation.lat,
                outbreak.coordinates?.longitude || userLocation.lng
            );

            // Add cases to all rings that cover this distance
            aggregatedData.forEach(ring => {
                if (distance <= ring.limit) {
                    ring.cases += outbreak.caseCount || 1; // Default to 1 case if unknown
                    ring.contamination += 1; // Count each outbreak location as 1 contaminated source
                }
            });
        });

        return aggregatedData;
    }, [userLocation]);

    const [selectedIndex, setSelectedIndex] = useState<number>(data.length - 1);
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const handleSelect = (index: number) => {
        if (index === selectedIndex) return;
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 150,
            useNativeDriver: true,
            easing: Easing.out(Easing.ease)
        }).start(() => {
            setSelectedIndex(index);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 250,
                useNativeDriver: true,
                easing: Easing.in(Easing.ease)
            }).start();
        });
    };

    const ringsToRender = [...data].map((item, index) => ({ item, originalIndex: index })).reverse();
    const selectedData = data[selectedIndex];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Nearby Cases</Text>
            <Text style={styles.subtitle}>Water-borne illness reports near you</Text>

            {/* Concentric rings visual */}
            <View style={styles.ringsContainer}>
                {ringsToRender.map(({ item, originalIndex }) => {
                    const size = 60 + originalIndex * 36;
                    const isSelected = originalIndex === selectedIndex;
                    const opacity = isSelected ? 0.2 : 0.08 + (originalIndex * 0.04);
                    return (
                        <TouchableOpacity
                            key={item.radius}
                            activeOpacity={0.8}
                            onPress={() => handleSelect(originalIndex)}
                            style={[styles.ring, {
                                width: size, height: size, borderRadius: size / 2,
                                backgroundColor: isSelected ? `rgba(255, 59, 48, 0.25)` : `rgba(255, 59, 48, ${opacity})`,
                                borderColor: isSelected ? colors.error : `rgba(255, 59, 48, ${0.15 + originalIndex * 0.05})`,
                                borderWidth: isSelected ? 2 : 1,
                                zIndex: 10 - originalIndex
                            }]}
                        >
                            <Text style={[
                                styles.ringLabel,
                                isSelected ? { color: colors.text, fontWeight: '700' } : { color: colors.textSecondary }
                            ]}>
                                {item.radius}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
                <View style={styles.ringCenter} pointerEvents="none">
                    <Text style={styles.ringCenterIcon}>📍</Text>
                    <Text style={styles.ringCenterText}>You</Text>
                </View>
            </View>

            {/* Animated Selected Data */}
            <Animated.View style={[styles.selectedDataContainer, { opacity: fadeAnim }]}>
                <Text style={styles.selectedRadiusTitle}>Within {selectedData.radius}</Text>
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValueCases}>{selectedData.cases}</Text>
                        <Text style={styles.statLabel}>Cases</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statBox}>
                        <Text style={styles.statValueContamination}>{selectedData.contamination}</Text>
                        <Text style={styles.statLabel}>Contaminated</Text>
                    </View>
                </View>
            </Animated.View>

            <View style={styles.footer}>
                <View style={styles.footerDot} />
                <Text style={styles.footerText}>Based on reported cases in last 14 days</Text>
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
        ringsContainer: {
            height: 250, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl,
        },
        ring: {
            position: 'absolute',
            justifyContent: 'flex-start',
            alignItems: 'center',
            paddingTop: 2,
        },
        ringLabel: {
            ...typography.caption2,
            fontSize: 10,
            opacity: 0.8,
        },
        ringCenter: { alignItems: 'center', zIndex: 10, position: 'absolute' },
        ringCenterIcon: { fontSize: 20 },
        ringCenterText: { ...typography.caption2, color: colors.textSecondary, marginTop: 2 },
        selectedDataContainer: {
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
            borderRadius: radius.lg,
            padding: spacing.lg,
            marginTop: spacing.sm,
            marginBottom: spacing.sm,
        },
        selectedRadiusTitle: {
            ...typography.callout,
            color: colors.textSecondary,
            marginBottom: spacing.md,
            fontWeight: '600',
        },
        statsRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        statBox: {
            flex: 1,
            alignItems: 'center',
        },
        statDivider: {
            width: 1,
            height: 40,
            backgroundColor: colors.borderLight,
        },
        statValueCases: {
            ...typography.title1,
            color: colors.error,
            fontWeight: 'bold',
            fontSize: 32,
        },
        statValueContamination: {
            ...typography.title1,
            color: colors.warning,
            fontWeight: 'bold',
            fontSize: 32,
        },
        statLabel: {
            ...typography.caption1,
            color: colors.textSecondary,
            marginTop: 4,
            textTransform: 'uppercase',
            letterSpacing: 0.5,
        },
        footer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md },
        footerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.textTertiary, marginRight: spacing.sm },
        footerText: { ...typography.caption2, color: colors.textTertiary },
    });

export default React.memo(ProximityStats);
