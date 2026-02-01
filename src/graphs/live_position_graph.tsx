import React from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";

const positionData = [
  { position: "standing", duration: 5 },
  { position: "walking", duration: 3 },
  { position: "lying", duration: 7 },
  { position: "standing", duration: 4 },
  { position: "walking", duration: 6 },
  { position: "lying", duration: 10 },
  { position: "standing", duration: 15 },
];

const positionColors: Record<string, string> = {
  walking: "#4f46e5",
  standing: "#10b981",
  lying: "#f59e0b",
};

// Expand data to per-second segments
let expandedData: { second: number; position: string }[] = [];
let timeCounter = 0;
for (const segment of positionData) {
  for (let i = 0; i < segment.duration; i++) {
    expandedData.push({ second: timeCounter, position: segment.position });
    timeCounter++;
  }
}

const LivePositionGraph = () => {
  const screenWidth = Dimensions.get("window").width - 60;
  const graphHeight = 120;
  const totalSeconds = expandedData.length;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      {/* Legend */}
      <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 8 }}>
        {Object.entries(positionColors).map(([position, color]) => (
          <View
            key={position}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 8,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                backgroundColor: color,
                borderRadius: 5,
                marginRight: 4,
              }}
            />
            <Text variant="bodySmall" style={{ textTransform: "capitalize" }}>
              {position}
            </Text>
          </View>
        ))}
      </View>

      {/* Graph - horizontal bar segments */}
      <View
        style={{
          width: screenWidth,
          height: graphHeight,
          backgroundColor: "#f5f5f5",
          borderRadius: 8,
          overflow: "hidden",
          flexDirection: "row",
          alignItems: "flex-end",
        }}
      >
        {expandedData.map((item, index) => (
          <View
            key={index}
            style={{
              width: screenWidth / totalSeconds,
              height: graphHeight * 0.7,
              backgroundColor: positionColors[item.position],
              marginBottom: graphHeight * 0.15,
            }}
          />
        ))}
      </View>

      {/* X-axis labels */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", width: screenWidth, marginTop: 4 }}>
        <Text variant="labelSmall" style={{ color: "#666" }}>0s</Text>
        <Text variant="labelSmall" style={{ color: "#666" }}>Time (s)</Text>
        <Text variant="labelSmall" style={{ color: "#666" }}>{totalSeconds}s</Text>
      </View>
    </View>
  );
};

export default LivePositionGraph;
