import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { Card, Button, Title, Paragraph, useTheme } from "react-native-paper";
import TherapyCycleGraph from "../components/TherapyCycleGraph";

const ReportsScreen: React.FC = () => {
  const theme = useTheme();

  // Sample data
  const pressureReadings = [
    { id: 1, title: "Average Pressure", value: "72 mmHg", color: "#4caf50" }, // green
    { id: 2, title: "Peak Pressure", value: "110 mmHg", color: "#f44336" }, // red
    { id: 3, title: "Lowest Pressure", value: "60 mmHg", color: "#2196f3" }, // blue
  ];

  const highPressureEvents = [
    {
      id: 1,
      position: "Heel",
      start: new Date("2025-10-31T10:00:00"),
      end: new Date("2025-10-31T10:05:00"),
      duration: "5m",
    },
    {
      id: 2,
      position: "Heel",
      start: new Date("2025-10-31T11:15:00"),
      end: new Date("2025-10-31T11:20:30"),
      duration: "5m 30s",
    },
    {
      id: 3,
      position: "Right Ankle",
      start: new Date("2025-10-31T12:45:00"),
      end: new Date("2025-10-31T12:50:00"),
      duration: "5m",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Button mode="outlined" style={styles.downloadButton}>
        Download
      </Button>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ========== Pressure Readings Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pressure Readings</Text>
            <Divider style={{ marginVertical: 8 }} />

            {/* Grid-style layout */}
            <View style={{ padding: 16 }}>
              {/* Avg Pressure on Top (Full Width) */}
              <View
                style={{
                  backgroundColor: "#f2f2f2",
                  borderRadius: 10,
                  padding: 16,
                  marginBottom: 10,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <Avatar.Icon
                    size={40}
                    icon="speedometer" // you can pick "speedometer", "gauge", etc.
                    style={{ backgroundColor: "#4caf50", marginRight: 12 }}
                  />
                  <View>
                    <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                      Avg Pressure
                    </Text>
                    <Text style={{ fontSize: 16 }}>120 kPa</Text>
                  </View>
                </View>
              </View>

              {/* Lowest + Peak in One Row (Each Half Width) */}
              <View style={{ flexDirection: "row", gap: 10 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "#e6f7ff",
                    borderRadius: 10,
                    padding: 16,
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <Avatar.Icon
                      size={32}
                      icon="arrow-down-bold-circle"
                      style={{ backgroundColor: "#2196f3", marginRight: 10 }}
                    />
                    <View>
                      <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                        Lowest
                      </Text>
                      <Text style={{ fontSize: 14 }}>80 kPa</Text>
                    </View>
                  </View>
                </View>

        {/* Section: High Pressure Events */}
        <Text style={styles.sectionTitle}>High Pressure Events</Text>
        <View style={styles.cardsContainer}>
          {renderCards(highPressureEvents)}
        </View>

        {/* Section: Therapy Cycle Graph */}
        <Text style={styles.sectionTitle}>Therapy Cycle Timeline</Text>
        <TherapyCycleGraph />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    textAlign: "center",
  },
  downloadButton: {
    width: "70%",
    alignSelf: "center",
    marginVertical: 10,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 3,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridCard: {
    width: "48%",
    marginVertical: 8,
    borderRadius: 10,
    borderTopWidth: 4,
    elevation: 2,
    backgroundColor: "#fff",
  },
  card: {
    marginBottom: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    color: "#444",
  },
  cardValue: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },
  eventItem: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  eventText: {
    fontSize: 14,
  },
});
