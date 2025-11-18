## Because react-native-ble-plx is a native Bluetooth module, the app cannot run in Expo Go and cannot be tested on an iOS simulator (simulators do not support Bluetooth).
Therefore, we must run the prebuilt native iOS project through Xcode in order to test real Bluetooth functionality.

### Step 1
##### Clone the repository's "mel-bluetooth" branch (IMPT: NOT MAIN BRANCH) and cd frontend
##### Insert the .env file into the root of the project folder

### Step 2 Install dependencies
##### npm install yarn
##### yarn add

### Step 3 Install cocoapods (only when cloning for the first time)
##### brew install cocoapods
##### cd ios >> pod install >> cd ..

### Step 4 Start the metro server
##### npx expo start
##### Should see output that server has started in the vscode terminal, will shows some qr code as well

### Step 5 
##### inside the ios/ folder, there is a pneurelieffrontend.xcworkspace file
##### open it using xcode (install from app store)

### Step 6 Go to "Signing & Capabilities".
##### Change the "Team" to your own Apple ID.
##### Change the bundle identifier to something unique (e.g., com.<yourname>.pneurelief). This is required because Apple does not allow sharing personal signing profiles.

### Step 7 running on device
##### connect your iphone to laptop using cable and select your iphone device on xcode to run the app
##### In Xcode, select your iPhone as the active device (top toolbar).
##### Press Run (▶️) to build and launch the app on your device.
##### ⚠️ Your iPhone may prompt you to enable Developer Mode, go to: Settings → Privacy & Security → Developer Mode → Turn On
