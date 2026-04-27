import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface Advisory {
    id: string;
    type: 'warning' | 'tip' | 'alert' | 'info';
    title: string;
    body: string;
    source: string;
    date: string;
    priority: 'high' | 'medium' | 'low';
}

interface AdvisoriesPanelProps {
    advisories?: Advisory[];
}

const defaultAdvisories: Advisory[] = [
    {
        id: '1', type: 'alert', priority: 'high',
        title: 'Boil Water Advisory — Sector C, E',
        body: 'Coliform bacteria detected above safe levels. Boil all drinking water for at least 1 minute before consumption.',
        source: 'Municipal Water Authority', date: '2 hours ago',
    },
    {
        id: '2', type: 'warning', priority: 'high',
        title: 'Flood Warning — Low-Lying Areas',
        body: 'Heavy rainfall expected. Avoid untreated flood water. Store clean water in sealed containers.',
        source: 'Indian Meteorological Dept', date: '6 hours ago',
    },
    {
        id: '3', type: 'tip', priority: 'medium',
        title: 'Handwashing Saves Lives',
        body: 'Wash hands with soap for 20 seconds after using the toilet and before eating. Use sanitizer when soap is unavailable.',
        source: 'WHO Guidelines', date: '1 day ago',
    },
    {
        id: '4', type: 'info', priority: 'medium',
        title: 'ORS Preparation at Home',
        body: 'Mix 6 level teaspoons of sugar and ½ level teaspoon of salt in 1 litre of clean water. Give sips frequently to anyone with diarrhea.',
        source: 'ICMR Advisory', date: '2 days ago',
    },
    {
        id: '5', type: 'tip', priority: 'low',
        title: 'Water Purification Methods',
        body: 'Use chlorine tablets (1 per 5L), SODIS (clear bottles in sunlight for 6h), or ceramic filters for remote areas.',
        source: 'Jal Shakti Ministry', date: '3 days ago',
    },
    {
        id: '6', type: 'info', priority: 'low',
        title: 'Recognizing Cholera Symptoms',
        body: 'Sudden watery diarrhea (rice-water stools), vomiting, rapid dehydration. Seek immediate treatment. Cholera kills within hours if untreated.',
        source: 'WHO', date: '5 days ago',
    },
];

const typeConfig = {
    alert: { icon: 'warning', color: '#FF3B30', bgAlpha: '15' },
    warning: { icon: 'warning', color: '#FF9500', bgAlpha: '12' },
    tip: { icon: 'bulb', color: '#34C759', bgAlpha: '12' },
    info: { icon: 'information-circle', color: '#007AFF', bgAlpha: '10' },
};

const AdvisoriesPanel: React.FC<AdvisoriesPanelProps> = ({ advisories = defaultAdvisories }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const sorted = useMemo(() =>
        [...advisories].sort((a, b) => {
            const p = { high: 0, medium: 1, low: 2 };
            return p[a.priority] - p[b.priority];
        }), [advisories]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Advisories & Guidelines</Text>
            <Text style={styles.subtitle}>Official health and water safety guidance</Text>

            {sorted.map((advisory) => {
                const cfg = typeConfig[advisory.type];
                return (
                    <TouchableOpacity key={advisory.id} style={styles.card} activeOpacity={0.8}>
                        <View style={styles.cardHeader}>
                            <View style={[styles.typeIndicator, { backgroundColor: cfg.color }]} />
                            <Ionicons name={cfg.icon as any} size={20} color={cfg.color} style={{ marginRight: 8, marginTop: 2 }} />
                            <View style={styles.cardHeaderContent}>
                                <Text style={styles.cardTitle}>{advisory.title}</Text>
                                <Text style={styles.cardMeta}>{advisory.source} · {advisory.date}</Text>
                            </View>
                            {advisory.priority === 'high' && (
                                <View style={styles.urgentBadge}>
                                    <Text style={styles.urgentText}>URGENT</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.cardBody}>{advisory.body}</Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {},
        title: { ...typography.title3, color: colors.text },
        subtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.lg },
        card: {
            backgroundColor: colors.surface, borderRadius: radius.xl,
            borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
            overflow: 'hidden',
        },
        cardHeader: {
            flexDirection: 'row', alignItems: 'flex-start', padding: spacing.lg, paddingBottom: 0,
        },
        typeIndicator: { width: 3, height: 32, borderRadius: 2, marginRight: spacing.sm },
        cardIcon: { fontSize: 18, marginRight: spacing.sm, marginTop: 2 },
        cardHeaderContent: { flex: 1 },
        cardTitle: { ...typography.callout, color: colors.text, fontWeight: '600' },
        cardMeta: { ...typography.caption2, color: colors.textTertiary, marginTop: 2 },
        urgentBadge: {
            backgroundColor: '#FF3B3015', paddingHorizontal: spacing.sm, paddingVertical: 2,
            borderRadius: radius.sm, borderWidth: 1, borderColor: '#FF3B3030',
        },
        urgentText: { ...typography.caption2, color: '#FF3B30', fontWeight: '800', letterSpacing: 0.5, fontSize: 9 },
        cardBody: {
            ...typography.subhead, color: colors.textSecondary, lineHeight: 22,
            padding: spacing.lg, paddingTop: spacing.sm,
        },
    });

export default React.memo(AdvisoriesPanel);
