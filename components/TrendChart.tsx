import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, PanResponder } from 'react-native';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import { TrendDataPoint } from '../lib/mockData';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

interface TrendChartProps {
    data: TrendDataPoint[];
    title: string;
    subtitle?: string;
    color?: string;
    height?: number;
    showLabels?: boolean;
    unit?: string;
}

const TrendChart: React.FC<TrendChartProps> = ({
    data,
    title,
    subtitle,
    color,
    height = 120,
    showLabels = true,
    unit = '',
}) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const chartColor = color || colors.primary;
    const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const maxValue = Math.max(...data.map(d => d.value));
    const minValue = Math.min(...data.map(d => d.value));
    const range = maxValue - minValue || 1;

    const barWidth = useMemo(() => {
        const screenWidth = Dimensions.get('window').width;
        const chartWidth = screenWidth - spacing.xl * 2 - spacing.xl * 2 - spacing.lg * 2;
        const gap = 6;
        return Math.max(8, (chartWidth - gap * (data.length - 1)) / data.length);
    }, [data.length]);

    const activeDataPoint = activeIndex !== null ? data[activeIndex] : data[data.length - 1];
    const latestValue = activeDataPoint?.value ?? 0;

    const compareIndex = activeIndex !== null ? activeIndex - 1 : data.length - 2;
    const previousValue = (compareIndex >= 0 && compareIndex < data.length) ? data[compareIndex]?.value ?? 0 : latestValue;

    const change = latestValue - previousValue;
    const changePercent = previousValue !== 0 ? ((change / previousValue) * 100).toFixed(1) : '0';
    const isPositive = change >= 0;

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderGrant: (evt) => {
                    handleScrub(evt.nativeEvent.locationX);
                },
                onPanResponderMove: (evt) => {
                    handleScrub(evt.nativeEvent.locationX);
                },
                onPanResponderRelease: () => {
                    setActiveIndex(null);
                },
                onPanResponderTerminate: () => {
                    setActiveIndex(null);
                },
            }),
        [data.length]
    );

    const handleScrub = (x: number) => {
        const screenWidth = Dimensions.get('window').width;
        const paddingOffset = spacing.lg * 2 + spacing.xl * 2;
        const chartWidth = screenWidth - paddingOffset;
        const sliceWidth = chartWidth / data.length;
        let index = Math.floor((x / chartWidth) * data.length);
        if (index < 0) index = 0;
        if (index >= data.length) index = data.length - 1;
        setActiveIndex(index);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.titleContainer}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{title}</Text>
                        {activeIndex !== null && (
                            <View style={[styles.scrubBadge, { backgroundColor: chartColor + '20' }]}>
                                <Text style={[styles.scrubBadgeText, { color: chartColor }]}>
                                    {activeDataPoint.label}
                                </Text>
                            </View>
                        )}
                    </View>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>
                <View style={styles.valueContainer}>
                    <Text style={styles.currentValue}>{latestValue}{unit}</Text>
                    <Text style={[styles.change, { color: isPositive ? colors.error : colors.success }]}>
                        {isPositive ? '↑' : '↓'} {Math.abs(Number(changePercent))}%
                    </Text>
                </View>
            </View>

            <View style={[styles.chartContainer, { height }]} {...panResponder.panHandlers}>
                {chartType === 'bar' ? (
                    data.map((point, index) => {
                        const barHeight = ((point.value - minValue) / Math.max(range, 1)) * (height - 24);
                        const isScrubbing = activeIndex !== null;
                        const isActive = activeIndex === index;
                        let opacity = 0.4 + (index / (data.length - 1)) * 0.6;
                        if (isScrubbing) {
                            opacity = isActive ? 1 : 0.2;
                        }
                        return (
                            <View key={index} style={styles.barColumn}>
                                <View style={styles.barWrapper}>
                                    <View
                                        style={[
                                            styles.bar,
                                            {
                                                height: Math.max(4, barHeight),
                                                width: Math.min(barWidth, 48),
                                                backgroundColor: chartColor,
                                                opacity,
                                                borderRadius: 6,
                                            },
                                        ]}
                                    />
                                </View>
                                {showLabels && (
                                    <Text style={[styles.barLabel, isActive && styles.barLabelActive]}>{point.label}</Text>
                                )}
                            </View>
                        );
                    })
                ) : (() => {
                    const chartWidth = Dimensions.get('window').width - spacing.lg * 2 - spacing.xl * 2;
                    const sliceWidth = chartWidth / data.length;
                    const points = data.map((point, index) => {
                        const x = (index + 0.5) * sliceWidth;
                        const y = (height - 24) - ((point.value - minValue) / Math.max(range, 1)) * (height - 24);
                        return `${x},${Math.max(4, Math.min(y, height - 28))}`;
                    }).join(' ');

                    return (
                        <>
                            <Svg height={height - 24} width="100%" style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}>
                                <Polyline
                                    points={points}
                                    fill="none"
                                    stroke={chartColor}
                                    strokeWidth="3"
                                    opacity={activeIndex !== null ? 0.4 : 1}
                                />
                                {activeIndex !== null && (
                                    <Line
                                        x1={(activeIndex + 0.5) * sliceWidth}
                                        y1={0}
                                        x2={(activeIndex + 0.5) * sliceWidth}
                                        y2={height - 24}
                                        stroke={chartColor}
                                        strokeWidth="1"
                                        strokeDasharray="4, 4"
                                        opacity={0.5}
                                    />
                                )}
                                {data.map((point, index) => {
                                    const x = (index + 0.5) * sliceWidth;
                                    const y = (height - 24) - ((point.value - minValue) / Math.max(range, 1)) * (height - 24);
                                    const isScrubbing = activeIndex !== null;
                                    const isActive = activeIndex === index;
                                    return (
                                        <Circle
                                            key={index}
                                            cx={x}
                                            cy={Math.max(4, Math.min(y, height - 28))}
                                            r={isActive ? "6" : "4"}
                                            fill={isActive ? chartColor : colors.surface}
                                            stroke={chartColor}
                                            strokeWidth={isActive ? "3" : "2"}
                                            opacity={isScrubbing && !isActive ? 0.3 : 1}
                                        />
                                    );
                                })}
                            </Svg>
                            <View style={{ flex: 1, flexDirection: 'row', width: '100%', height: '100%', zIndex: 1 }}>
                                {data.map((point, index) => {
                                    const isActive = activeIndex === index;
                                    return (
                                        <View key={index} style={styles.barColumn}>
                                            <View style={styles.barWrapper} />
                                            {showLabels && (
                                                <Text style={[styles.barLabel, isActive && styles.barLabelActive]}>{point.label}</Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </>
                    );
                })()}
            </View>

            <View style={styles.chartControls}>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => setChartType(prev => (prev === 'bar' ? 'line' : 'bar'))}
                    activeOpacity={0.6}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                    <Ionicons
                        name={chartType === 'bar' ? 'pulse' : 'bar-chart'}
                        size={16}
                        color={colors.primary}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {
            backgroundColor: colors.surface,
            borderRadius: radius.xl,
            padding: spacing.xl,
            borderWidth: 1,
            borderColor: colors.border,
        },
        header: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: spacing.lg,
        },
        titleContainer: {
            flex: 1,
        },
        titleRow: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
        },
        scrubBadge: {
            paddingHorizontal: spacing.sm,
            paddingVertical: 2,
            borderRadius: radius.sm,
        },
        scrubBadgeText: {
            ...typography.caption2,
            fontWeight: 'bold',
        },
        toggleButton: {
            padding: 8,
            backgroundColor: colors.primary + '10',
            borderRadius: radius.md,
            borderWidth: 1,
            borderColor: colors.primary + '25',
        },
        chartControls: {
            flexDirection: 'row',
            justifyContent: 'flex-end',
            marginTop: spacing.sm,
            marginRight: -spacing.sm,
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
        valueContainer: {
            alignItems: 'flex-end',
        },
        currentValue: {
            ...typography.title2,
            color: colors.text,
        },
        change: {
            ...typography.caption1,
            fontWeight: '600',
            marginTop: 2,
        },
        chartContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
        },
        barColumn: {
            alignItems: 'center',
            flex: 1,
        },
        barWrapper: {
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'center',
        },
        bar: {
            minHeight: 4,
        },
        barLabel: {
            ...typography.caption2,
            color: colors.textTertiary,
            marginTop: spacing.xs,
        },
        barLabelActive: {
            color: colors.text,
            fontWeight: 'bold',
        },
    });

export default React.memo(TrendChart);
