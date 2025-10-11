import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View, Text } from "react-native";
import { Card, Button, Title, Paragraph, useTheme } from "react-native-paper";

const PressureMapScreen: React.FC = () => {
  const theme = useTheme();

  // Sample data for demonstration
  const pressureReadings = [
    { id: 1, title: "Average Pressure", value: "72 mmHg", color: "#4caf50" }, // green
    { id: 2, title: "Peak Pressure", value: "110 mmHg", color: "#f44336" }, // red
    { id: 3, title: "Lowest Pressure", value: "60 mmHg", color: "#2196f3" }, // blue
  ];

  const highPressureEvents = [
    {
      id: 1,
      title: "Time in High Pressure",
      value: "1h 25m",
      color: "#ff9800",
    }, // orange
    { id: 2, title: "High Events Count", value: "3 Events", color: "#e91e63" }, // pink
  ];

  const renderCards = (
    items: { id: number; title: string; value: string; color: string }[]
  ) => {
    return items.map((item) => (
      <Card
        key={item.id}
        style={[
          styles.card,
          { borderLeftColor: item.color, borderLeftWidth: 6 },
        ]}
      >
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph
            style={{ fontSize: 18, fontWeight: "bold", color: item.color }}
          >
            {item.value}
          </Paragraph>
        </Card.Content>
      </Card>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Reports</Text>
      <Button mode="outlined" style={{ width: "70%", alignSelf:"center" }}>
        Download
      </Button>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Section: Pressure Readings */}
        <Text style={styles.sectionTitle}>Pressure Readings</Text>
        <View style={styles.cardsContainer}>
          {renderCards(pressureReadings)}
        </View>

        {/* Section: High Pressure Events */}
        <Text style={styles.sectionTitle}>High Pressure Events</Text>
        <View style={styles.cardsContainer}>
          {renderCards(highPressureEvents)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PressureMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
  },
  cardsContainer: {
    marginBottom: 20,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 8,
    paddingVertical: 6,
  },
});
