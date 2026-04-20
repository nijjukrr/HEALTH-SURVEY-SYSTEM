import sys

with open('pages/IndexPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

new_index = """import React, { useState, useMemo, useCallback, useEffect } from 'react';
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
  userId = '',
}) => {
  const { theme, toggleTheme, colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
    switch(currentScreen) {
      case 'SelfAssessment':
        return <SelfAssessment onComplete={handleAssessmentComplete} onClose={() => handleNavigation('Dashboard')} />;
      case 'NationalStats':
        return <NationalStats onNavigate={handleNavigation} />;
      case 'HotspotMap':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Contamination Hotspots</Text>
            </View>
            <View style={styles.section}>
              <CategorizedMap userLocation={userLocation} />
            </View>
          </ScrollView>
        );
      case 'TestingLabs':
        return (
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.screenHeader}>
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
                <Text style={styles.backText}>‹ Back</Text>
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
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
                <Text style={styles.backText}>‹ Back</Text>
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
              <TouchableOpacity onPress={() => handleNavigation('Dashboard')} activeOpacity={0.6}>
                <Text style={styles.backText}>‹ Back</Text>
              </TouchableOpacity>
              <Text style={styles.screenTitle}>Health Certificate</Text>
            </View>
            <View style={styles.section}>
              <HealthCertificate userName={userName} riskLevel={userRiskLevel} location="New Delhi, India" />
            </View>
          </ScrollView>
        );
      case 'CommunityReport':
        return <CommunityReport onBack={() => handleNavigation('Dashboard')} />;
      case 'Telemedicine':
        return <Telemedicine onBack={() => handleNavigation('Dashboard')} />;
      case 'HygieneEducation':
        return <HygieneEducation onBack={() => handleNavigation('Dashboard')} modules={hygieneModules} score={hygieneScore} onUpdateModule={handleHygieneUpdate} />;
      case 'Settings':
        return <SettingsPage onNavigate={handleNavigation} userId={userId} userEmail={userEmail} />;
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
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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

            {/* Main Category Menu Grid */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Surveillance Categories</Text>
              <Text style={styles.sectionSubtitle}>Select an area to view detailed reports</Text>
              
              <View style={styles.categoryGrid}>
                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.error }]} onPress={() => handleNavigation('Outbreaks')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.error + '15' }]}>
                     <Ionicons name="bug" size={28} color={colors.error} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Outbreaks</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>Active disease reports & campaigns</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.primary }]} onPress={() => handleNavigation('WaterQuality')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.primary + '15' }]}>
                     <Ionicons name="water" size={28} color={colors.primary} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Water Quality</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>Safety alerts & contamination levels</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.warning }]} onPress={() => handleNavigation('Warnings')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.warning + '15' }]}>
                     <Ionicons name="notifications" size={28} color={colors.warning} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Alerts & AI</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>AI predictions & risk advisories</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.success }]} onPress={() => handleNavigation('NationalStats')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.success + '15' }]}>
                     <Ionicons name="stats-chart" size={28} color={colors.success} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Analytics</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>National statistics & trend charts</Text>
                 </TouchableOpacity>
                 
                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.secondary }]} onPress={() => handleNavigation('HotspotMap')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.secondary + '15' }]}>
                     <Ionicons name="map" size={28} color={colors.secondary} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Hotspot Map</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>Live view of contamination zones</Text>
                 </TouchableOpacity>

                 <TouchableOpacity style={[styles.categoryCard, { borderColor: colors.primary }]} onPress={() => handleNavigation('SelfAssessment')} activeOpacity={0.7}>
                   <View style={[styles.categoryIconBg, { backgroundColor: colors.primary + '15' }]}>
                     <Ionicons name="clipboard" size={28} color={colors.primary} />
                   </View>
                   <Text style={[styles.categoryTitle, { color: colors.text }]}>Assessment</Text>
                   <Text style={styles.categorySubtitle} numberOfLines={2}>Check your personal health risk</Text>
                 </TouchableOpacity>
              </View>
            </View>

            {/* Additional Info grouped together */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quick Services</Text>
              <View style={styles.quickActionsGrid}>
                {[
                  { icon: 'megaphone', label: 'Report', screen: 'CommunityReport' },
                  { icon: 'flask', label: 'Labs', screen: 'TestingLabs' },
                  { icon: 'warning', label: 'Helpline', screen: 'Helpline' },
                  { icon: 'document-text', label: 'Certificate', screen: 'HealthCertificate' },
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
          </ScrollView>
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <Navbar onMenuPress={() => setSidebarVisible(true)} userName={userName} toggleTheme={toggleTheme} />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={handleNavigation} isGuest={isGuest} currentScreen={currentScreen} />

      <View style={styles.content}>
        {renderScreenContent()}
      </View>
    </View>
  );
};

const createStyles = (colors: Theme) =>
  StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { flex: 1 },
    section: { paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
    sectionTitle: { ...typography.title3, color: colors.text, marginBottom: spacing.sm },
    sectionSubtitle: { ...typography.caption1, color: colors.textSecondary, marginBottom: spacing.lg },
    cardGap: { marginBottom: spacing.md },
    screenHeader: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg, paddingTop: spacing.xl },
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
    footerSubtext: { ...typography.caption2, color: colors.textTertiary, marginTop: 4 }
  });

export default IndexPageContent;
"""

with open('pages/IndexPage.tsx', 'w', encoding='utf-8') as f:
    f.write(new_index)
print("Rewrote IndexPage.tsx successfully to Categorized dashboard")
