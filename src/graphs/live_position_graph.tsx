import React from "react";
import { View } from "react-native";
import { Text, Card } from "react-native-paper";
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
} from "victory-native";

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

let expandedData: { second: number; position: string }[] = [];
let timeCounter = 0;
for (const segment of positionData) {
  for (let i = 0; i < segment.duration; i++) {
    expandedData.push({ second: timeCounter, position: segment.position });
    timeCounter++;
  }
}

const LivePositionGraph = () => {
  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
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

      <View style={{ height: 180 }}>
        <VictoryChart
          theme={VictoryTheme.material}
          domainPadding={{ x: 5, y: 5 }}
          padding={{ top: 20, bottom: 40, left: 40, right: 20 }}
          height={180}
        >
          <VictoryBar
            data={expandedData}
            x="second"
            y={() => 1}
            style={{
              data: {
                fill: ({ datum }) => positionColors[datum.position],
                width: 6,
              },
            }}
          />
          <VictoryAxis
            label="Time (s)"
            tickValues={[0, 10, 20, 30, 40, 50]}
            style={{ axisLabel: { padding: 30 } }}
          />

        </VictoryChart>
      </View>
    </View>
  );
};

export default LivePositionGraph;
