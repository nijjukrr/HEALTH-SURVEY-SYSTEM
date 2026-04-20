import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';

interface Lab {
    id: string;
    name: string;
    type: 'water' | 'pathology' | 'both';
    address: string;
    phone: string;
    distance: string;
    accredited: boolean;
    services: string[];
    coordinates: { lat: number; lng: number };
    email?: string;
    timings?: string;
    isOpen?: boolean;
}

interface TestingLabsProps {
    labs?: Lab[];
}

const defaultLabs: Lab[] = [
    { id: '1', name: 'PSG Hospitals Laboratory', type: 'both', address: 'Peelamedu, Coimbatore - 641004', phone: '0422-2570170', email: 'psghospitals@yahoo.co.in', timings: '24 Hours', isOpen: true, distance: '2.5 km', accredited: true, services: ['Pathology', 'Microbiology', 'Water testing'], coordinates: { lat: 11.018611, lng: 77.006944 } },
    { id: '2', name: 'KMCH Central Laboratory', type: 'both', address: 'Avinashi Road, Coimbatore - 641014', phone: '0422-4323800', email: 'info@kmchhospitals.com', timings: '24 Hours', isOpen: true, distance: '4.2 km', accredited: true, services: ['Full panel testing', 'Biochemistry', 'Clinical Pathology'], coordinates: { lat: 11.042607, lng: 77.040607 } },
    { id: '3', name: 'Ganga Hospital Lab', type: 'pathology', address: 'Mettupalayam Road, Coimbatore - 641043', phone: '0422-2485000', email: 'info@gangahospital.com', timings: '08:00 AM - 08:00 PM', isOpen: true, distance: '3.1 km', accredited: true, services: ['Blood test', 'Microbiology'], coordinates: { lat: 11.026586, lng: 76.951911 } },
    { id: '4', name: 'Ramakrishna Hospital Lab', type: 'both', address: 'Siddhapudur, Coimbatore - 641044', phone: '0422-4500000', email: 'info@sriramakrishnahospital.com', timings: '24 Hours', isOpen: true, distance: '1.8 km', accredited: true, services: ['Pathology', 'Chemical analysis', 'Stool culture'], coordinates: { lat: 11.022800, lng: 76.977800 } },
    { id: '5', name: 'Coimbatore Medical College Hospital', type: 'pathology', address: 'Trichy Road, Coimbatore - 641018', phone: '0422-2301393', email: 'dean@cmccbe.ac.in', timings: '24 Hours', isOpen: true, distance: '5.0 km', accredited: true, services: ['Bacteriological', 'Basic stool test'], coordinates: { lat: 10.996410, lng: 76.970240 } },
    { id: '6', name: 'Micro Labs & Diagnostics', type: 'water', address: 'R.S. Puram, Coimbatore - 641002', phone: '0422-2545678', email: 'microlabs@gmail.com', timings: '07:00 AM - 09:00 PM', isOpen: false, distance: '6.2 km', accredited: false, services: ['pH testing', 'Turbidity', 'Coliform count'], coordinates: { lat: 11.009900, lng: 76.948200 } },
    { id: '7', name: 'KG Hospital Diagnostic Centre', type: 'both', address: 'Arts College Road, Coimbatore - 641018', phone: '0422-2212121', email: 'kghospital@vsnl.com', timings: '24 Hours', isOpen: true, distance: '4.8 km', accredited: true, services: ['Clinical Pathology', 'Haematology', 'Microbiology'], coordinates: { lat: 10.998495, lng: 76.970176 } },
    { id: '8', name: 'Gem Hospital Lab', type: 'pathology', address: 'Ramanathapuram, Coimbatore - 641045', phone: '0422-2325100', email: 'info@geminstitute.in', timings: '09:00 AM - 06:00 PM', isOpen: false, distance: '3.5 km', accredited: true, services: ['Gastroenterology tests', 'Liver panel'], coordinates: { lat: 10.993355, lng: 76.993630 } },
    { id: '9', name: 'Aravind Eye Hospital Lab', type: 'pathology', address: 'Avinashi Road, Coimbatore - 641014', phone: '0422-4360400', email: 'cbe.info@aravind.org', timings: '07:30 AM - 06:00 PM', isOpen: false, distance: '4.5 km', accredited: true, services: ['Ocular microbiology', 'Blood routine'], coordinates: { lat: 11.036067, lng: 77.037894 } },
    { id: '10', name: 'Thyrocare Testing Lab', type: 'pathology', address: 'Vadavalli, Coimbatore - 641041', phone: '9003612345', email: 'cbe.thyrocare@gmail.com', timings: '06:00 AM - 08:00 PM', isOpen: true, distance: '8.5 km', accredited: true, services: ['Aarogyam packages', 'Thyroid Profile'], coordinates: { lat: 11.026759, lng: 76.903264 } },
    { id: '11', name: 'Dr. Muthus Hospital Lab', type: 'both', address: 'Saravanampatti, Coimbatore - 641035', phone: '0422-2666777', timings: '24 Hours', isOpen: true, distance: '10.2 km', accredited: true, services: ['Blood culture', 'Urinalysis', 'Drinking water test'], coordinates: { lat: 11.080516, lng: 76.994269 } },
    { id: '12', name: 'Sri Abirami Hospital', type: 'pathology', address: 'Sundarapuram, Coimbatore - 641024', phone: '0422-2672000', email: 'info@sriabiramihospital.com', timings: '24 Hours', isOpen: true, distance: '7.8 km', accredited: false, services: ['General Pathology', 'Biochemistry'], coordinates: { lat: 10.941624, lng: 76.974534 } }
];

