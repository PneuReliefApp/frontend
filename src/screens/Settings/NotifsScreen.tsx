import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { SegmentedButtons, Card, Title, Paragraph, useTheme, Text } from "react-native-paper";

const NotifsScreen: React.FC = () => {
  const theme = useTheme();
  const [tab, setTab] = React.useState<"alerts" | "logs">("alerts");

  // Sample data
  const alerts = [
    { id: 1, title: "Low Battery", description: "Your device battery is below 20%" },
    { id: 2, title: "Update Available", description: "A new firmware update is ready to install" },
  ];

  const logs = [
    { id: 1, title: "Device Started", description: "Device was powered on at 8:00 AM" },
    { id: 2, title: "Sync Completed", description: "Data sync completed successfully at 9:15 AM" },
  ];

  const renderCards = (items: { id: number; title: string; description: string }[]) => {
    return items.map((item) => (
      <Card key={item.id} style={styles.card}>
        <Card.Content>
          <Title>{item.title}</Title>
          <Paragraph>{item.description}</Paragraph>
        </Card.Content>
      </Card>
    ));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.segmentedContainer}>
        <SegmentedButtons
          value={tab}
          onValueChange={setTab}
          buttons={[
            { value: "alerts", label: "Alerts" },
            { value: "logs", label: "Logs" },
          ]}
        />
      </View>

      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {tab === "alerts" && renderCards(alerts)}
        {tab === "logs" && renderCards(logs)}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotifsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  segmentedContainer: {
    margin: 16,
    marginBottom: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginVertical: 12,
    textAlign: "center",
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2, // adds subtle shadow on Android
    borderRadius: 10,
  },
});
