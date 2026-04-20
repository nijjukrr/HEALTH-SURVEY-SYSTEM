import sys

with open('pages/IndexPage.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

start_idx = text.find('  // === Main Dashboard ===')
end_idx = text.find('const createStyles = (colors: Theme) =>')

if start_idx == -1 or end_idx == -1:
    print('Failed to find start or end index')
    sys.exit(1)

new_dashboard = """  // === Main Dashboard ===
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    const screens = ['Dashboard', 'Outbreaks', 'WaterQuality', 'Warnings'];
    if (screens[index] && screens[index] !== currentScreen) {
      setCurrentScreen(screens[index]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors.surface} />
      <Navbar onMenuPress={() => setSidebarVisible(true)} userName={userName} toggleTheme={toggleTheme} />
      <Sidebar isVisible={isSidebarVisible} onClose={() => setSidebarVisible(false)} onNavigate={handleNavigation} isGuest={isGuest} />

      <ScrollView 
        ref={scrollViewRef}
        horizontal 
        pagingEnabled 
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.content}
      >
        {/* === SLIDE 1: Dashboard Overview === */}
        <ScrollView style={{ width }} showsVerticalScrollIndicator={false}>
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
          <AlertBanner alerts={filteredAlerts} />
          
          <HealthStatusBadge riskLevel={userRiskLevel} lastAssessed="Just now" />

          <View style={styles.ctaContainer}>
            <TouchableOpacity
              style={styles.ctaButton}
              onPress={() => handleNavigation('SelfAssessment')}
              activeOpacity={0.7}
            >
              <Ionicons name="clipboard" size={32} color={colors.primary} style={{ marginRight: 16 }} />
              <View style={styles.ctaContent}>
                <Text style={styles.ctaTitle}>Take Self-Assessment</Text>
                <Text style={styles.ctaSubtitle}>Check your water-borne disease risk</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <HeroSection userName={userName} selectedRegion={selectedRegion} />
          <RegionFilter regions={regions} selectedRegion={selectedRegion} onSelect={handleRegionSelect} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
              {[
                { icon: 'megaphone', label: 'Report', screen: 'CommunityReport' },
                { icon: 'stats-chart', label: 'Statistics', screen: 'NationalStats' },
                { icon: 'map', label: 'Hotspots', screen: 'HotspotMap' },
                { icon: 'flask', label: 'Labs', screen: 'TestingLabs' },
                { icon: 'warning', label: 'Helpline', screen: 'Helpline' },
                { icon: 'document-text', label: 'Certificate', screen: 'HealthCertificate' },
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

        {/* === SLIDE 2: Outbreaks === */}
        <ScrollView style={{ width }} showsVerticalScrollIndicator={false}>
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

        {/* === SLIDE 3: Water Quality === */}
        <ScrollView style={{ width }} showsVerticalScrollIndicator={false}>
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

        {/* === SLIDE 4: Warnings / Alerts === */}
        <ScrollView style={{ width }} showsVerticalScrollIndicator={false}>
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

      </ScrollView>
    </View>
  );
};
"""

text = text[:start_idx] + new_dashboard + text[end_idx:]

with open('pages/IndexPage.tsx', 'w', encoding='utf-8') as f:
    f.write(text)
print('Replaced Dashboard with Carousel')
