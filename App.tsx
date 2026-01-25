import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { supabase } from "./src/services/supabase_client";
import { Session } from "@supabase/supabase-js";
import { initDatabase } from "./src/services/database";
import { setupBackgroundSync } from "./src/services/backgroundSync";

import HomeScreen from "./src/screens/HomeScreen";
import ReportsScreen from "./src/screens/ReportsScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import NotifsScreen from "./src/screens/Settings/NotifsScreen";
import AuthScreen from "./src/screens/AuthScreen";
import SignupScreen from "./src/screens/SignupScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
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
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    initDatabase();
  }, []);

  useEffect(() => {
    // Check current supabase session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes: login/logout/token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      if (session?.user) {
        console.log(`User authenticated: ${session.user.id}`);

        // Store tokens in AsyncStorage for backward compatibility
        AsyncStorage.setItem("access_token", session.access_token);
        AsyncStorage.setItem("refresh_token", session.refresh_token);
        AsyncStorage.setItem("user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          full_name: session.user.user_metadata?.full_name || session.user.email,
        }));

        // Setup background sync once we have a real UID
        const cleanupSync = setupBackgroundSync(session.user.id, 600000);

        // Stop the sync if the user logs out
        return () => cleanupSync();
      } else {
        console.log("No user logged in.");

        // Clear AsyncStorage on logout
        AsyncStorage.removeItem("access_token");
        AsyncStorage.removeItem("refresh_token");
        AsyncStorage.removeItem("user");
      }
    });

    // Cleanup the listener when the app unmounts
    return () => subscription.unsubscribe();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            {!session ? (
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
                      case "Pneumatics":
                        iconName = "air-filter";
                        break;
                      case "Reports":
                        iconName = "clipboard-pulse";
                        break;
                      case "Settings":
                        iconName = "cog";
                        break;
                      case "Profile":
                        iconName = "account";
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
              <Tab.Screen name="Profile" component={ProfileScreen} />
            </Tab.Navigator>
          )}
          </NavigationContainer>
        </SafeAreaProvider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
