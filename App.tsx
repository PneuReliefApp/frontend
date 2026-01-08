import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import app from "./src/services/firebaseConfig";
import { setupBackgroundSync } from "./src/services/backgroundSync";

import HomeScreen from "./src/screens/HomeScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import NotifsScreen from "./src/screens/Settings/NotifsScreen";
import AuthScreen from "./src/screens/AuthScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CalibrationsScreen from "./src/screens/Settings/CalibrationsScreen";
import PneumaticsScreen from './src/screens/PneumaticsScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();

function SettingsStackNavigator() {
  return (
    <SettingsStack.Navigator screenOptions={{ headerShown: true }}>
      <SettingsStack.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
      <SettingsStack.Screen name="Notifications" component={NotifsScreen} />
      <SettingsStack.Screen
        name="Calibrations"
        component={CalibrationsScreen}
      />
    </SettingsStack.Navigator>
  );
}

export default function App() {
  // ============================================================================
  // BACKGROUND SYNC SETUP
  // ============================================================================
  // Automatically syncs local sensor data to backend every 1 hour
  useEffect(() => {
    // TODO: Replace 'user123' with actual userId from Firebase Auth
    // Example: const user = auth().currentUser; const userId = user?.uid;
    const userId = 'user123';
    
    // Setup auto-sync every 1 hour (3600000 ms)
    console.log('🚀 Initializing background sync...');
    const cleanup = setupBackgroundSync(userId, 3600000);
    
    // Cleanup interval when app unmounts
    return cleanup;
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Tab.Navigator
              initialRouteName="Home"
              screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                  let iconName: string;

                  switch (route.name) {
                    case "Home":
                      iconName = "home";
                      break;
                    case "Reports":
                      iconName = "report";
                      break;
                    case "Settings":
                      iconName = "cog";
                      break;
                    default:
                      iconName = "circle";
                  }

                  return (
                    <MaterialCommunityIcons
                      name={iconName as any}
                      size={size}
                      color={color}
                    />
                  );
                },
              })}
            >
              <Tab.Screen name="Home" component={HomeScreen} />
              <Tab.Screen name="Pneumatics" component={PneumaticsScreen} />
              <Tab.Screen name="Reports" component={ReportsScreen} />
              <Tab.Screen name="Settings" component={SettingsStackNavigator} />
              <Tab.Screen name="Auth" component={AuthScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
