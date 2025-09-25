import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { checkConnection } from "../services/api";

export default function HistoryScreen() {

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        History Screen
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
