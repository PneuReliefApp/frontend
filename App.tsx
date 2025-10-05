import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import app from './src/services/firebaseConfig';

import HomeScreen from './src/screens/HomeScreen';
import PressureMapScreen from './src/screens/PressureMapScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import AuthScreen from './src/screens/AuthScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
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
                  case 'Home':
                    iconName = 'home';
                    break;
                  case 'PressureMap':
                    iconName = 'map';
                    break;
                  case 'History':
                    iconName = 'history';
                    break;
                  case 'Settings':
                    iconName = 'cog';
                    break;
                  default:
                    iconName = 'circle';
                }

                return (
                  <MaterialCommunityIcons name={iconName as any} size={size} color={color} />

                );
              },
            })}
          >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="PressureMap" component={PressureMapScreen} />
            <Tab.Screen name="History" component={HistoryScreen} />
            <Tab.Screen name="Settings" component={SettingsScreen} />
            <Tab.Screen name="Auth" component={AuthScreen} />
          </Tab.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
