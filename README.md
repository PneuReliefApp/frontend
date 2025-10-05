# frontend
React Native UI in Typescript using Expo

### Basic Setup
git clone repo <br />
cd frontend <br />
npm install <br />
npx expo start - this will launch the Expo developer tools in your terminal

### Accessing the app
#### Option A: Real Device (recommended for easier testing/expo first-time users)

Install the Expo Go app on your own mobile device: iOS App Store/Google Play Store <br />

After running `npx expo start` in your terminal, scan the QR code that appears with Expo Go, and the app will open on your device. <br />

#### Option B: Simulator (if you have a dev environment set up)

iOS <br />
Install Xcode from the App Store. In Expo, press i to open the iOS simulator. <br />

Android <br />
Install Android Studio. Set up an Android Virtual Device (AVD). In Expo, press a to open the Android emulator. <br />


### Command variations
npm start – start Expo dev server, from there choose how to launch app (QR code for Expo Go App/iOS Simulator or Android emulator) <br />
if not: <br />
npm run ios – directly run on iOS simulator <br />
npm run android – directly run on Android emulator <br />
npm run web - run on web (hardly) <br />

---

### Backend Integration
Make sure your FastAPI backend is running locally before launching the frontend. <br />
By default, the backend is hosted at:  
**http://127.0.0.1:8000** <br />

To start the backend server:  
uvicorn main:app --reload --host 0.0.0.0 --port 8000

---

### Environment Setup
Created a `.env` file in the **root of the frontend directory** (same level as App.tsx). <br />
This file stores your backend URL and Firebase configuration securely.

✅ **Note:**  
- `.env` is already listed in `.gitignore` (it will not be pushed to GitHub).  
- Make sure to replace the placeholder values with your actual Firebase configuration keys.  

---

### Running the App
1. Start the backend server. <br />
2. In another terminal, start the frontend using:
npx expo start
3. Launch the app using Expo Go (scan QR) or via simulator (press `i` for iOS / `a` for Android). <br />

### 🔥 Firebase Configuration
This project uses Firebase for Firestore and Analytics. <br />
All Firebase credentials are stored in the `.env` file and imported through `firebaseConfig.ts`. <br />
Ensure that you have access to the Firebase project (**Project PneuRelief**) and that Firestore is enabled. <br />
If testing locally, you can use development rules in Firestore and disable them later for production. <br />
