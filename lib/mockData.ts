// Comprehensive mock data for the HealthDrop Surveillance System

export interface Region {
    id: string;
    name: string;
    district: string;
    population: number;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    riskScore: number;
    activeCases?: number; // Added for proportional circle sizing
}

export interface Outbreak {
    id: number;
    title: string;
    description: string;
    location: string;
    regionId: string;
    date: string;
    type: 'outbreak' | 'water_quality' | 'prevention' | 'alert';
    severity: 'critical' | 'high' | 'medium' | 'low';
    caseCount?: number;
    status: 'active' | 'contained' | 'resolved';
    coordinates?: {
        latitude: number;
        longitude: number;
    };
}

export interface WaterQualityReading {
    id: number;
    sourceId: string;
    sourceName: string;
    location: string;
    regionId: string;
    date: string;
    ph: number;
    turbidity: number;
    bacterialCount: number;
    status: 'safe' | 'warning' | 'danger';
}

export interface TrendDataPoint {
    label: string;
    value: number;
}

export interface AlertItem {
    id: number;
    title: string;
    message: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    timestamp: string;
    regionId: string;
    region: string;
    isRead: boolean;
    category: 'outbreak' | 'water' | 'prediction' | 'system';
}

export interface PredictionInsight {
    id: number;
    region: string;
    disease: string;
    probability: number;
    timeframe: string;
    confidence: number;
    factors: { name: string; impact: number; direction: 'up' | 'down' }[];
    reasoning: string;
}

export interface EnvironmentalData {
    regionId: string;
    rainfall: number;
    temperature: number;
    humidity: number;
    waterLevel: number;
}

// Regions
export const regions: Region[] = [
    { id: 'all', name: 'All Regions', district: 'India', population: 2450000, riskLevel: 'medium', riskScore: 62, activeCases: 145 },
    { id: 'coimbatore', name: 'Coimbatore', district: 'Coimbatore District', population: 1600000, riskLevel: 'critical', riskScore: 92, activeCases: 85 }, // Prioritized high-risk area
    { id: 'chiyanda', name: 'Chennai', district: 'Chennai', population: 7000000, riskLevel: 'high', riskScore: 78, activeCases: 32 },
    { id: 'bengaluru', name: 'Bengaluru', district: 'Bangalore Urban', population: 8400000, riskLevel: 'medium', riskScore: 55, activeCases: 15 },
    { id: 'mysuru', name: 'Mysuru', district: 'Mysore District', population: 1000000, riskLevel: 'low', riskScore: 28, activeCases: 4 },
    { id: 'shillong', name: 'Shillong', district: 'East Khasi Hills', population: 35400, riskLevel: 'high', riskScore: 78, activeCases: 22 },
    { id: 'mawsynram', name: 'Mawsynram', district: 'East Khasi Hills', population: 8200, riskLevel: 'critical', riskScore: 89, activeCases: 18 },
    { id: 'sohra', name: 'Sohhra', district: 'East Khasi Hills', population: 11500, riskLevel: 'medium', riskScore: 55, activeCases: 7 },
    { id: 'nongpoh', name: 'Nongpoh', district: 'Ri-Bhoi', population: 22600, riskLevel: 'high', riskScore: 72, activeCases: 12 },
    { id: 'tura', name: 'Tura', district: 'West Garo Hills', population: 41200, riskLevel: 'low', riskScore: 28, activeCases: 2 },
    { id: 'jowai', name: 'Jowai', district: 'West Jaintia Hills', population: 18900, riskLevel: 'medium', riskScore: 48, activeCases: 5 },
    { id: 'dawki', name: 'Dawki', district: 'West Jaintia Hills', population: 6700, riskLevel: 'low', riskScore: 32, activeCases: 1 },
];

// Outbreaks
export const outbreaks: Outbreak[] = [
    {
        id: 1,
        title: 'Cholera Outbreak Alert',
        description: 'Suspected cholera cases reported in riverside communities. Water sources contaminated after recent flooding. Immediate response team deployed.',
        location: 'Mawsynram Village',
        regionId: 'mawsynram',
        date: '2025-09-24',
        type: 'outbreak',
        severity: 'high',
        caseCount: 12,
        status: 'active',
    },
    {
        id: 2,
        title: 'Diarrhea Cluster Detected',
        description: 'AI model detected unusual pattern of diarrhea cases in the township area. Correlation with recent water quality degradation.',
        location: 'Sohra Township',
        regionId: 'sohra',
        date: '2025-09-23',
        type: 'outbreak',
        severity: 'medium',
        caseCount: 7,
        status: 'active',
    },
    {
        id: 3,
        title: 'Water Discoloration - Sewage Mixing',
        description: 'Residents report drinking water turning black and omitting a foul odor, likely due to sewage mixing in the Bhavani River supply. TNPCB testing ongoing.',
        location: 'Jadayampalayam Panchayat',
        regionId: 'coimbatore',
        date: '2026-02-15',
        type: 'outbreak',
        severity: 'critical',
        caseCount: 45,
        status: 'active',
    },
    {
        id: 4,
        title: 'Microplastic Contamination Detected',
        description: 'Elevated levels of microplastics found in local tanks posing ecological and health risks to freshwater organisms and residents.',
        location: 'Singanallur & Ukkadam Tanks',
        regionId: 'coimbatore',
        date: '2026-02-10',
        type: 'alert',
        severity: 'high',
        caseCount: 15,
        status: 'active',
    },
];

