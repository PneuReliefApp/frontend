import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  List,
  Avatar,
  Divider,
  useTheme,
  TouchableRipple,
  Text,
} from "react-native-paper";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type ProfilePageProps = NativeStackScreenProps<any, any>;

const SettingsScreen: React.FC<ProfilePageProps> = ({ navigation }) => {
  const theme = useTheme();

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
    {
      title: "Device Usage",
      icon: "tablet-dashboard",
      onPress: () => navigation.navigate("DeviceUsage"),
    },
    {
      title: "Accessibility",
      icon: "access-point",
      onPress: () => navigation.navigate("Accessibility"),
    },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarWrapper}>
          <Avatar.Image
            size={120}
            source={{
              uri: "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?semt=ais_hybrid&w=740&q=80",
            }}
          />
        </View>
        <Text style={styles.username}>Melanie Choi</Text>
        <Text style={styles.subtitle}>View Profile</Text>
      </View>

      {/* Menu Section */}
      <View style={styles.menuSection}>
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
        <TouchableRipple
          onPress={() => console.log("Logout pressed")}
          rippleColor="rgba(255,0,0,0.1)"
        >
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
    marginTop: 50
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
    marginTop: 4,
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
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 10,
  },
});
