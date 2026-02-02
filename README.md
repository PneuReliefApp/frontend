# PneuRelief Frontend

React Native app using Expo Dev Client for BLE connectivity with the ESP32-PneuRelief device.

---

## ⚠️ Important: BLE Testing Requirements

This app uses **react-native-ble-plx** for Bluetooth Low Energy (BLE). Because BLE is a native module:

- ❌ **Expo Go does NOT work for testing BLE** — it doesn't support native BLE modules
- ❌ **Simulators/Emulators do NOT work** — they don't have real Bluetooth hardware
- ✅ **Physical device required** — iPhone or Android phone with Bluetooth

We use **Expo Dev Client** (development builds) to run native modules on real devices.

---

## Quick Start

### Prerequisites

| Platform | Requirements |
|----------|-------------|
| **iOS (macOS only)** | Xcode, CocoaPods, iPhone with cable |
| **Android (any OS)** | Android Studio, Android phone with USB debugging |

### Install Dependencies

```bash
git clone <repo-url>
cd frontend
npm install
# or
yarn install
```

---

## iOS Setup (macOS + iPhone)

### First-time setup

```bash
# Install CocoaPods (if not already installed)
brew install cocoapods

# Install iOS native dependencies
cd ios && pod install && cd ..
```

### Run on iPhone

```bash
# Connect iPhone via USB cable, then:
npm run ios
# or
npx expo run:ios --device
```

This will:
1. Build the Expo Dev Client with BLE support
2. Install the app on your iPhone
3. Start Metro bundler for live reload

### First-time on device
- Your iPhone may prompt to **trust the developer** — go to Settings → General → VPN & Device Management
- Enable **Developer Mode** — Settings → Privacy & Security → Developer Mode → Turn On

### Alternative: Manual Xcode Build

If `npm run ios` doesn't work, you can build manually:

1. Open `ios/pneurelieffrontend.xcworkspace` in Xcode
2. Select your iPhone as the target device
3. Go to Signing & Capabilities → Change Team to your Apple ID
4. Change Bundle Identifier to something unique (e.g., `com.yourname.pneurelief`)
5. Click Run (▶️)

---

## Android Setup (Windows / macOS / Linux)

### First-time setup

1. Install [Android Studio](https://developer.android.com/studio)
2. Open Android Studio → SDK Manager → Install Android SDK
3. Enable USB debugging on your Android phone:
   - Settings → About Phone → Tap "Build Number" 7 times
   - Settings → Developer Options → Enable USB Debugging

### Run on Android Phone

```bash
# Connect Android phone via USB cable, then:
npm run android
# or
npx expo run:android --device
```

This will:
1. Build the Expo Dev Client with BLE support
2. Install the app on your Android phone
3. Start Metro bundler for live reload

---

## BLE Contract (Hardware Team)

| Property | Value |
|----------|-------|
| **Device Name** | `ESP32-PneuRelief` |
| **Service UUID** | `12345678-1234-1234-1234-1234567890ab` |
| **Sensor Char UUID** | `12345678-1234-1234-1234-123456789001` |
| **Control Char UUID** | `12345678-1234-1234-1234-123456789002` |
| **Status Char UUID** | `12345678-1234-1234-1234-123456789003` |
| **Frequency** | 20Hz |

### Command Format

Commands use a 4-byte hex encoding: `[section, inflate, deflate, pump]`

| Byte | Description | Values |
|------|-------------|--------|
| 0 | Section index | 0-3 |
| 1 | Inflate flag | 0 or 1 |
| 2 | Deflate flag | 0 or 1 |
| 3 | Pump flag | 0 or 1 |

---

## Development Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start Metro bundler only |
| `npm run ios` | Build & run on iOS device |
| `npm run android` | Build & run on Android device |
| `npm run web` | Run on web (limited functionality) |

---

## Backend Integration

The app connects to a FastAPI backend for data sync.

**Default backend URL:** `http://127.0.0.1:8000`

To start the backend:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

---

## Environment Setup

Create a `.env` file in the root directory with your configuration:

```env
EXPO_PUBLIC_API_URL=http://127.0.0.1:8000
EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

> ✅ `.env` is in `.gitignore` and won't be pushed to GitHub.

---

## Troubleshooting

### iOS: "Unable to boot device in current state"
- Make sure a physical iPhone is connected, not a simulator

### iOS: Build fails with signing error
- Open Xcode, go to Signing & Capabilities, select your Team

### Android: "No devices/emulators found"
- Enable USB debugging on your phone
- Run `adb devices` to verify connection

### BLE: Not finding device
- Make sure Bluetooth is ON on your phone
- Make sure the ESP32 is powered and advertising
- Check that device name matches `ESP32-PneuRelief`

---

## Project Structure

```
src/
├── components/       # Reusable UI components
├── screens/          # Screen components (HomeScreen, etc.)
├── services/
│   ├── bluetooth.ts  # BLE interface (connect, startStreaming, sendCommand)
│   ├── api.ts        # Backend API calls
│   ├── supabase_client.ts
│   └── database.ts   # Local SQLite storage
├── graphs/           # Chart/graph components
└── hooks/            # Custom React hooks
```
