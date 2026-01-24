// src/screens/SettingsScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  List,
  Avatar,
  Divider,
  useTheme,
  TouchableRipple,
  Text,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import {
  syncLocalDataToBackend,
  clearLocalData,
  startDataSimulation,
  stopDataSimulation,
} from "../services/backgroundSync";
import { supabase } from "../services/supabase_client";
import { db } from "../services/database";

type ProfilePageProps = NativeStackScreenProps<any, any>;

const MALE_AVATAR =
  "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=740";
const FEMALE_AVATAR =
  "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?w=740";

const resolveAvatarUrl = (g: "male" | "female") =>
  g === "female" ? FEMALE_AVATAR : MALE_AVATAR;

const SettingsScreen: React.FC<ProfilePageProps> = ({ navigation }) => {
  const theme = useTheme();

  const [isSimulating, setIsSimulating] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // ✅ Dynamic profile
  const [displayName, setDisplayName] = useState<string>("User");
  const [avatarUrl, setAvatarUrl] = useState<string>(MALE_AVATAR);

  /**
   * ✅ Load user profile safely (no .trim on undefined)
   * - Name fallback: full_name/name/display_name -> email prefix -> "User"
   * - Avatar fallback: avatar_gender -> "male"
   */
  const loadProfile = useCallback(async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;

      const user = data?.user;

      if (!user) {
        setDisplayName("User");
        setAvatarUrl(resolveAvatarUrl("male"));
        return;
      }

      const rawMetaName =
        user.user_metadata?.full_name ??
        user.user_metadata?.name ??
        user.user_metadata?.display_name;

      const metaName = typeof rawMetaName === "string" ? rawMetaName.trim() : "";

      const emailPrefix =
        typeof user.email === "string" && user.email.includes("@")
          ? user.email.split("@")[0]
          : "";

      setDisplayName(metaName.length > 0 ? metaName : emailPrefix || "User");

      const metaGenderRaw = user.user_metadata?.avatar_gender;
      const metaGender: "male" | "female" =
        metaGenderRaw === "female" ? "female" : "male";

      setAvatarUrl(resolveAvatarUrl(metaGender));
    } catch (e) {
      console.error("Failed to load profile:", e);
      setDisplayName("User");
      setAvatarUrl(resolveAvatarUrl("male"));
    }
  }, []);

  // Initial load + refresh when screen regains focus (after EditProfile)
  useEffect(() => {
    loadProfile();
    const unsubscribe = navigation.addListener("focus", () => {
      loadProfile();
    });
    return unsubscribe;
  }, [navigation, loadProfile]);

  const peekDatabase = async () => {
    try {
      const rows = await db.getAllAsync<any>(
        "SELECT * FROM raw_packets ORDER BY id DESC LIMIT 5"
      );

      if (!rows || rows.length === 0) {
        Alert.alert("Database Empty", "Start the simulation first!");
        return;
      }

      const displayData = rows
        .map((r: any) => {
          const id = r?.id ?? "N/A";
          const patch = r?.patch_id ?? "N/A";
          const pressure =
            typeof r?.pressure === "number"
              ? r.pressure.toFixed(1)
              : String(r?.pressure ?? "N/A");
          return `ID: ${id} | ${patch} | ${pressure}`;
        })
        .join("\n");

      Alert.alert("Last 5 Readings", displayData);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to read SQLite data.");
    }
  };

  const toggleSimulation = () => {
    if (isSimulating) {
      stopDataSimulation();
      setIsSimulating(false);
      Alert.alert("Simulation Stopped", "No longer generating packets.");
    } else {
      startDataSimulation();
      setIsSimulating(true);
      Alert.alert(
        "Simulation Started",
        "Generating 20 packets per second to SQLite."
      );
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        return Alert.alert("Error", "No user authenticated");
      }

      const result = await syncLocalDataToBackend(session.user.id);

      const rowRes = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM raw_packets"
      );

      Alert.alert(
        "Sync Result",
        `Uploaded: ${result.readingsCount} readings\nDatabase now has: ${
          rowRes?.count || 0
        } rows`
      );
    } catch (err) {
      console.error(err);
      Alert.alert("Sync Failed", "Check your FastAPI backend connection.");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteLocalData = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to wipe all local sensor data? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete All",
          style: "destructive",
          onPress: async () => {
            try {
              await clearLocalData();
              Alert.alert("Success", "Local database has been cleared.");
            } catch (e) {
              console.error(e);
              Alert.alert("Error", "Failed to clear local data.");
            }
          },
        },
      ]
    );
  };

  /**
   * ✅ Logout
   * - You DO NOT need navigation.reset. App.tsx swaps stacks when session becomes null.
   */
  const handleLogout = () => {
    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            try {
              stopDataSimulation();
              setIsSimulating(false);
            } catch {}
          } catch (e: any) {
            console.error("Logout failed:", e?.message || e);
            Alert.alert("Logout failed", e?.message || "Please try again.");
          }
        },
      },
    ]);
  };

  // ✅ Only include screens you actually registered in SettingsStackNavigator()
  const menuItems = [
    {
      title: "Edit Profile",
      icon: "account-edit",
      onPress: () => navigation.navigate("EditProfile"),
    },
    {
      title: "Notifications",
      icon: "bell",
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      title: "Calibrations",
      icon: "history",
      onPress: () => navigation.navigate("Calibrations"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Avatar.Image size={120} source={{ uri: avatarUrl }} />
        </View>

        <Text style={styles.username}>{displayName}</Text>
        <Text style={styles.subtitle}>Manage your account and app settings</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
        {/* Simulation */}
        <TouchableRipple
          onPress={toggleSimulation}
          rippleColor="rgba(0,0,0,0.1)"
        >
          <View style={styles.menuItem}>
            <List.Icon
              icon={isSimulating ? "stop-circle" : "play-circle"}
              color={isSimulating ? theme.colors.error : "green"}
            />
            <Text style={styles.menuText}>
              {isSimulating ? "Stop 20Hz Simulation" : "Start 20Hz Simulation"}
            </Text>
            {isSimulating && (
              <Text style={styles.runningTag}>RUNNING</Text>
            )}
          </View>
        </TouchableRipple>

        {/* Peek DB */}
        <TouchableRipple onPress={peekDatabase} rippleColor="rgba(0,0,0,0.1)">
          <View style={styles.menuItem}>
            <List.Icon icon="eye" color="blue" />
            <Text style={styles.menuText}>Peek SQLite Data</Text>
          </View>
        </TouchableRipple>

        {/* Clear data */}
        <TouchableRipple
          onPress={handleDeleteLocalData}
          rippleColor="rgba(255,0,0,0.08)"
        >
          <View style={styles.menuItem}>
            <List.Icon icon="database-remove" color={theme.colors.error} />
            <Text style={[styles.menuText, { color: theme.colors.error }]}>
              Clear All Local Data
            </Text>
          </View>
        </TouchableRipple>

        {/* Sync */}
        <TouchableRipple
          onPress={handleManualSync}
          disabled={isSyncing}
          rippleColor="rgba(0,0,0,0.1)"
        >
          <View style={[styles.menuItem, isSyncing && { opacity: 0.6 }]}>
            <List.Icon
              icon="cloud-upload"
              color={isSyncing ? "gray" : theme.colors.primary}
            />
            <Text style={styles.menuText}>
              {isSyncing ? "Syncing..." : "Sync Local Data to Backend"}
            </Text>
          </View>
        </TouchableRipple>

        {/* Navigation items */}
        {menuItems.map((item, index) => (
          <TouchableRipple
            key={index}
            onPress={item.onPress}
            rippleColor="rgba(0,0,0,0.1)"
          >
            <View style={styles.menuItem}>
              <List.Icon icon={item.icon} />
              <Text style={styles.menuText}>{item.title}</Text>
              <List.Icon icon="chevron-right" />
            </View>
          </TouchableRipple>
        ))}

        <Divider style={{ marginVertical: 20 }} />

        {/* Logout */}
        <TouchableRipple onPress={handleLogout} rippleColor="rgba(255,0,0,0.1)">
          <View style={styles.menuItem}>
            <List.Icon color={theme.colors.error} icon="logout" />
            <Text style={[styles.menuText, { color: theme.colors.error }]}>
              Logout
            </Text>
          </View>
        </TouchableRipple>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    marginTop: 50,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#fff",
    marginBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  avatarWrapper: {
    marginBottom: 15,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    marginTop: 6,
  },
  menuSection: {
    paddingHorizontal: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
  runningTag: {
    color: "green",
    fontWeight: "bold",
  },
});


