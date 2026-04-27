import React, { useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Image, Dimensions, Platform } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { Region } from '../lib/mockData';

interface RegionFilterProps {
    regions: Region[];
    selectedRegion: string;
    onSelect: (regionId: string) => void;
}

const RegionFilter: React.FC<RegionFilterProps> = ({ regions, selectedRegion, onSelect }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const getRiskColor = (level: string) => {
        switch (level) {
            case 'critical': return colors.error;
            case 'high': return colors.warning;
            case 'medium': return '#FF9500';
            default: return colors.success;
        }
    };

    const { width } = Dimensions.get('window');
    const ITEM_WIDTH = width * 0.85;
    const ITEM_SPACING = (width - ITEM_WIDTH) / 2;

    const scrollX = useRef(new Animated.Value(0)).current;

    const renderItem = useCallback(({ item: region, index }: { item: Region; index: number }) => {
        const isSelected = selectedRegion === region.id;
        const riskColor = getRiskColor(region.riskLevel);

        const inputRange = [
            (index - 1) * ITEM_WIDTH,
            index * ITEM_WIDTH,
            (index + 1) * ITEM_WIDTH,
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp',
        });

        const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-ITEM_WIDTH * 0.3, 0, ITEM_WIDTH * 0.3],
            extrapolate: 'clamp',
        });

        const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            extrapolate: 'clamp',
        });

        const placeholderImageUrl = region.id === 'all'
            ? 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80'
            : `https://picsum.photos/seed/${region.id}/800/600`;

        return (
            <Animated.View style={{ width: ITEM_WIDTH, transform: [{ scale }], opacity }}>
                <TouchableOpacity
                    style={[
                        styles.card,
                        isSelected && styles.cardSelected,
                        isSelected && { borderColor: colors.primary },
                    ]}
                    onPress={() => onSelect(region.id)}
                    activeOpacity={0.9}
                >
                    <View style={styles.imageOverflowContainer}>
                        <Animated.Image
                            source={{ uri: placeholderImageUrl }}
                            style={[
                                styles.cardImage,
                                { transform: [{ translateX }] }
                            ]}
                            resizeMode="cover"
                        />
                        <View style={[
                            styles.cardOverlay,
                            isSelected ? { backgroundColor: 'rgba(0,0,0,0.3)' } : { backgroundColor: 'rgba(0,0,0,0.6)' }
                        ]} />
                    </View>

                    <View style={styles.cardContent}>
                        {region.id !== 'all' && (
                            <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
                                <Text style={styles.riskBadgeText}>Risk Score: {region.riskScore}</Text>
                            </View>
                        )}

                        <View style={styles.cardTextContainer}>
                            <Text style={[
                                styles.cardText,
                                isSelected && styles.cardTextSelected
                            ]} numberOfLines={1}>
                                {region.name}
                            </Text>
                            {isSelected && (
                                <Text style={styles.tapToViewText}>Selected · Tap to filter dashboard</Text>
                            )}
                        </View>
                    </View>
                </TouchableOpacity>
            </Animated.View>
        );
    }, [selectedRegion, scrollX, colors, onSelect, ITEM_WIDTH]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Surveillance Regions</Text>
                <Text style={styles.subtitle}>Swipe to select an area</Text>
            </View>

            <Animated.FlatList
                data={regions}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: ITEM_SPACING, paddingBottom: spacing.lg }}
                snapToInterval={ITEM_WIDTH}
                decelerationRate="fast"
                bounces={false}
                renderItem={renderItem}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
            />
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            marginVertical: spacing.md,
            paddingTop: spacing.sm,
        },
        header: {
            paddingHorizontal: spacing.xl,
            marginBottom: spacing.md,
        },
        title: {
            ...typography.largeTitle,
            color: colors.text,
        },
        subtitle: {
            ...typography.subhead,
            color: colors.textSecondary,
            marginTop: 4,
        },
        card: {
            height: 400,
            borderRadius: radius.xxl,
            backgroundColor: colors.surface,
            borderWidth: 2,
            borderColor: 'transparent',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.2,
            shadowRadius: 15,
            elevation: 8,
            marginHorizontal: 8,
        },
        cardSelected: {
            borderWidth: 2,
            elevation: 12,
            shadowOpacity: 0.3,
            shadowRadius: 20,
        },
        imageOverflowContainer: {
            ...StyleSheet.absoluteFillObject,
            borderRadius: radius.xxl,
            overflow: 'hidden',
        },
        cardImage: {
            width: '130%',
            height: '100%',
            position: 'absolute',
            left: '-15%',
        },
        cardOverlay: {
            ...StyleSheet.absoluteFillObject,
        },
        cardContent: {
            flex: 1,
            padding: spacing.xl,
            justifyContent: 'space-between',
        },
        riskBadge: {
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: radius.lg,
        },
        riskBadgeText: {
            ...typography.caption1,
            color: '#fff',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: 1,
        },
        cardTextContainer: {
            marginTop: 'auto',
        },
        cardText: {
            ...typography.title1,
            fontSize: 34,
            color: '#fff',
            fontWeight: '600',
            opacity: 0.9,
            marginBottom: 2,
            textShadowColor: 'rgba(0,0,0,0.5)',
            textShadowOffset: { width: 0, height: 2 },
            textShadowRadius: 6,
        },
        cardTextSelected: {
            opacity: 1,
            fontWeight: '800',
        },
        tapToViewText: {
            ...typography.caption1,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: '500',
        }
    });

export default React.memo(RegionFilter);
