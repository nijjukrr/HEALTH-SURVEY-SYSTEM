import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useTheme, Theme, typography, spacing, radius } from '../lib/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import RegionFilter from '../components/RegionFilter';
import TrendChart from '../components/TrendChart';
import RiskHeatmap from '../components/RiskHeatmap';
import AlertBanner from '../components/AlertBanner';
import AlertHistoryPanel from '../components/AlertHistoryPanel';
import ExplainabilityPanel from '../components/ExplainabilityPanel';
import RiskAnalysisPanel from '../components/RiskAnalysisPanel';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import NationalStats from './NationalStats';
import CommunityReport from './CommunityReport';
import Telemedicine from './Telemedicine';
import HygieneEducation from './HygieneEducation';
// Aarogya Setu-inspired components
import SelfAssessment from '../components/SelfAssessment';
import HealthStatusBadge from '../components/HealthStatusBadge';
import ProximityStats from '../components/ProximityStats';
import CategorizedMap from '../components/CategorizedMap';
import EmergencyHelpline from '../components/EmergencyHelpline';
import TestingLabs from '../components/TestingLabs';
import AdvisoriesPanel from '../components/AdvisoriesPanel';
import HealthCertificate from '../components/HealthCertificate';
import FieldWorkerLogistics from '../components/FieldWorkerLogistics';
import {
  regions,
  outbreaks,
  waterQualityAlerts,
  preventionCampaigns,
  diseaseTrendData,
  waterQualityTrendData,
  alerts,
  predictionInsights,
  filterByRegion,
} from '../lib/mockData';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface IndexPageProps {
  userEmail?: string;
  userName?: string;
  onLogout?: () => void;
  isGuest?: boolean;
  userId?: string;
}

