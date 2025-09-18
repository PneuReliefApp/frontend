# frontend
React Native UI in Typescript using Expo

### Basic Setup
git clone repo
cd frontend
npm install 
npm start - this will launch the Expo developer tools in your terminal

### Accessing the app
#### Option A: Real Device (recommended for easier testing/expo first-time users)

Install the Expo Go app on your own mobile device: iOS App Store/Google Play Store

After running npm start in your terminal, scan the QR code that appears with Expo Go, and the app will open on your device.

#### Option B: Simulator (if you have a dev environment set up)

iOS
Install Xcode from the App Store. In Expo, press i to open the iOS simulator.

Android
Install Android Studio. Set up an Android Virtual Device (AVD). In Expo, press a to open the Android emulator.


### Command variations
npm start – start Expo dev server, from there choose how to launch app (QR code for Expo Go App/iOS Simulator or Android emulator)
if not:
npm run ios – directly run on iOS simulator

npm run android – directly run on Android emulator

npm run web - run on web (hardly)
