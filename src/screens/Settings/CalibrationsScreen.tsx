import * as React from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  Text,
  Card,
  Switch,
  Menu,
  Button,
  useTheme,
  Divider,
} from "react-native-paper";
import Slider from "@react-native-community/slider";

const CalibrationsScreen: React.FC = () => {
  const theme = useTheme();

  // ---------------------------
  // Pressure sensor calibration
  // ---------------------------
  const [pressureEnabled, setPressureEnabled] = React.useState(false);
  const [pressureValue, setPressureValue] = React.useState(50);
  const [pressureMenuVisible, setPressureMenuVisible] = React.useState(false);
  const [pressurePreset, setPressurePreset] = React.useState("Default");

  // ---------------------------
  // Air pressure sensor calibration
  // ---------------------------
  const [airEnabled, setAirEnabled] = React.useState(false);
  const [airValue, setAirValue] = React.useState(50);
  const [airMenuVisible, setAirMenuVisible] = React.useState(false);
  const [airPreset, setAirPreset] = React.useState("Default");

  // Dummy actions (replace later)
  const runPressureCalibration = () => {
    // TODO: hook to device/backend
    console.log("Run Pressure Sensor Calibration");
  };

  const savePressureCalibration = () => {
    // TODO: persist to backend/supabase
    console.log("Save Pressure Sensor Calibration", {
      enabled: pressureEnabled,
      value: pressureValue,
      preset: pressurePreset,
    });
  };

  const runAirCalibration = () => {
    // TODO: hook to device/backend
    console.log("Run Air Pressure Sensor Calibration");
  };

  const saveAirCalibration = () => {
    // TODO: persist to backend/supabase
    console.log("Save Air Pressure Sensor Calibration", {
      enabled: airEnabled,
      value: airValue,
      preset: airPreset,
    });
  };

  const PRESETS = ["Default", "Preset 1", "Preset 2", "Preset 3"];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ padding: 16 }}>
      {/* ---------------------------
          Pressure Sensor Calibration
         --------------------------- */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Pressure Sensor Calibration" />
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Enable Calibration
          </Text>

          <Divider style={{ marginVertical: 10 }} />

          <Text style={{ marginBottom: 6 }}>Calibration Mode</Text>
          <Switch value={pressureEnabled} onValueChange={setPressureEnabled} />

          <Divider style={{ marginVertical: 12 }} />

          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Adjust Value
          </Text>
          <Slider
            value={pressureValue}
            onValueChange={setPressureValue}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={{ marginVertical: 12 }}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#ccc"
            disabled={!pressureEnabled}
          />
          <Text>Value: {pressureValue}</Text>

          <Menu
            visible={pressureMenuVisible}
            onDismiss={() => setPressureMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setPressureMenuVisible(true)}
                style={{ width: "100%", marginTop: 12 }}
                disabled={!pressureEnabled}
              >
                {pressurePreset}
              </Button>
            }
          >
            {PRESETS.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  setPressurePreset(option);
                  setPressureMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            style={{ marginTop: 14 }}
            onPress={runPressureCalibration}
            disabled={!pressureEnabled}
          >
            Run Calibration
          </Button>

          <Button
            mode="outlined"
            style={{ marginTop: 10 }}
            onPress={savePressureCalibration}
            disabled={!pressureEnabled}
          >
            Save
          </Button>
        </Card.Content>
      </Card>

      {/* ---------------------------
          Air Pressure Sensor Calibration
         --------------------------- */}
      <Card style={styles.sectionCard} elevation={2}>
        <Card.Title title="Air Pressure Sensor Calibration" />
        <Card.Content>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Enable Calibration
          </Text>

          <Divider style={{ marginVertical: 10 }} />

          <Text style={{ marginBottom: 6 }}>Calibration Mode</Text>
          <Switch value={airEnabled} onValueChange={setAirEnabled} />

          <Divider style={{ marginVertical: 12 }} />

          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Adjust Value
          </Text>
          <Slider
            value={airValue}
            onValueChange={setAirValue}
            minimumValue={0}
            maximumValue={100}
            step={1}
            style={{ marginVertical: 12 }}
            minimumTrackTintColor={theme.colors.primary}
            maximumTrackTintColor="#ccc"
            disabled={!airEnabled}
          />
          <Text>Value: {airValue}</Text>

          <Menu
            visible={airMenuVisible}
            onDismiss={() => setAirMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setAirMenuVisible(true)}
                style={{ width: "100%", marginTop: 12 }}
                disabled={!airEnabled}
              >
                {airPreset}
              </Button>
            }
          >
            {PRESETS.map((option) => (
              <Menu.Item
                key={option}
                onPress={() => {
                  setAirPreset(option);
                  setAirMenuVisible(false);
                }}
                title={option}
              />
            ))}
          </Menu>

          <Button
            mode="contained"
            style={{ marginTop: 14 }}
            onPress={runAirCalibration}
            disabled={!airEnabled}
          >
            Run Calibration
          </Button>

          <Button
            mode="outlined"
            style={{ marginTop: 10 }}
            onPress={saveAirCalibration}
            disabled={!airEnabled}
          >
            Save
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

export default CalibrationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f6f6",
  },
  sectionCard: {
    marginBottom: 16,
  },
});
 