// Water quality
export const waterQualityAlerts: Outbreak[] = [
    {
        id: 10,
        title: 'Bhavani River Algal Bloom',
        description: 'River water turned yellow for a 6 km stretch near a major pumping station. Preliminary investigations point to severe algae spread. Fish deaths reported.',
        location: 'Sirumugai Pumping Station',
        regionId: 'coimbatore',
        date: '2026-03-01',
        type: 'water_quality',
        severity: 'high',
        status: 'active',
    },
    {
        id: 11,
        title: 'Leachate Percolation Warning',
        description: 'Groundwater sources contaminated due to leachate percolation from accumulated waste. Elevated TDS, BOD, and COD detected in local borewells.',
        location: 'Vellalore Dump Yard Area',
        regionId: 'coimbatore',
        date: '2025-08-20',
        type: 'water_quality',
        severity: 'critical',
        status: 'active',
    },
    {
        id: 12,
        title: 'Safe Water Restored',
        description: 'Water treatment completed at Tura municipal supply. All parameters within safe limits after chlorination.',
        location: 'Tura Town',
        regionId: 'tura',
        date: '2025-09-19',
        type: 'water_quality',
        severity: 'low',
        status: 'resolved',
    },
    {
        id: 13,
        title: 'Pipeline Burst - Supply Interruption',
        description: 'Main feeder pipeline burst causing massive water wastage and disruption. Low chlorine content suspected in alternate supplies.',
        location: 'Saravanampatti (Pillur-II)',
        regionId: 'coimbatore',
        date: '2025-11-15',
        type: 'water_quality',
        severity: 'medium',
        status: 'contained',
    },
];

// Prevention campaigns
export const preventionCampaigns: Outbreak[] = [
    {
        id: 20,
        title: 'Hygiene Education Campaign',
        description: 'Community awareness program on water-borne disease prevention. Distribution of water purification tablets and soap kits.',
        location: 'Multiple Villages',
        regionId: 'all',
        date: '2025-09-20',
        type: 'prevention',
        severity: 'low',
        status: 'active',
    },
    {
        id: 21,
        title: 'Well Chlorination Drive',
        description: 'Systematic chlorination of community wells across Ri-Bhoi district. 23 wells treated this week.',
        location: 'Ri-Bhoi District',
        regionId: 'nongpoh',
        date: '2025-09-18',
        type: 'prevention',
        severity: 'low',
        status: 'active',
    },
];

// Trend data
export const diseaseTrendData: TrendDataPoint[] = [
    { label: 'Jan', value: 5 },
    { label: 'Feb', value: 8 },
    { label: 'Mar', value: 6 },
    { label: 'Apr', value: 12 },
    { label: 'May', value: 18 },
    { label: 'Jun', value: 28 },
    { label: 'Jul', value: 45 },
    { label: 'Aug', value: 38 },
    { label: 'Sep', value: 32 },
    { label: 'Oct', value: 24 },
    { label: 'Nov', value: 15 },
    { label: 'Dec', value: 10 },
];

export const waterQualityTrendData: TrendDataPoint[] = [
    { label: 'Jan', value: 92 },
    { label: 'Feb', value: 88 },
    { label: 'Mar', value: 90 },
    { label: 'Apr', value: 85 },
    { label: 'May', value: 78 },
    { label: 'Jun', value: 65 },
    { label: 'Jul', value: 48 },
    { label: 'Aug', value: 55 },
    { label: 'Sep', value: 60 },
    { label: 'Oct', value: 72 },
    { label: 'Nov', value: 82 },
    { label: 'Dec', value: 86 },
];

