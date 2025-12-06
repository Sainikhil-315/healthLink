# 🏥 HealthLink Mobile - Smart Emergency Response System

> **Mind Sprint 2K25 Hackathon Project**  
> **Emergency Response Time: 20 minutes → 5 minutes**  
> **React Native Mobile Application**

---

## 📱 About HealthLink

HealthLink is an intelligent emergency response mobile application that eliminates human handoffs and automates resource allocation during medical emergencies. Built with React Native for cross-platform support (iOS & Android).

### 🎯 Core Innovation

**Dual-Mode Emergency Response:**
- **Self-Emergency**: User presses SOS → Auto-dispatch based on health profile
- **Bystander Emergency**: Anyone can report accidents → Quick triage → CPR volunteer dispatch

---

## 🚀 Tech Stack

### Frontend (Mobile)
- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build tooling
- **React Navigation** - Navigation system
- **Zustand** - Lightweight state management
- **Socket.IO Client** - Real-time updates
- **Axios** - HTTP requests
- **Expo Location** - GPS tracking
- **Expo Notifications** - Push notifications
- **React Native Maps** - Map integration

### Backend
- **Node.js + Express** - REST API
- **MongoDB + Mongoose** - Database
- **Socket.IO** - Real-time communication
- **Redis (Upstash)** - Location caching
- **JWT** - Authentication
- **Nodemailer** - Email notifications

### Third-Party Services (FREE)
- **OpenStreetMap** - Maps (no API key)
- **Expo Push Notifications** - Push alerts
- **Cloudinary** - Image storage
- **Upstash Redis** - Real-time cache

---

## 📂 Project Structure

```
healthlink/
├── mobile/                        # React Native App
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── common/          # Buttons, Cards, Inputs
│   │   │   ├── maps/            # Map markers, polylines
│   │   │   ├── emergency/       # SOS, Triage forms
│   │   │   ├── ambulance/       # Driver components
│   │   │   ├── hospital/        # Bed management
│   │   │   ├── volunteer/       # Mission alerts
│   │   │   ├── donor/           # Blood donation
│   │   │   └── admin/           # Admin components
│   │   │
│   │   ├── screens/             # App screens by role
│   │   │   ├── Auth/            # Login, Register
│   │   │   ├── User/            # SOS, Track ambulance
│   │   │   ├── Hospital/        # Beds, Incoming patients
│   │   │   ├── Ambulance/       # Active trips, Navigation
│   │   │   ├── Volunteer/       # Nearby emergencies
│   │   │   ├── Donor/           # Blood requests
│   │   │   └── Admin/           # Dashboard, Analytics
│   │   │
│   │   ├── navigation/          # React Navigation setup
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # API & Location services
│   │   ├── store/               # Zustand state
│   │   └── utils/               # Constants, validators
│   │
│   ├── App.jsx                  # Root component
│   ├── app.json                 # Expo config
│   └── package.json
│
└── backend/                      # Node.js API (separate repo)
```

---

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ installed
- Expo CLI installed globally: `npm install -g expo-cli`
- Physical device or emulator (iOS Simulator / Android Studio)
- MongoDB running (for backend)

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/healthlink-mobile.git
cd healthlink-mobile
```

### 2️⃣ Install Dependencies

```bash
cd mobile
npm install
```

### 3️⃣ Environment Configuration

Create `.env` file in `mobile/` directory:

```env
# API Configuration
API_URL=http://your-backend-url:5000/api/v1
SOCKET_URL=http://your-backend-url:5000

# For local development
# API_URL=http://192.168.1.100:5000/api/v1
# SOCKET_URL=http://192.168.1.100:5000
```

### 4️⃣ Start Development Server

```bash
# Start Expo development server
npm start

# Run on Android
npm run android

# Run on iOS (Mac only)
npm run ios
```

### 5️⃣ Backend Setup (Separate Repository)

```bash
# Clone backend
git clone https://github.com/your-username/healthlink-backend.git
cd healthlink-backend

# Install dependencies
npm install

# Configure .env
cp .env.example .env
# Edit .env with your MongoDB URI, JWT secret, etc.

# Start backend
npm run dev
```

---

## 📲 Features by Role

### 👤 User (General Public)
- ✅ **One-Tap SOS** - Instant emergency alert
- ✅ **Bystander Report** - Report accidents for others
- ✅ **Live Ambulance Tracking** - See ETA and location
- ✅ **Auto-Notify Contacts** - SMS to 3 emergency contacts
- ✅ **Health Profile** - Blood type, conditions, medications

### 🚑 Ambulance Driver
- ✅ **Duty Toggle** - Go online/offline
- ✅ **Emergency Requests** - Accept/decline trips
- ✅ **Turn-by-Turn Navigation** - Google Maps integration
- ✅ **Patient Details** - View triage and medical history
- ✅ **Background Location** - Real-time tracking

### 🏥 Hospital
- ✅ **Bed Management** - Update availability (General/ICU/Emergency)
- ✅ **Incoming Alerts** - See ambulances en route
- ✅ **Emergency Toggle** - Pause/resume intake
- ✅ **Patient History** - View admissions

### 👨‍⚕️ Volunteer (CPR-Trained)
- ✅ **Nearby Emergencies** - Critical cases within 5km
- ✅ **Mission Acceptance** - Respond to cardiac arrests
- ✅ **Live Navigation** - Reach scene before ambulance
- ✅ **Stats & Badges** - Track lives saved

### 🩸 Blood Donor
- ✅ **Availability Toggle** - Mark as available
- ✅ **Eligibility Check** - 90-day gap validation
- ✅ **Urgent Requests** - Get alerted when needed
- ✅ **Donation History** - Track contributions

### 🛡️ Admin
- ✅ **Dashboard** - System overview
- ✅ **Analytics** - Response times, success rates
- ✅ **Verify Users** - Approve volunteers, ambulances, hospitals
- ✅ **Manage Resources** - Monitor utilization

---

## 🔑 Key Features

### 1. Real-Time Location Tracking
```javascript
// Background location for ambulances & volunteers
useBackgroundLocation()
  .startBackgroundTracking()
  .then(() => console.log('Tracking started'));
