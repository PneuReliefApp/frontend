import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import {
  Card,
  Button,
  useTheme,
  Divider,
  List,
  Avatar,
  DataTable,
} from "react-native-paper";
import TherapyCycleGraph from "../components/TherapyCycleGraph";

// Define the color palette based on the project theme
const COLORS = {
  primaryDarkBlue: "#0F3057",
  accentOrange: "#F37021",
  lightBlueBg: "#E6F0FF",
  mediumBlueAccent: "#80BFFF",
  iconBg: "#D0E6FF",
  white: "#FFFFFF",
  textGray: "#333333",
};

const ReportsScreen: React.FC = () => {
  const theme = useTheme();

  // Sample data for existing sections
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

  // New Placeholder Data for Pneumatic Activity Table
  const pneumaticActivityData = [
    {
      zone: "Posterior toe",
      inflated: "10:15",
      sustained: "10:20",
      deflated: "10:25",
    },
    {
      zone: "Heel pad",
      inflated: "10:16",
      sustained: "10:21",
      deflated: "10:26",
    },
    {
      zone: "Medial malleolus",
      inflated: "10:17",
      sustained: "10:22",
      deflated: "10:27",
    },
    {
      zone: "First metatarsal",
      inflated: "10:18",
      sustained: "10:23",
      deflated: "10:28",
    },
    {
      zone: "Lateral malleolus",
      inflated: "10:19",
      sustained: "10:24",
      deflated: "10:29",
    },
  ];

  // Helper component for a single pressure card
  const PressureCard = ({ title, value, icon }: { title: string; value: string; icon: string }) => (
    <Card style={styles.pressureCard}>
      <Card.Content style={styles.pressureCardContent}>
        <View style={styles.cardHeader}>
          {/* Fixed font size, no wrapping restrictions needed due to full width */}
          <Text style={styles.cardTitle}>{title}</Text>
          <Avatar.Icon
            size={32}
            icon={icon}
            style={{ backgroundColor: COLORS.iconBg, marginLeft: 8 }}
            color={COLORS.primaryDarkBlue}
          />
        </View>
        <View style={styles.cardValueContainer}>
          <Text style={styles.cardValueText}>{value}</Text>
          <Text style={styles.cardUnitText}>kPa</Text>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* ========== Pressure Readings Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pressure Readings</Text>
            <Divider style={styles.divider} />

            <View style={styles.pressureCardContainer}>
              <PressureCard title="Average Pressure" value="97" icon="chart-timeline-variant" />
              <PressureCard title="Lowest" value="78" icon="alert-circle-outline" />
              <PressureCard title="Peak" value="125" icon="clock-time-four-outline" />
            </View>
          </Card.Content>
        </Card>

        {/* ========== High Pressure Events Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>High Pressure Events</Text>
            <Divider style={styles.divider} />

            <View
              style={{
                backgroundColor: COLORS.accentOrange,
                borderRadius: 10,
                padding: 16,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "bold",
                  color: COLORS.white,
                }}
              >
                Time in High Pressure
              </Text>
              <Text style={{ fontSize: 16, color: COLORS.white }}>
                15min 30s
              </Text>
            </View>

            <List.Section>
              <List.Accordion
                title={`High Events Count: ${highPressureEvents.length}`}
                titleStyle={{ color: COLORS.primaryDarkBlue, fontWeight: "600" }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="alert-circle-outline"
                    color={COLORS.primaryDarkBlue}
                  />
                )}
                style={{ backgroundColor: COLORS.lightBlueBg }}
              >
                {highPressureEvents.map((event) => (
                  <View key={event.id} style={styles.eventItem}>
                    <Text style={styles.eventText}>
                      <Text style={{ fontWeight: "600" }}>Position:</Text>{" "}
                      {event.position}
                    </Text>
                    <Text style={styles.eventText}>
                      Start: {event.start.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.eventText}>
                      End: {event.end.toLocaleTimeString()}
                    </Text>
                    <Text style={styles.eventText}>
                      Duration: {event.duration}
                    </Text>
                    <Divider style={styles.divider} />
                  </View>
                ))}
              </List.Accordion>
            </List.Section>
          </Card.Content>
        </Card>

        {/* ========== Therapy Cycle Graph Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Therapy Cycle Timeline</Text>
            <Divider style={styles.divider} />
            <TherapyCycleGraph />
          </Card.Content>
        </Card>

        {/* ========== Pneumatic Activity Table Section ========== */}
        <Card style={styles.sectionCard}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Pneumatic Activity</Text>
            <Divider style={styles.divider} />

            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{ flex: 2 }}>
                  <Text style={styles.tableHeader}>Zone</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>
                  <Text style={styles.tableHeader}>Inflated</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>
                  <Text style={styles.tableHeader}>Sustained</Text>
                </DataTable.Title>
                <DataTable.Title style={styles.centerColumn}>
                  <Text style={styles.tableHeader}>Deflated</Text>
                </DataTable.Title>
              </DataTable.Header>

              {pneumaticActivityData.map((item, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell style={{ flex: 2 }}>
                    <Text
                      style={{
                        fontWeight: "600",
                        color: COLORS.primaryDarkBlue,
                      }}
                    >
                      {item.zone}
                    </Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>
                    <Text style={styles.tableCell}>{item.inflated}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>
                    <Text style={styles.tableCell}>{item.sustained}</Text>
                  </DataTable.Cell>
                  <DataTable.Cell style={styles.centerColumn}>
                    <Text style={styles.tableCell}>{item.deflated}</Text>
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </Card.Content>
        </Card>

        {/* ========== PDF Download Buttons ========== */}
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            icon="file-download-outline"
            style={styles.pdfButton}
            contentStyle={{ justifyContent: "flex-start", paddingLeft: 10 }}
            buttonColor={COLORS.primaryDarkBlue}
            onPress={() => console.log("Download Pressure PDF")}
          >
            Download PDF — Pressure Readings
          </Button>

          <Button
            mode="contained"
            icon="file-download-outline"
            style={styles.pdfButton}
            contentStyle={{ justifyContent: "flex-start", paddingLeft: 10 }}
            buttonColor={COLORS.primaryDarkBlue}
            onPress={() => console.log("Download Pneumatic PDF")}
          >
            Download PDF — Pneumatic Readings
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightBlueBg,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10,
    textAlign: "center",
    color: COLORS.primaryDarkBlue,
  },
  sectionCard: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primaryDarkBlue,
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.primaryDarkBlue,
  },
  divider: {
    marginVertical: 8,
    backgroundColor: COLORS.mediumBlueAccent,
    height: 1,
    opacity: 0.5,
  },
  // --- UPDATED Vertical Layout for Pressure Cards ---
  pressureCardContainer: {
    flexDirection: "column", // Stacked one above another
    gap: 12, // Space between stacked cards
    marginTop: 8,
  },
  pressureCard: {
    width: "100%", // Full width of the container
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 1,
    shadowColor: COLORS.primaryDarkBlue,
    shadowOpacity: 0.05,
    shadowRadius: 2,
    borderWidth: 0.5,
    borderColor: COLORS.mediumBlueAccent,
  },
  pressureCardContent: {
    padding: 16,
    // Using Row here allows Title/Icon on left, Value on right (optional)
    // BUT keeping your preferred block layout:
    flexDirection: 'row', // Let's line them up: Title Left, Value Right?
    // Actually, sticking to the "Box" look you had but wider is safer for consistence
    // Let's keep the internal structure simple:
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardTitle: {
    fontSize: 16, // FIXED SIZE: Same for all
    fontWeight: "500",
    color: COLORS.primaryDarkBlue,
    marginRight: 8,
  },
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardValueText: {
    fontSize: 32, // FIXED SIZE: Same for all
    fontWeight: "700",
    color: COLORS.primaryDarkBlue,
  },
  cardUnitText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primaryDarkBlue,
    marginLeft: 4,
  },
  // --- End Pressure Card Styles ---
  eventItem: {
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  eventText: {
    fontSize: 14,
    color: COLORS.textGray,
    marginBottom: 4,
  },
  centerColumn: {
    flex: 1,
    justifyContent: "center",
  },
  tableHeader: {
    color: COLORS.primaryDarkBlue,
    fontWeight: "600",
  },
  tableCell: {
    color: COLORS.textGray,
  },
  buttonContainer: {
    marginTop: 10,
    gap: 12,
  },
  pdfButton: {
    borderRadius: 8,
    paddingVertical: 4,
    width: "100%",
  },
});