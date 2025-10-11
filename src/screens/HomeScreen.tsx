import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import {
  Text,
  Switch,
  Menu,
  Button,
  Divider,
  Card,
  Avatar,
  useTheme,
} from "react-native-paper";
import Slider from "@react-native-community/slider";
import { checkConnection } from "../services/api";

const HomeScreen: React.FC = () => {
  const theme = useTheme();

  // States
  const [sliderValue, setSliderValue] = useState(50);
  const [toggleOn, setToggleOn] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState("Option 1");
  const [connected, setConnected] = useState<boolean | null>(null);

  // Backend check
  useEffect(() => {
    const testConnection = async () => {
      const ok = await checkConnection();
      setConnected(ok);
    };
    testConnection();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <Card style={styles.welcomeCard} elevation={4}>
        <ImageBackground
          source={{
            uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIpm4TIKo77tuSmYWg2jZcdEtjQOIsp3HMoQ&s",
          }}
          style={styles.welcomeBackground}
          imageStyle={{ borderRadius: 12 }}
        >
          <View style={styles.welcomeContent}>
            <Avatar.Image
              size={80}
              source={{ uri: "https://img.freepik.com/free-vector/fashionable-avatar-girl_24877-81624.jpg?semt=ais_hybrid&w=740&q=80" }}
            />
            <View style={styles.welcomeTextContainer}>
              <Text variant="headlineSmall" style={styles.welcomeText}>
                Welcome, Melanie!
              </Text>
              <Text variant="bodyMedium" style={styles.subText}>
                How’s it going today?
              </Text>
            </View>
          </View>
        </ImageBackground>
      </Card>

      <Card style={styles.sectionCard} elevation={2}>
        <Card.Content>
          <Text style={{ marginTop: 4 }}>
            Dashboard Section
          </Text>
        </Card.Content>
      </Card>

      {/* Backend Status */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Backend Status
          </Text>
          <Text style={{ marginTop: 4 }}>
            {connected === null
              ? "Checking..."
              : connected
              ? "✅ Connected"
              : "❌ Not Connected"}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Your Device" />
        <Card.Content style={styles.toggleRow}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Enable Feature
          </Text>
          <Switch value={toggleOn} onValueChange={setToggleOn} />
        </Card.Content>
      </Card>

      {/* Slider Section */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Calibration" />
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Adjust Value
          </Text>
          <Slider
            value={sliderValue}
            onValueChange={setSliderValue}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={{ marginVertical: 12 }}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#ccc"
          />
          <Text>Value: {sliderValue}</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setMenuVisible(true)}
                style={{ width: "100%" }}
              >
                {selectedOption}
              </Button>
            }
          >
            {["Option 1", "Option 2", "Option 3"].map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  setSelectedOption(option);
                  setMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f7",
    padding: 12,
    marginTop: 70,
  },
  welcomeCard: {
    marginBottom: 20,
    borderRadius: 12,
  },
  welcomeBackground: {
    height: 140,
    justifyContent: "center",
    padding: 16,
  },
  welcomeContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  welcomeTextContainer: {
    marginLeft: 12,
  },
  welcomeText: {
    color: "white",
    fontWeight: "bold",
  },
  subText: {
    color: "white",
    marginTop: 4,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default HomeScreen;
