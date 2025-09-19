import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { checkConnection } from "../services/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      const ok = await checkConnection();
      setConnected(ok);
    };
    testConnection();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        Backend status:{" "}
        {connected === null
          ? "Checking..."
          : connected
          ? "✅ Connected"
          : "❌ Not Connected"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
  },
});