// Alerts
export const alerts: AlertItem[] = [
    {
        id: 1,
        title: 'Critical Outbreak Risk',
        message: 'Mawsynram region risk score crossed critical threshold (89/100). Immediate attention required.',
        severity: 'critical',
        timestamp: '2025-09-24T08:30:00Z',
        regionId: 'mawsynram',
        region: 'Mawsynram',
        isRead: false,
        category: 'outbreak',
    },
    {
        id: 2,
        title: 'Water Quality Anomaly',
        message: 'Sudden spike in bacterial contamination detected at Nongpoh community well. Levels 4x above safe limit.',
        severity: 'high',
        timestamp: '2025-09-23T14:15:00Z',
        regionId: 'nongpoh',
        region: 'Nongpoh',
        isRead: false,
        category: 'water',
    },
    {
        id: 3,
        title: 'Outbreak Probability Rising',
        message: 'AI model predicts 75% cholera outbreak probability in Shillong within 7 days. Based on rainfall and case patterns.',
        severity: 'high',
        timestamp: '2025-09-23T10:00:00Z',
        regionId: 'shillong',
        region: 'Shillong',
        isRead: true,
        category: 'prediction',
    },
    {
        id: 4,
        title: 'New Cases Reported',
        message: 'ASHA worker reported 3 new diarrhea cases in Sohra Township. Pattern consistent with waterborne transmission.',
        severity: 'medium',
        timestamp: '2025-09-22T16:45:00Z',
        regionId: 'sohra',
        region: 'Sohra',
        isRead: true,
        category: 'outbreak',
    },
    {
        id: 5,
        title: 'Data Sync Complete',
        message: 'Offline reports from 12 field workers synchronized successfully. 47 new entries processed.',
        severity: 'low',
        timestamp: '2025-09-22T09:00:00Z',
        regionId: 'all',
        region: 'All Regions',
        isRead: true,
        category: 'system',
    },
];

// Prediction insights
export const predictionInsights: PredictionInsight[] = [
    {
        id: 1,
        region: 'Shillong Area',
        disease: 'Cholera',
        probability: 0.75,
        timeframe: 'Next 7 days',
        confidence: 0.82,
        factors: [
            { name: 'Heavy Rainfall', impact: 0.35, direction: 'up' },
            { name: 'Water Contamination', impact: 0.28, direction: 'up' },
            { name: 'Recent Case Spike', impact: 0.22, direction: 'up' },
            { name: 'Vaccination Rate', impact: 0.10, direction: 'down' },
            { name: 'Sanitation Score', impact: 0.05, direction: 'down' },
        ],
        reasoning: 'Heavy monsoon rainfall (320mm this week) combined with detected E.coli contamination in 3 water sources and a rising case trend (12 new cases in 5 days) strongly indicate elevated cholera risk. Historical data shows similar patterns preceded outbreaks in 2023 and 2024.',
    },
    {
        id: 2,
        region: 'Mawsynram',
        disease: 'Acute Diarrhea',
        probability: 0.68,
        timeframe: 'Next 14 days',
        confidence: 0.74,
        factors: [
            { name: 'Flooding Events', impact: 0.30, direction: 'up' },
            { name: 'Sanitation Disruption', impact: 0.25, direction: 'up' },
            { name: 'Community Hygiene', impact: 0.20, direction: 'up' },
            { name: 'Response Speed', impact: 0.15, direction: 'down' },
            { name: 'Temperature', impact: 0.10, direction: 'up' },
        ],
        reasoning: 'Recent flooding disrupted sanitation infrastructure in Mawsynram. Combined with limited access to clean water and high ambient temperatures, conditions are favorable for diarrheal disease transmission. Response teams have been deployed which may reduce the risk.',
    },
];

// Environmental data
export const environmentalData: EnvironmentalData[] = [
    { regionId: 'shillong', rainfall: 320, temperature: 22, humidity: 92, waterLevel: 78 },
    { regionId: 'mawsynram', rainfall: 480, temperature: 24, humidity: 96, waterLevel: 85 },
    { regionId: 'sohra', rainfall: 290, temperature: 21, humidity: 88, waterLevel: 65 },
    { regionId: 'nongpoh', rainfall: 180, temperature: 26, humidity: 82, waterLevel: 55 },
    { regionId: 'tura', rainfall: 120, temperature: 28, humidity: 75, waterLevel: 40 },
    { regionId: 'jowai', rainfall: 200, temperature: 23, humidity: 85, waterLevel: 60 },
    { regionId: 'dawki', rainfall: 150, temperature: 25, humidity: 80, waterLevel: 45 },
];

// Stats summary
export const dashboardStats = {
    totalCases: 47,
    activeCases: 27,
    waterSourcesTested: 23,
    waterSourcesUnsafe: 5,
    villagesAffected: 8,
    villagesTotal: 34,
    peopleEducated: 1560,
    alertsActive: 3,
    fieldWorkers: 42,
    reportsToday: 18,
};

// Helper function to filter by region
export const filterByRegion = <T extends { regionId: string }>(data: T[], regionId: string): T[] => {
    if (regionId === 'all') return data;
    return data.filter(item => item.regionId === regionId);
};
