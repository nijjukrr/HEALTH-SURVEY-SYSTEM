# HealthDrop Surveillance System

HealthDrop is an advanced, AI-powered disease surveillance and health management application built with React Native and Expo. The platform is designed to provide real-time monitoring, risk assessment, and actionable insights for public health management. It features a "Liquid Glass" inspired UI with dark/light theme support.

## 🚀 Features

* **Real-time Dashboard**: Comprehensive overview of national and regional health statistics.
* **Interactive Maps**: Heatmaps and categorized location mapping for hotspots and healthcare facilities using React Native Maps and Leaflet.
* **Risk Heatmap & Analysis**: Visual representation of health risks by region with detailed AI-driven explanatory panels.
* **Self-Assessment**: Built-in tools for users to evaluate their health status.
* **Proximity Stats**: Aarogya Setu-style proximity tracking for disease exposure risk.
* **Telemedicine & Hygiene Education**: Integrated modules for remote consultation and public health education.
* **Field Worker Logistics**: Dedicated tools for field health workers.
* **Theming**: Advanced 'Liquid Glass' UI with full light and dark mode support via Context API.
* **Authentication**: Dummy authentication flow for demonstration purposes with profile setup.

## 🛠️ Technology Stack

* **Framework**: [React Native](https://reactnative.dev/)
* **Build Tool**: [Expo](https://expo.dev/)
* **Navigation**: Expo Router / Custom Navigation (App.tsx based)
* **Maps**: `react-native-maps`, `react-leaflet`, `@react-google-maps/api`
* **Icons**: `@expo/vector-icons`
* **Storage**: `@react-native-async-storage/async-storage`
* **Backend/Auth Integration**: `@supabase/supabase-js` (prepared for integration)

## 📦 Project Structure

```text
├── App.tsx                 # Main application entry point and navigation setup
├── app.json                # Expo configuration
├── assets/                 # Images, icons, and fonts
├── components/             # Reusable UI components
│   ├── AuthScreen.tsx      # Login interface
│   ├── Card.tsx            # Generic card component
│   ├── HotspotMap.tsx      # Interactive map for disease hotspots
│   ├── RiskHeatmap.tsx     # Regional risk visualization
│   └── ...                 # Other modular components
├── lib/                    # Utilities and context
│   ├── ThemeContext.tsx    # Dark/Light mode state management
│   └── mockData.ts         # Sample data for development
├── pages/                  # Main application screens
│   ├── IndexPage.tsx       # Dashboard home screen
│   ├── NationalStats.tsx   # Detailed statistics view
│   ├── SettingsPage.tsx    # User settings and theme toggle
│   ├── ProfilePage.tsx     # User profile management
│   └── ...                 # Other full-screen pages
└── types/                  # TypeScript definitions
```

## ⚙️ Prerequisites

Before you begin, ensure you have met the following requirements:
* [Node.js](https://nodejs.org/) (v18 or newer recommended)
* npm or yarn package manager
* [Expo CLI](https://docs.expo.dev/get-started/installation/)
* Expo Go app installed on your iOS or Android device (for physical device testing)

## 💻 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NITISH-R-G/Health-Drop-Surveillance-System-main.git
   cd Health-Drop-Surveillance-System-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🚀 Running the App

Start the Expo development server:

```bash
npm start
# or
npx expo start
```

This will open the Expo Metro Bundler in your terminal. From there, you can:
* Press `a` to run on an Android emulator (if installed and running).
* Press `i` to run on an iOS simulator (if using a Mac).
* Scan the QR code with the **Expo Go** app on your physical device.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary. Please check the repository settings for specific usage rights and permissions.