```

### 2. Socket.IO Integration
```javascript
// Real-time emergency updates
socketService.on('emergencyCreated', (data) => {
  showNotification('New Emergency', data.location);
});
```

### 3. Smart Triage System
```javascript
// Quick assessment questions
const triageQuestions = [
  { id: 'conscious', question: 'Is person conscious?' },
  { id: 'breathing', question: 'Is person breathing?' },
  { id: 'bleeding', question: 'Heavy bleeding?' }
];
```

### 4. Push Notifications
```javascript
// Emergency alerts
notificationService.showEmergencyAlert({
  title: '🚨 Emergency Alert',
  body: 'Critical patient 500m away',
  data: { incidentId: '...' }
});
```

---

## 🎨 UI/UX Highlights

### Design System
- **Colors**: Material Design inspired
- **Typography**: System fonts (SF Pro / Roboto)
- **Components**: Reusable, themeable
- **Animations**: Smooth transitions with Reanimated

### Key Screens
1. **SOS Screen** - Pulsing red button with countdown
2. **Track Screen** - Live map with ambulance marker
3. **Triage Form** - Simple yes/no questions
4. **Dashboard** - Role-based card layout

---

## 🔐 Security

- **JWT Authentication** - Secure token-based auth
- **Role-Based Access** - Different screens per role
- **Location Permissions** - Request only when needed
- **Encrypted Storage** - AsyncStorage for tokens
- **HTTPS Only** - All API calls encrypted

---

## 📊 Performance Metrics

| Metric | Target | Current |
|--------|--------|---------|
| App Launch | < 2s | 1.8s |
| Location Update | 5s interval | ✅ |
| Socket Latency | < 500ms | ~200ms |
| Bundle Size | < 30MB | 24MB |

---

## 🧪 Testing

```bash
# Run tests (to be added)
npm test

# Run linter
npm run lint

# Type checking (if TypeScript)
npm run type-check
```

---

## 📦 Building for Production

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Install on device
adb install healthlink.apk
```

### iOS IPA (Mac Only)
```bash
# Build IPA
eas build --platform ios --profile preview

# TestFlight distribution
eas submit --platform ios
```

---

## 🐛 Common Issues & Fixes

### 1. Location Not Working
```bash
# Check permissions
expo install expo-location
# Restart app and accept permissions
```

### 2. Socket Connection Failed
```bash
# Use local IP instead of localhost
API_URL=http://192.168.1.100:5000/api/v1
```

### 3. Maps Not Showing
```bash
# Reinstall maps
expo install react-native-maps
```

### 4. Build Errors
```bash
# Clear cache
expo start -c
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**PSCMR College of Engineering & Technology**

- **Team Lead** - [Your Name]
- **Backend Developer** - [Name]
- **Frontend Developer** - [Name]
- **UI/UX Designer** - [Name]

---

## 🙏 Acknowledgments

- Mind Sprint 2K25 Hackathon organizers
- Open source community
- Emergency responders who inspired this project

---

## 📞 Support

- **Email**: support@healthlink.app
- **Discord**: [Join our server]
- **Documentation**: [docs.healthlink.app]

---

## 🚀 Roadmap

### Phase 1 (Current - MVP)
- ✅ Dual-mode SOS
- ✅ Real-time tracking
- ✅ Volunteer dispatch
- ✅ Blood donor network

### Phase 2 (Next 3 months)
- [ ] Voice-activated SOS
- [ ] Multi-language support
- [ ] Offline mode
- [ ] Medical records integration

### Phase 3 (Next 6 months)
- [ ] AI-powered triage
- [ ] Drone integration
- [ ] Wearable device sync
- [ ] Insurance integration

---

## 📸 Screenshots

| SOS Screen | Track Ambulance | Volunteer Alert |
|------------|-----------------|-----------------|
| ![SOS](./screenshots/sos.png) | ![Track](./screenshots/track.png) | ![Alert](./screenshots/alert.png) |

---

## ⚡ Quick Start Commands

```bash
# Clone repo
git clone https://github.com/your-username/healthlink-mobile.git

# Install dependencies
cd mobile && npm install

# Start development
npm start

# Run on Android
npm run android
```

---

**Built with ❤️ for saving lives**