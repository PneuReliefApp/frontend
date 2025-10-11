import * as React from "react";
import { ScrollView, StyleSheet, View, ImageBackground } from "react-native";
import { Text, Card, Avatar, Switch, Menu, Button, useTheme } from "react-native-paper";
import Slider from "@react-native-community/slider";
import { checkConnection } from "../../services/api";

const HomeScreen: React.FC = () => {
  const theme = useTheme();

  // States
  const [sliderValue, setSliderValue] = React.useState(50);
  const [toggleOn, setToggleOn] = React.useState(false);
  const [menuVisible, setMenuVisible] = React.useState(false);
  const [selectedOption, setSelectedOption] = React.useState("Option 1");
  

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* Welcome Section */}
      
      {/* Device Toggle */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Your Device" />
        <Card.Content style={styles.toggleRow}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Enable Feature
          </Text>
          <Switch value={toggleOn} onValueChange={setToggleOn} />
        </Card.Content>
      </Card>

      {/* Slider & Menu Section */}
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
                style={{ width: "100%", marginTop: 12 }}
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

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  sectionCard: {
    marginBottom: 16,
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
});
