import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface HelplineContact {
    id: string;
    name: string;
    number: string;
    category: 'emergency' | 'health' | 'water' | 'government';
    description: string;
    available: string;
}

interface EmergencyHelplineProps {
    contacts?: HelplineContact[];
    onClose?: () => void;
}

const defaultContacts: HelplineContact[] = [
    { id: '1', name: 'Emergency Ambulance', number: '108', category: 'emergency', description: 'National ambulance service', available: '24/7' },
    { id: '2', name: 'Health Helpline', number: '104', category: 'health', description: 'National health information helpline', available: '24/7' },
    { id: '3', name: 'Water Quality Complaints', number: '1916', category: 'water', description: 'Municipal water complaints', available: '8AM–8PM' },
    { id: '4', name: 'Disaster Management', number: '1078', category: 'emergency', description: 'National Disaster Response Force', available: '24/7' },
    { id: '5', name: 'District Health Office', number: '011-23063273', category: 'government', description: 'Report disease outbreaks', available: '9AM–5PM' },
    { id: '6', name: 'Jal Shakti Ministry', number: '011-23714487', category: 'water', description: 'Water supply & sanitation', available: '9AM–5PM' },
    { id: '7', name: 'ICMR Helpline', number: '011-26588980', category: 'health', description: 'Lab testing information', available: '9AM–6PM' },
    { id: '8', name: 'Poison Control', number: '1800-116-117', category: 'emergency', description: 'Poison information center', available: '24/7' },
];

const categoryConfig = {
    emergency: { icon: 'warning', color: '#FF3B30' },
    health: { icon: 'medkit', color: '#007AFF' },
    water: { icon: 'water', color: '#5AC8FA' },
    government: { icon: 'business', color: '#8E8E93' },
};

const EmergencyHelpline: React.FC<EmergencyHelplineProps> = ({ contacts = defaultContacts, onClose }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);

    const handleCall = (number: string) => {
        Linking.openURL(`tel:${number}`);
    };

    const grouped = useMemo(() => {
        const groups: Record<string, HelplineContact[]> = {};
        contacts.forEach(c => {
            if (!groups[c.category]) groups[c.category] = [];
            groups[c.category].push(c);
        });
        return groups;
    }, [contacts]);

    const categoryLabels: Record<string, string> = {
        emergency: 'Emergency Services',
        health: 'Health Services',
        water: 'Water & Sanitation',
        government: 'Government',
    };

    return (
        <View style={styles.container}>
            {/* SOS Banner */}
            <View style={styles.sosBanner}>
                <Ionicons name="warning" size={32} color="#FF3B30" style={{ marginRight: 16 }} />
                <View style={styles.sosContent}>
                    <Text style={styles.sosTitle}>In an emergency?</Text>
                    <Text style={styles.sosSubtitle}>Call 108 for immediate medical help</Text>
                </View>
                <TouchableOpacity
                    style={styles.sosButton}
                    onPress={() => handleCall('108')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.sosButtonText}>Call 108</Text>
                </TouchableOpacity>
            </View>

            {/* Categorized Contacts */}
            {Object.entries(grouped).map(([category, items]) => {
                const cfg = categoryConfig[category as keyof typeof categoryConfig];
                return (
                    <View key={category} style={styles.section}>
                        <Text style={styles.sectionTitle}>{categoryLabels[category] || category}</Text>
                        <View style={styles.sectionCard}>
                            {items.map((contact, idx) => (
                                <View key={contact.id} style={[styles.contactRow, idx === items.length - 1 && styles.lastRow]}>
                                    <View style={[styles.contactIcon, { backgroundColor: `${cfg.color}15` }]}>
                                        <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
                                    </View>
                                    <View style={styles.contactInfo}>
                                        <Text style={styles.contactName}>{contact.name}</Text>
                                        <Text style={styles.contactDesc}>{contact.description}</Text>
                                        <Text style={styles.contactAvail}>{contact.available}</Text>
                                    </View>
                                    <TouchableOpacity
                                        style={[styles.callButton, { borderColor: cfg.color }]}
                                        onPress={() => handleCall(contact.number)}
                                        activeOpacity={0.7}
                                    >
                                        <Text style={[styles.callButtonText, { color: cfg.color }]}>
                                            <Ionicons name="call" size={12} color={cfg.color} /> {contact.number}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </View>
                );
            })}
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: { paddingBottom: spacing.xl },
        sosBanner: {
            flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF3B3015',
            borderRadius: radius.xl, padding: spacing.lg, marginBottom: spacing.xl,
            borderWidth: 1, borderColor: '#FF3B3030',
        },
        sosIcon: { fontSize: 28, marginRight: spacing.md },
        sosContent: { flex: 1 },
        sosTitle: { ...typography.headline, color: '#FF3B30' },
        sosSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
        sosButton: {
            backgroundColor: '#FF3B30', paddingHorizontal: spacing.lg, paddingVertical: spacing.sm,
            borderRadius: radius.md,
        },
        sosButtonText: { ...typography.callout, color: '#FFFFFF', fontWeight: '700' },
        section: { marginBottom: spacing.xl },
        sectionTitle: {
            ...typography.footnote, color: colors.textSecondary, fontWeight: '600',
            textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm, paddingLeft: spacing.sm,
        },
        sectionCard: {
            backgroundColor: colors.surface, borderRadius: radius.xl,
            borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
        },
        contactRow: {
            flexDirection: 'row', alignItems: 'center', padding: spacing.lg,
            borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.borderLight,
        },
        lastRow: { borderBottomWidth: 0 },
        contactIcon: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
        contactIconText: { fontSize: 18 },
        contactInfo: { flex: 1, marginLeft: spacing.md },
        contactName: { ...typography.callout, color: colors.text, fontWeight: '600' },
        contactDesc: { ...typography.caption1, color: colors.textSecondary, marginTop: 1 },
        contactAvail: { ...typography.caption2, color: colors.textTertiary, marginTop: 2 },
        callButton: {
            paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
            borderRadius: radius.md, borderWidth: 1,
        },
        callButtonText: { ...typography.caption1, fontWeight: '600' },
    });

export default React.memo(EmergencyHelpline);
