import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { List, Avatar, Divider, useTheme } from "react-native-paper";

type ProfilePageProps = {
  onEditProfile?: () => void;
  onHistory?: () => void;
  onDeviceUsage?: () => void;
  onAccessibility?: () => void;
  onLogout?: () => void;
};

const SettingsScreen: React.FC<ProfilePageProps> = ({
  onEditProfile,
  onHistory,
  onDeviceUsage,
  onAccessibility,
  onLogout,
}) => {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <View style={styles.avatarContainer}>
        <Avatar.Image
          size={120}
          source={{
            uri: "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?semt=ais_hybrid&w=740&q=80", // replace with user profile pic
          }}
        />
      </View>

      {/* Username */}
      <List.Subheader style={styles.username}>Melanie Choi</List.Subheader>

      {/* Menu / Options */}
      <View style={styles.menuContainer}>
        <List.Item
          title="Edit Profile"
          left={(props) => <List.Icon {...props} icon="account-edit" />}
          onPress={onEditProfile}
        />
        <Divider />
        <List.Item
          title="History & Data"
          left={(props) => <List.Icon {...props} icon="history" />}
          onPress={onHistory}
        />
        <Divider />
        <List.Item
          title="Device Usage"
          left={(props) => <List.Icon {...props} icon="tablet-dashboard" />}
          onPress={onDeviceUsage}
        />
        <Divider />
        <List.Item
          title="Accessibility"
          left={(props) => <List.Icon {...props} icon="access-point" />}
          onPress={onAccessibility}
        />
        <Divider />
        <List.Item
          title="Logout"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={onLogout}
          titleStyle={{ color: theme.colors.error }}
        />
      </View>
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: 50,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  username: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    overflow: "hidden",
  },
});
