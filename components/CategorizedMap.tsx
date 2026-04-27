import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import MapView, { Marker, Circle } from './Map';

interface CategorizedMapProps {
  userLocation?: string;
  compact?: boolean;
  fullscreen?: boolean;
  onExpand?: () => void;
  onBack?: () => void;
}

type Category = 'all' | 'Cholera' | 'Viral Fever' | 'Dengue' | 'water' | 'hospital';

const CategorizedMap: React.FC<CategorizedMapProps> = ({ userLocation = 'Locating...', compact = false, fullscreen = false, onExpand, onBack }) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [selectedMarker, setSelectedMarker] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All', icon: 'layers' },
    { id: 'Cholera', label: 'Cholera', icon: 'bug' },
    { id: 'Viral Fever', label: 'Viral Fever', icon: 'thermometer' },
    { id: 'Dengue', label: 'Dengue', icon: 'warning' },
    { id: 'water', label: 'Water Sources', icon: 'water' },
    { id: 'hospital', label: 'Health Facilities', icon: 'medkit' },
  ];

  // Real coordinates centered around Coimbatore
  const markers = [
    { id: 1, type: 'outbreak', disease: 'Cholera', latitude: 10.9934, longitude: 77.0188, cases: 58, title: 'Cholera Alert (Singanallur)', desc: 'Critical: 58 active cases reported recently.' },
    { id: 6, type: 'outbreak', disease: 'Cholera', latitude: 10.9542, longitude: 76.9611, cases: 12, title: 'Cholera Tracking (Kuruchi)', desc: '12 active cases under observation.' },
    { id: 2, type: 'water', latitude: 10.9856, longitude: 76.9583, title: 'Ukkadam Tank', desc: 'Contamination detected (High pH / Foul Smell)' },
    { id: 3, type: 'hospital', latitude: 11.0069, longitude: 76.9454, title: 'City General (RS Puram)', desc: 'Beds available: 12. Safe Zone.' },
    { id: 4, type: 'water', latitude: 11.0264, longitude: 77.0041, title: 'Peelamedu Pump #12', desc: 'Safe to drink. Recent test passed.' },
    { id: 5, type: 'outbreak', disease: 'Viral Fever', latitude: 10.9634, longitude: 77.0016, cases: 18, title: 'Viral Fever (Vellalore)', desc: 'Cluster detected near the dumping ground.' },
    { id: 7, type: 'outbreak', disease: 'Dengue', latitude: 11.0181, longitude: 76.9669, cases: 35, title: 'Dengue Zone (Gandhipuram)', desc: 'High risk: Mosquito breeding grounds identified.' },
  ];

  const filteredMarkers = activeCategory === 'all'
    ? markers
    : markers.filter(m => {
      if (m.type === 'outbreak') {
        return m.disease === activeCategory;
      }
      return m.type === activeCategory;
    });

  const getMarkerColor = (type: string) => {
    switch (type) {
      case 'outbreak': return colors.error;
      case 'water': return colors.primary;
      case 'hospital': return colors.success;
      default: return colors.textSecondary;
    }
  };

  const getMarkerIcon = (type: string) => {
    switch (type) {
      case 'outbreak': return 'warning';
      case 'water': return 'water';
      case 'hospital': return 'medkit';
      default: return 'location';
    }
  };

  const mapRegion = {
    latitude: 11.0168,
    longitude: 76.9800,
    latitudeDelta: 0.15,
    longitudeDelta: 0.15,
  };

  return (
    <View style={[styles.container, compact && styles.containerCompact, fullscreen && styles.containerFullscreen]}>
      {/* Floating Header & Filters (Fullscreen Mode) */}
      {fullscreen && (
        <View style={styles.floatingUIContainer} pointerEvents="box-none">
          {/* Top Bar with Back Button and Search-like Title */}
          <View style={styles.floatingTopBar}>
            {onBack && (
              <TouchableOpacity style={styles.floatingBackButton} onPress={onBack} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
            )}
            <View style={styles.floatingTitleBox}>
              <Ionicons name="search" size={20} color={colors.textSecondary} style={{ marginRight: spacing.sm }} />
              <Text style={styles.floatingTitleText}>Contamination Hotspots</Text>
            </View>
          </View>

          {/* Floating Filter Chips Below Search Bar */}
          <View style={{ marginTop: spacing.sm }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.floatingFilterChip, activeCategory === cat.id && styles.filterChipActive, { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4, elevation: 4 }]}
                  onPress={() => setActiveCategory(cat.id as Category)}
                  activeOpacity={0.8}
                >
                  <Ionicons name={cat.icon as any} size={16} color={activeCategory === cat.id ? '#fff' : colors.textSecondary} style={{ marginRight: 6 }} />
                  <Text style={[styles.filterText, activeCategory === cat.id && styles.filterTextActive]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      )}

      {/* Regular Map Header / Filter Bar */}
      {!compact && !fullscreen && (
        <View style={styles.filterBar}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {categories.map(cat => (
              <TouchableOpacity
                key={cat.id}
                style={[styles.filterChip, activeCategory === cat.id && styles.filterChipActive]}
                onPress={() => setActiveCategory(cat.id as Category)}
              >
                <Ionicons name={cat.icon as any} size={16} color={activeCategory === cat.id ? '#fff' : colors.textSecondary} style={{ marginRight: 6 }} />
                <Text style={[styles.filterText, activeCategory === cat.id && styles.filterTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Map View Area */}
      <View style={styles.mapArea}>
        <MapView
          style={styles.map}
          initialRegion={mapRegion}
          scrollEnabled={!compact}
          pitchEnabled={!compact}
        >
          {filteredMarkers.map(marker => {
            const color = getMarkerColor(marker.type);
            const typeStr = marker.type;

            return (
              <React.Fragment key={marker.id}>
                {typeStr === 'outbreak' && marker.cases && (
                  <Circle
                    center={{ latitude: marker.latitude, longitude: marker.longitude }}
                    radius={200 + (marker.cases * 40)}
                    fillColor={color + '40'}
                    strokeColor={color}
                    strokeWidth={2}
                  />
                )}
                <Marker
                  coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                  title={marker.title}
                  description={marker.desc}
                  onPress={() => !compact && setSelectedMarker(marker)}
                >
                  <View style={[styles.pin, { backgroundColor: color }]}>
                    <Ionicons name={getMarkerIcon(marker.type) as any} size={12} color="#fff" />
                  </View>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapView>

        {/* Location Label Overlay */}
        <View style={styles.locationTag}>
          <Ionicons name="navigate" size={12} color="#fff" style={{ marginRight: 4 }} />
          <Text style={styles.locationText}>{userLocation}</Text>
        </View>

        {/* Expand Button (Compact Mode) */}
        {compact && onExpand && (
          <TouchableOpacity style={styles.expandButton} onPress={onExpand}>
            <Ionicons name="expand" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Detail Card (Full Mode) */}
      {!compact && selectedMarker && (
        <View style={styles.detailCard}>
          <View style={[styles.detailIcon, { backgroundColor: getMarkerColor(selectedMarker.type) + '20' }]}>
            <Ionicons name={getMarkerIcon(selectedMarker.type) as any} size={24} color={getMarkerColor(selectedMarker.type)} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.detailTitle}>{selectedMarker.title}</Text>
            <Text style={styles.detailDesc}>{selectedMarker.desc}</Text>
          </View>
          <TouchableOpacity onPress={() => setSelectedMarker(null)}>
            <Ionicons name="close" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const createStyles = (colors: Theme) => StyleSheet.create({
  container: { backgroundColor: colors.surface, borderRadius: radius.xl, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  containerCompact: { height: 200 },
  containerFullscreen: { flex: 1, borderRadius: 0, borderWidth: 0, overflow: 'visible' },

  /* Floating UI Styles (Fullscreen) */
  floatingUIContainer: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100, paddingTop: spacing.xl + spacing.md },
  floatingTopBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md },
  floatingBackButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5, marginRight: spacing.sm },
  floatingTitleBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5, paddingLeft: 16 },
  floatingTitleText: { ...typography.body, color: colors.text, fontWeight: '500' },
  floatingFilterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.borderLight },

  filterBar: { paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.borderLight },
  filterScroll: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  filterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: 6, borderRadius: radius.full, backgroundColor: colors.surfaceVariant, borderWidth: 1, borderColor: colors.border },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterText: { ...typography.caption1, color: colors.textSecondary },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  mapArea: { flex: 1, minHeight: 300, backgroundColor: colors.surfaceVariant + '40', position: 'relative' },
  map: { width: '100%', height: '100%' },
  pin: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#fff', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 4, elevation: 4 },
  locationTag: { position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: radius.md },
  locationText: { ...typography.caption2, color: '#fff', fontWeight: '600' },
  expandButton: { position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  detailCard: { flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
  detailIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  detailTitle: { ...typography.subhead, color: colors.text, fontWeight: '700' },
  detailDesc: { ...typography.caption2, color: colors.textSecondary },
});

export default CategorizedMap;