const IndexPageContent: React.FC<IndexPageProps> = ({
  userEmail = '',
  userName = 'Health Worker',
  onLogout,
  isGuest = false,
  userId }) => {
  const { theme, toggleTheme, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(colors, insets), [colors, insets]);

  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<string>('Dashboard');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [userRiskLevel, setUserRiskLevel] = useState<'low' | 'moderate' | 'high' | 'critical'>('low');
  const [geoAlertVisible, setGeoAlertVisible] = useState(true);
  const [userLocation, setUserLocation] = useState<string>('Locating...');

  // Persistent State for Hygiene Education
  const [hygieneScore, setHygieneScore] = useState(350);
  const [hygieneModules, setHygieneModules] = useState([
    { id: 1, title: 'Hand Washing 101', duration: '5 min', points: 50, completed: true },
    { id: 2, title: 'Safe Water Storage', duration: '8 min', points: 80, completed: false },
    { id: 3, title: 'Sanitation Basics', duration: '10 min', points: 100, completed: false },
  ]);

  useEffect(() => {
    setTimeout(() => {
      setUserLocation('Gandhipuram, Coimbatore');
    }, 2000);
  }, []);

  const handleNavigation = useCallback((screen: string) => {
    setCurrentScreen(screen);
    setSidebarVisible(false);
  }, []);

  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId);
  }, []);

  const handleAssessmentComplete = useCallback((riskLevel: 'low' | 'moderate' | 'high' | 'critical') => {
    setUserRiskLevel(riskLevel);
  }, []);

  const handleHygieneUpdate = useCallback((id: number, points: number) => {
    setHygieneScore(prev => prev + points);
    setHygieneModules(prev => prev.map(m => m.id === id ? { ...m, completed: true } : m));
  }, []);

  const filteredOutbreaks = useMemo(() => filterByRegion(outbreaks, selectedRegion), [selectedRegion]);
  const filteredWaterAlerts = useMemo(() => filterByRegion(waterQualityAlerts, selectedRegion), [selectedRegion]);
  const filteredAlerts = useMemo(() => filterByRegion(alerts, selectedRegion), [selectedRegion]);

  const renderScreenContent = () => {
    switch (currentScreen) {
      case 'SelfAssessment':
        return <SelfAssessment onComplete={handleAssessmentComplete} onClose={() => handleNavigation('Dashboard')} />;
      case 'NationalStats':
        return <NationalStats onNavigate={handleNavigation} />;
      case 'HotspotMap':
        return (
          <View style={{ flex: 1, backgroundColor: colors.background }}>
            <CategorizedMap userLocation={userLocation} fullscreen={true} onBack={() => handleNavigation('Dashboard')} />
          </View>
        );
      case 'TestingLabs':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6} style={{ marginBottom: spacing.md }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Approved Testing Labs</Text>
              <Text style={styles.screenSubtitle}>Water testing & pathology facilities near you</Text>
            </View>
            <View style={styles.section}>
              <TestingLabs />
            </View>
          </ScrollView>
        );
      case 'Helpline':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6} style={{ marginBottom: spacing.md }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Emergency Helpline</Text>
            </View>
            <View style={styles.section}>
              <EmergencyHelpline onClose={() => handleNavigation('Dashboard')} />
            </View>
          </ScrollView>
        );
      case 'HealthCertificate':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6} style={{ marginBottom: spacing.md }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Health Certificate</Text>
            </View>
            <View style={styles.section}>
              <HealthCertificate userName={userName} riskLevel={userRiskLevel} location="New Delhi, India" />
            </View>
          </ScrollView>
        );
      case 'FieldWorkerLogistics':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6} style={{ marginBottom: spacing.md }}>
                <Ionicons name="arrow-back" size={24} color={colors.text} />
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Field Worker Logistics</Text>
              <Text style={styles.screenSubtitle}>Inventory & Active Dispatches</Text>
            </View>
            <View style={styles.section}>
              <FieldWorkerLogistics />
            </View>
          </ScrollView>
        );
      case 'CommunityReport':
        return <CommunityReport onBack={() => handleNavigation('Dashboard')} />;
      case 'Telemedicine':
        return <Telemedicine onBack={() => handleNavigation('Dashboard')} />;
      case 'HygieneEducation':
        return <HygieneEducation onBack={() => handleNavigation('Dashboard')} modules={hygieneModules} score={hygieneScore} onUpdateModule={handleHygieneUpdate} />;
      case 'Profile':
        return <ProfilePage onBack={() => handleNavigation('Dashboard')} onNavigate={handleNavigation} userName={userName} userEmail={userEmail} onLogout={onLogout} />;
      case 'Settings':
        return <SettingsPage onNavigate={handleNavigation} userId={userId} userEmail={userEmail} userName={userName} />;
      case 'Outbreaks':
        return (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { marginTop: spacing.md }]}>
              <Text style={styles.sectionTitle}>Active Outbreaks</Text>
              {filteredOutbreaks.length > 0 ? (
                filteredOutbreaks.map((item) => (
                  <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} caseCount={item.caseCount} onPress={() => { }} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>✓</Text>
                  <Text style={styles.emptyStateText}>No active outbreaks in this region</Text>
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prevention Campaigns</Text>
              {preventionCampaigns.map((item) => (
                <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} onPress={() => { }} />
              ))}
            </View>
          </ScrollView>
        );
      case 'WaterQuality':
        return (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { marginTop: spacing.md }]}>
              <Text style={styles.sectionTitle}>Water Quality Alerts</Text>
              {filteredWaterAlerts.length > 0 ? (
                filteredWaterAlerts.map((item) => (
                  <Card key={item.id} title={item.title} date={item.date} description={item.description} location={item.location} type={item.type} severity={item.severity} onPress={() => { }} />
                ))
              ) : (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateIcon}>💧</Text>
                  <Text style={styles.emptyStateText}>All water sources are safe in this region</Text>
                </View>
              )}
            </View>
            <View style={styles.section}>
              <CategorizedMap userLocation={userLocation} compact onExpand={() => handleNavigation('HotspotMap')} />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Regional Risk Map</Text>
              <RiskHeatmap selectedRegion={selectedRegion} />
            </View>
            <View style={styles.section}>
              <RiskAnalysisPanel locationName={userLocation === 'Locating...' ? 'your area' : userLocation} />
            </View>
          </ScrollView>
        );
      case 'Warnings':
        return (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={[styles.section, { marginTop: spacing.md }]}>
              <AdvisoriesPanel />
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Predictions</Text>
              <Text style={styles.sectionSubtitle}>Transparent outbreak probability analysis</Text>
              {predictionInsights.map((insight) => (
                <View key={insight.id} style={styles.cardGap}>
                  <ExplainabilityPanel insight={insight} />
                </View>
              ))}
            </View>
            <View style={styles.section}>
              <AlertHistoryPanel alerts={alerts} maxItems={5} />
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>HealthDrop Surveillance System</Text>
              <Text style={styles.footerSubtext}>Powered by AI · Real-time Monitoring</Text>
            </View>
          </ScrollView>
        );

      case 'Dashboard':
      default:
        return (
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {geoAlertVisible && (
              <View style={styles.geoAlert}>
                <Ionicons name="location" size={24} color="#fff" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.geoAlertTitle}>High Risk Zone Detected</Text>
                  <Text style={styles.geoAlertText}>You are near a reported contamination site.</Text>
                </View>
                <TouchableOpacity onPress={() => setGeoAlertVisible(false)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            <HeroSection userName={userName} selectedRegion={selectedRegion} />
            <RegionFilter regions={regions} selectedRegion={selectedRegion} onSelect={handleRegionSelect} />

            {/* Surveillance Categories have been moved to the floating bottom tabs */}

            {/* Additional Info grouped together */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Services</Text>
              <View style={styles.quickActionsGrid}>
                {[
                  { icon: 'megaphone', label: 'Report', screen: 'CommunityReport' },
                  { icon: 'flask', label: 'Labs', screen: 'TestingLabs' },
                  { icon: 'warning', label: 'Helpline', screen: 'Helpline' },
                  { icon: 'cube', label: 'Logistics', screen: 'FieldWorkerLogistics' },
                  { icon: 'bulb', label: 'Learn', screen: 'HygieneEducation' },
                  { icon: 'settings', label: 'Settings', screen: 'Settings' },
                ].map((action) => (
                  <TouchableOpacity
                    key={action.screen}
                    style={styles.quickActionItem}
                    onPress={() => handleNavigation(action.screen)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={action.icon as any} size={28} color={colors.primary} style={{ marginBottom: 8 }} />
                    <Text style={styles.quickActionLabel}>{action.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <ProximityStats />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trends Overview</Text>
              <View style={styles.cardGap}>
                <TrendChart data={diseaseTrendData} title="Disease Cases" subtitle="Monthly reported cases" color={colors.error} unit=" cases" />
              </View>
              <View style={styles.cardGap}>
                <TrendChart data={waterQualityTrendData} title="Water Quality Index" subtitle="Average safety score" color={colors.primary} unit="%" />
              </View>
            </View>
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} backgroundColor={colors.surface} />
      <Navbar onMenuPress={() => setSidebarVisible(true)} userName={userName} toggleTheme={toggleTheme} onNavigate={handleNavigation} />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={handleNavigation} isGuest={isGuest} currentScreen={currentScreen} />

      <View style={styles.content}>
        {renderScreenContent()}
      </View>

      {/* Floating Bottom Nav */}
      <View style={styles.floatingNavWrapper}>
        <View style={styles.floatingNavContainer}>
          {[
            { id: 'Outbreaks', icon: 'bug', color: colors.error },
            { id: 'WaterQuality', icon: 'water', color: colors.primary },
            { id: 'Dashboard', icon: 'home', color: colors.text },
            { id: 'NationalStats', icon: 'stats-chart', color: colors.success },
            { id: 'HotspotMap', icon: 'map', color: colors.secondary },
            { id: 'SelfAssessment', icon: 'clipboard', color: colors.primary },
          ].map((item) => {
            const isActive = currentScreen === item.id || (item.id === 'Dashboard' && !['Outbreaks', 'WaterQuality', 'HotspotMap', 'SelfAssessment', 'NationalStats'].includes(currentScreen));

            const activeIconColor = item.id === 'Dashboard' && theme === 'dark' ? colors.background : '#fff';

            return (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.navPill,
                  isActive && { backgroundColor: item.color }
                ]}
                onPress={() => handleNavigation(item.id)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={item.icon as any}
                  size={24}
                  color={isActive ? activeIconColor : colors.textSecondary}
                />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: Theme, insets: any) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.sm },
    sectionSubtitle: { ...typography.caption1, color: colors.textSecondary, marginBottom: spacing.lg },
    cardGap: { marginBottom: spacing.md },
    screenHeader: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingTop: Math.max(insets?.top || 0, spacing.xl) },
    backText: { ...typography.callout, color: colors.primary, fontWeight: '500', marginBottom: spacing.sm },
    screenTitle: { ...typography.largeTitle, color: colors.text },
    screenSubtitle: { ...typography.caption1, color: colors.textSecondary, marginTop: 2 },

    // Category Grid
    categoryGrid: {
      flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, justifyContent: 'space-between'
    },
    categoryCard: {
      width: '48%', backgroundColor: colors.surface, borderRadius: radius.xl,
      padding: spacing.md, borderWidth: 1, borderColor: colors.border,
      marginBottom: spacing.xs
    },
    categoryIconBg: {
      width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center',
      marginBottom: spacing.md
    },
    categoryTitle: { ...typography.headline, marginBottom: 2 },
    categorySubtitle: { ...typography.caption2, color: colors.textSecondary },

    quickActionsGrid: {
      flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm,
    },
    quickActionItem: {
      width: '31%', backgroundColor: colors.surface, borderRadius: radius.xl,
      padding: spacing.lg, alignItems: 'center',
      borderWidth: 1, borderColor: colors.border,
    },
    quickActionIcon: { fontSize: 24, marginBottom: spacing.xs },
    quickActionLabel: { ...typography.caption1, color: colors.textSecondary, fontWeight: '500', textAlign: 'center' },
    geoAlert: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: colors.error,
      margin: spacing.lg, marginBottom: 0, padding: spacing.md, borderRadius: radius.lg
    },
    geoAlertTitle: { ...typography.headline, color: '#fff', fontSize: 14 },
    geoAlertText: { ...typography.caption2, color: '#fff', opacity: 0.9 },
    emptyState: {
      backgroundColor: colors.surface, borderRadius: radius.xl, padding: spacing.xxl,
      alignItems: 'center', borderWidth: 1, borderColor: colors.border,
    },
    emptyStateIcon: { fontSize: 24, marginBottom: spacing.sm },
    emptyStateText: { ...typography.subhead, color: colors.textSecondary },
    footer: { alignItems: 'center', paddingVertical: spacing.xxxl, marginBottom: spacing.xl },
    footerText: { ...typography.footnote, color: colors.textTertiary, fontWeight: '600' },
    footerSubtext: { ...typography.caption2, color: colors.textTertiary, marginTop: 4 },

    // Floating Nav Styles
    floatingNavWrapper: {
      position: 'absolute',
      bottom: spacing.xl,
      left: 0,
      right: 0,
      alignItems: 'center',
    },
    floatingNavContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 40,
      padding: 6,
      gap: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 6,
      borderWidth: 1,
      borderColor: colors.border,
    },
    navPill: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    }
  });

export default IndexPageContent;
