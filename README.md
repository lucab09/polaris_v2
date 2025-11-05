# 🔐 Polaris - Privacy-Centric Data Sharing App

A mobile application that empowers users to control their data, choose what to share, and earn rewards in a privacy-first, decentralized ecosystem.

## 🎯 Vision

Polaris aims to revolutionize how personal data is handled by shifting control from corporations to users. Instead of companies collecting data without consent, Polaris enables users to:

- **Own their data** - Store it locally on their device, encrypted
- **Control sharing** - Decide exactly what data to share and how detailed
- **Earn rewards** - Get compensated fairly for sharing their data
- **Stay private** - End-to-end encryption ensures only you can access your data

## 🏗️ Architecture Overview

### Tech Stack

**Frontend:**
- React Native + Expo (iOS focused for MVP)
- TypeScript for type safety
- Zustand for state management
- React Navigation for routing
- NativeWind/Tailwind for styling

**Backend:**
- Node.js + Express (minimal discovery/coordination server)
- Prepared for future P2P migration with Holepunch/Hyperswarm

**Storage:**
- SQLite (local, on-device, encrypted)
- AsyncStorage (preferences and settings)
- End-to-end encryption using AES-256

**Data Collection:**
- expo-location for location tracking
- Custom browsing tracking via WebView
- Granular consent system

## 📁 Project Structure

```
polaris_v2/
├── src/
│   ├── App.tsx                    # Main app component
│   ├── navigation/
│   │   └── RootNavigator.tsx      # Navigation setup
│   ├── screens/
│   │   ├── OnboardingScreen.tsx   # Onboarding flow
│   │   ├── HomeScreen.tsx         # Home dashboard
│   │   ├── ConsentsScreen.tsx     # Privacy consent management
│   │   ├── DataDashboardScreen.tsx # Data insights
│   │   └── SettingsScreen.tsx     # App settings
│   ├── components/
│   │   └── ConsentCard.tsx        # Consent management component
│   ├── services/
│   │   ├── storage.ts            # SQLite storage service
│   │   ├── locationService.ts    # Location tracking
│   │   ├── browsingService.ts    # Browsing tracking
│   │   ├── encryptionService.ts  # Encryption/decryption
│   │   └── apiService.ts         # API communication
│   ├── store/
│   │   ├── userStore.ts          # User state management
│   │   └── consentStore.ts       # Consent state management
│   ├── hooks/
│   │   ├── useLocation.ts        # Location tracking hook
│   │   └── useBrowsingData.ts    # Browsing tracking hook
│   ├── utils/
│   │   ├── constants.ts          # App constants
│   │   └── helpers.ts            # Utility functions
│   └── types/
│       └── index.ts              # TypeScript types
├── index.ts                       # Entry point
├── package.json
├── tsconfig.json
├── app.json                       # Expo configuration
├── metro.config.js               # Metro bundler config
├── .eslintrc.json
├── .prettierrc
└── .gitignore
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS development environment (for building iOS app)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd polaris_v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on iOS**
   ```bash
   npm run ios
   ```

   Or use the Expo app on your phone to scan the QR code.

## 🎯 MVP Features (Phase 1: Weeks 1-8)

### ✅ Implemented
- [x] User registration and authentication
- [x] Granular consent management system
- [x] Location tracking with privacy controls
- [x] Browsing data tracking
- [x] Local SQLite storage with encryption
- [x] UI/UX for onboarding and privacy settings
- [x] Data dashboard showing statistics
- [x] Settings and account management

### 🔄 In Progress
- [ ] Backend API for data synchronization
- [ ] Marketplace integration (view available buyers)
- [ ] Data aggregation and anonymization
- [ ] Reward system calculation

### 📋 Planned for Future Phases
- [ ] Full P2P migration (Hyperswarm + Hypercore)
- [ ] Web3 tokenomics and rewards
- [ ] Marketplace for data buyers
- [ ] Android support
- [ ] Advanced analytics and insights
- [ ] Data export in multiple formats

## 🔐 Privacy & Security

### Data Protection
- **Local Storage**: All data is stored on your device, never on servers
- **Encryption**: AES-256 encryption for all sensitive data
- **Granular Control**: Users choose exactly what data to share and how detailed
- **Auto-Delete**: Data automatically deletes based on retention preferences

### Compliance
- GDPR ready
- Privacy by design
- No tracking without consent
- Transparent data handling

## 📱 iOS Configuration

The app requires the following permissions (iOS 11+):

- **Location**: For location-based features
- **Network**: For syncing data with server

All permissions are requested with user-friendly explanations.

## 🔧 Development

### Code Quality
```bash
# Run linter
npm run lint

# Format code
npm run format

# Type checking
npm run type-check
```

### Testing
```bash
# Run tests
npm test
```

## 📚 API Documentation

### Future Server Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/data/location/sync` - Sync location data
- `POST /api/data/browsing/sync` - Sync browsing data
- `GET /api/marketplace/buyers` - Get available data buyers
- `POST /api/consents/submit` - Submit consent preferences
- `GET /api/stats/user/:userId` - Get user data statistics

## 🛣️ Roadmap

### Q1 2024
- [x] MVP app with core features
- [ ] Backend server for data sync
- [ ] Marketplace MVP

### Q2 2024
- [ ] Android support
- [ ] Advanced analytics
- [ ] Web dashboard for users

### Q3 2024
- [ ] P2P migration (Hyperswarm)
- [ ] Web3 integration
- [ ] Token rewards system

### Q4 2024
- [ ] Enterprise partnerships
- [ ] Advanced data marketplace
- [ ] Governance system

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Contact

- **Website**: [polaris.app](https://polaris.app)
- **Email**: hello@polaris.app
- **Twitter**: [@PolarisApp](https://twitter.com/polarisapp)

## 🙏 Acknowledgments

- Holepunch/Hypercore team for P2P infrastructure
- React Native and Expo communities
- All contributors and supporters

---

**Made with ❤️ to give users control of their data**
