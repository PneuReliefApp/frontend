import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { initDatabase } from "./src/services/database";
import { setupBackgroundSync } from "./src/services/backgroundSync";

import HomeScreen from "./src/screens/HomeScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import NotifsScreen from "./src/screens/Settings/NotifsScreen";
import AuthScreen from "./src/screens/AuthScreen";
import SignupScreen from "./src/screens/SignupScreen";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CalibrationsScreen from "./src/screens/Settings/CalibrationsScreen";
import PneumaticsScreen from './src/screens/PneumaticsScreen';

const Tab = createBottomTabNavigator();
const SettingsStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

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

function AuthStackNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Auth" component={AuthScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    // Check for stored auth token on mount
    checkAuthStatus();

    // Add listener to re-check auth when app becomes active
    const interval = setInterval(checkAuthStatus, 1000); // Check every second

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Setup background sync when user is authenticated
    if (isAuthenticated && userId) {
      console.log(`User authenticated: ${userId}`);
      const cleanupSync = setupBackgroundSync(userId, 600000);
      return () => cleanupSync();
    } else {
      console.log("No user logged in.");
    }
  }, [isAuthenticated, userId]);

  const checkAuthStatus = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      const userString = await AsyncStorage.getItem("user");

      if (token && userString) {
        const user = JSON.parse(userString);
        setIsAuthenticated(true);
        setUserId(user.id);
      } else {
        setIsAuthenticated(false);
        setUserId(null);
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setIsAuthenticated(false);
      setUserId(null);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    // Show loading screen while checking auth status
    return null; // You can replace this with a loading spinner component
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            {!isAuthenticated ? (
              <AuthStackNavigator />
            ) : (
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
                        iconName = "clipboard-pulse";
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
          )}
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
