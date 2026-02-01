import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";

interface Props {
  data: number[];
  maxPoints?: number;
}

const PressureGraph: React.FC<Props> = ({ data, maxPoints = 50 }) => {
  const screenWidth = Dimensions.get("window").width - 40; // padding
  const graphHeight = 200;

  // Take last maxPoints readings
  const placeholder: number[] = Array.from({ length: 30 }, () =>
      Math.floor(Math.random() * 100)
    );
  //data = placeholder;
  const displayData = data.slice(-maxPoints);

  const maxValue = Math.max(...displayData, 100); // avoid div by 0
  const minValue = Math.min(...displayData, 0);

  return (
    <View style={[styles.container, { height: graphHeight }]}>
      {displayData.map((value, index) => {
        // Normalize to graph height
        const heightPercent = ((value - minValue) / (maxValue - minValue)) * 100;
        return (
          <View
            key={index}
            style={{
              position: "absolute",
              bottom: 0,
              left: (index / displayData.length) * screenWidth,
              width: screenWidth / displayData.length - 2,
              height: (heightPercent / 100) * graphHeight,
              backgroundColor: "tomato",
              borderRadius: 2,
            }}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: "#eee",
    borderRadius: 8,
    overflow: "hidden",
  },
});

export default PressureGraph;