const typeConfig = {
    water: { icon: 'water', label: 'Water Testing', color: '#5AC8FA' },
    pathology: { icon: 'flask', label: 'Pathology', color: '#AF52DE' },
    both: { icon: 'medkit', label: 'Full Service', color: '#007AFF' },
};

const TestingLabs: React.FC<TestingLabsProps> = ({ labs = defaultLabs }) => {
    const { colors } = useTheme();
    const styles = useMemo(() => createStyles(colors), [colors]);
    const [filter, setFilter] = useState<'all' | 'water' | 'pathology' | 'both'>('all');
    const [userLoc, setUserLoc] = useState<Location.LocationObject | null>(null);
    const [isLocating, setIsLocating] = useState(false);

    const filteredLabs = filter === 'all' ? labs : labs.filter(l => l.type === filter);
    const sortedLabs = [...filteredLabs].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    const handleCall = (phone: string) => {
        Linking.openURL(`tel:${phone}`);
    };

    const handleGetLocation = async () => {
        setIsLocating(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please allow location access to route from your current position.');
                setIsLocating(false);
                return;
            }
            const location = await Location.getCurrentPositionAsync({});
            setUserLoc(location);
        } catch (error) {
            Alert.alert('Location Error', 'Could not fetch location.');
        } finally {
            setIsLocating(false);
        }
    };

    const handleDirections = (name: string, address: string) => {
        const query = encodeURIComponent(`${name}, ${address}`);
        if (userLoc) {
            const { latitude, longitude } = userLoc.coords;
            Linking.openURL(`https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${query}`);
        } else {
            Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
        }
    };

    return (
        <View style={styles.container}>
            {/* Filter chips */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                <TouchableOpacity
                    style={[styles.filterChip, userLoc && { backgroundColor: `${colors.success}15`, borderColor: colors.success }]}
                    onPress={handleGetLocation}
                    activeOpacity={0.7}
                    disabled={isLocating}
                >
                    {isLocating ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginRight: 6 }} />
                    ) : (
                        <Ionicons name="navigate" size={14} color={userLoc ? colors.success : colors.textSecondary} style={{ marginRight: 6 }} />
                    )}
                    <Text style={[styles.filterLabel, userLoc && { color: colors.success, fontWeight: '600' }]}>
                        {userLoc ? 'Location Found' : 'Find My Location'}
                    </Text>
                </TouchableOpacity>
                {[
                    { key: 'all', label: 'All Labs', icon: 'business' },
                    { key: 'water', label: 'Water Testing', icon: 'water' },
                    { key: 'pathology', label: 'Pathology', icon: 'flask' },
                    { key: 'both', label: 'Full Service', icon: 'medkit' },
                ].map(f => (
                    <TouchableOpacity
                        key={f.key}
                        style={[styles.filterChip, filter === f.key && styles.filterChipActive]}
                        onPress={() => setFilter(f.key as typeof filter)}
                        activeOpacity={0.7}
                    >
                        <Ionicons name={f.icon as any} size={14} color={filter === f.key ? '#FFFFFF' : colors.textSecondary} style={{ marginRight: 6 }} />
                        <Text style={[styles.filterLabel, filter === f.key && styles.filterLabelActive]}>
                            {f.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Lab List */}
            {sortedLabs.map((lab) => {
                const cfg = typeConfig[lab.type];
                return (
                    <View key={lab.id} style={styles.labCard}>
                        <View style={styles.labHeader}>
                            <View style={[styles.labTypeIcon, { backgroundColor: `${cfg.color}15` }]}>
                                <Ionicons name={cfg.icon as any} size={20} color={cfg.color} />
                            </View>
                            <View style={styles.labInfo}>
                                <View style={styles.labNameRow}>
                                    <Text style={styles.labName}>{lab.name}</Text>
                                    {lab.accredited && (
                                        <View style={styles.accreditedBadge}>
                                            <Text style={styles.accreditedText}>✓ Approved</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={styles.labAddress}>{lab.address}</Text>

                                <View style={styles.contactRow}>
                                    <View style={styles.contactItemWrapper}>
                                        <Ionicons name="time-outline" size={12} color={colors.textTertiary} />
                                        <Text style={styles.contactItemInfo}>{lab.timings || 'Contact to verify'}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: lab.isOpen ? `${colors.success}15` : `${colors.error}15` }]}>
                                        <Text style={[styles.statusText, { color: lab.isOpen ? colors.success : colors.error }]}>
                                            {lab.isOpen ? 'Open Now' : 'Closed'}
                                        </Text>
                                    </View>
                                </View>

                                {lab.email && (
                                    <View style={styles.contactItemWrapper}>
                                        <Ionicons name="mail" size={12} color={colors.textTertiary} />
                                        <Text style={styles.contactItemInfo}>{lab.email}</Text>
                                    </View>
                                )}

                                <Text style={styles.labDistance}>
                                    <Ionicons name="location" size={12} color={colors.textTertiary} /> {lab.distance} from you
                                </Text>
                            </View>
                        </View>

                        {/* Services */}
                        <View style={styles.servicesRow}>
                            {lab.services.map((service) => (
                                <View key={service} style={styles.serviceChip}>
                                    <Text style={styles.serviceText}>{service}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsRow}>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => handleCall(lab.phone)}>
                                <Text style={styles.actionText}>
                                    <Ionicons name="call" size={12} color={colors.primary} /> Call
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton} activeOpacity={0.7} onPress={() => handleDirections(lab.name, lab.address)}>
                                <Text style={styles.actionText}>
                                    <Ionicons name="map" size={12} color={colors.primary} /> Directions
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            })}

            {sortedLabs.length === 0 && (
                <View style={styles.emptyState}>
                    <Ionicons name="flask" size={48} color={colors.textSecondary} style={{ marginBottom: 16 }} />
                    <Text style={styles.emptyText}>No labs found for this filter</Text>
                </View>
            )}
        </View>
    );
};

const createStyles = (colors: Theme) =>
    StyleSheet.create({
        container: {},
        filterRow: { marginBottom: spacing.lg },
        filterChip: {
            flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg,
            paddingVertical: spacing.sm, borderRadius: radius.lg, backgroundColor: colors.surface,
            borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm,
        },
        filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
        filterIcon: { fontSize: 14, marginRight: spacing.xs },
        filterLabel: { ...typography.caption1, color: colors.text, fontWeight: '500' },
        filterLabelActive: { color: '#FFFFFF' },
        labCard: {
            backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.lg,
            borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md,
        },
        labHeader: { flexDirection: 'row', marginBottom: spacing.md },
        labTypeIcon: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
        labTypeEmoji: { fontSize: 20 },
        labInfo: { flex: 1, marginLeft: spacing.md },
        labNameRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
        labName: { ...typography.callout, color: colors.text, fontWeight: '600' },
        accreditedBadge: {
            backgroundColor: '#34C75915', paddingHorizontal: spacing.sm, paddingVertical: 1,
            borderRadius: radius.sm,
        },
        accreditedText: { ...typography.caption2, color: '#34C759', fontWeight: '700' },
        labAddress: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },
        labDistance: { ...typography.caption2, color: colors.textTertiary, marginTop: 4, fontWeight: '500' },
        contactRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, marginBottom: 2 },
        contactItemWrapper: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
        contactItemInfo: { ...typography.caption2, color: colors.textTertiary, marginLeft: 4 },
        statusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
        statusText: { fontSize: 10, fontWeight: 'bold' },
        servicesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.md, marginTop: spacing.sm },
        serviceChip: {
            backgroundColor: colors.surfaceVariant, paddingHorizontal: spacing.sm,
            paddingVertical: 2, borderRadius: radius.sm,
        },
        serviceText: { ...typography.caption2, color: colors.textSecondary },
        actionsRow: { flexDirection: 'row', gap: spacing.sm },
        actionButton: {
            flex: 1, paddingVertical: spacing.sm, alignItems: 'center',
            borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
        },
        actionText: { ...typography.caption1, color: colors.primary, fontWeight: '600' },
        emptyState: { alignItems: 'center', paddingVertical: spacing.xxl },
        emptyIcon: { fontSize: 32, marginBottom: spacing.sm },
        emptyText: { ...typography.subhead, color: colors.textSecondary },
    });

export default React.memo(TestingLabs);
