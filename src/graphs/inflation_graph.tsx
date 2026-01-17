import React, { useState } from "react";
import { View, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryScatter,
  VictoryVoronoiContainer,
} from "victory-native";

// --- DATA ---
const inflationData = [
  { time: "00:00", pressure: 45 },
  { time: "04:00", pressure: 38 },
  { time: "08:00", pressure: 52 },
  { time: "12:00", pressure: 48 },
  { time: "16:00", pressure: 56 },
  { time: "20:00", pressure: 42 },
];

const Y_LABELS = [60, 45, 30, 15, 0];
const X_LABELS = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"];

const COLORS = {
  primaryBlue: "#0F3057",
  accentOrange: "#F37021",
  background: "#FFFFFF",
};

export default function InflationGraph() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // --- DIMENSIONS ---
  const screenWidth = Dimensions.get("window").width;
  const cardPadding = 16;
  const yAxisWidth = 30;

  // The usable width for the chart line
  const chartWidth = screenWidth - (cardPadding * 2) - yAxisWidth - 10;
  const chartHeight = 220;

  // Padding inside the Victory chart
  const padding = { top: 20, bottom: 20, left: 10, right: 20 };

  // --- MANUAL TOOLTIP CALCULATION ---
  const getTooltipPosition = () => {
    // If no active index, hide everything
    if (activeIndex === null || activeIndex === -1) {
      return { x: 0, y: 0, visible: false, value: 0 };
    }

    const dataPoint = inflationData[activeIndex];
    if (!dataPoint) return { x: 0, y: 0, visible: false, value: 0 };

    // Calculate grid dimensions
    const graphWidth = chartWidth - padding.left - padding.right;
    const graphHeight = chartHeight - padding.top - padding.bottom;

    // Calculate X position (0 to 100% of width)
    const x = padding.left + (activeIndex / (inflationData.length - 1)) * graphWidth;

    // Calculate Y position (Inverted because 0 is at bottom)
    const y = padding.top + graphHeight - ((dataPoint.pressure / 60) * graphHeight);

    return { x, y, visible: true, value: dataPoint.pressure };
  };

  const tooltip = getTooltipPosition();

  return (
    <View
      style={{
        backgroundColor: COLORS.background,
        borderRadius: 16,
        padding: cardPadding,
        marginBottom: 20,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        zIndex: 10,
        overflow: 'visible', // IMPORTANT: Allows popup to float outside bounds if needed
      }}
    >
      {/* Header */}
      <View style={{ marginBottom: 20 }}>
        <Text variant="titleMedium" style={{ color: COLORS.primaryBlue, fontWeight: "bold" }}>
          Inflation Cycles
        </Text>
        <Text variant="bodySmall" style={{ color: "#6B7280" }}>
          Last 24 hours
        </Text>
      </View>

      <View style={{ flexDirection: "row", height: chartHeight }}>
        {/* Y-Axis Labels */}
        <View style={{ width: yAxisWidth, justifyContent: "space-between", paddingVertical: 20, marginRight: 5 }}>
          {Y_LABELS.map((label) => (
            <Text key={label} style={{ fontSize: 10, color: "#6B7280", textAlign: "right", height: 14 }}>
              {label}
            </Text>
          ))}
        </View>

        {/* Chart Area */}
        <View style={{ flex: 1, position: 'relative' }}>

          {/* --- THE MANUAL POP-UP --- */}
          {/* This is a standard View. It sits ON TOP of the chart at the calculated X/Y */}
          {tooltip.visible && (
            <View
              pointerEvents="none"
              style={{
                position: "absolute",
                left: tooltip.x - 20, // Center bubble (width 40 / 2)
                top: tooltip.y - 45,  // Above the dot
                width: 40,
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <View style={{ backgroundColor: COLORS.primaryBlue, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 6 }}>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 12 }}>
                  {tooltip.value}
                </Text>
              </View>
              {/* Triangle Arrow */}
              <View style={{ width: 0, height: 0, borderLeftWidth: 5, borderRightWidth: 5, borderTopWidth: 5, borderStyle: 'solid', backgroundColor: 'transparent', borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: COLORS.primaryBlue }} />
            </View>
          )}

          <VictoryChart
            width={chartWidth}
            height={chartHeight}
            padding={padding}
            domainPadding={{ y: 20 }}
            containerComponent={
              <VictoryVoronoiContainer
                radius={40}
                onActivated={(points) => {
                  if (!points || points.length === 0) return;

                  // --- SAFE LOOKUP STRATEGY ---
                  // 1. Get the data point touched
                  const p = points[0];
                  // 2. Extract the pressure value (safe access)
                  // Victory puts original data in 'datum', but sometimes at root
                  const val = (p.datum && p.datum.pressure) || p.pressure;

                  if (val !== undefined) {
                    // 3. Find index by matching pressure value (safer than time strings)
                    const index = inflationData.findIndex(d => d.pressure === val);
                    if (index !== -1) setActiveIndex(index);
                  }
                }}
                onDeactivated={() => setActiveIndex(null)}
              />
            }
          >
            {/* Invisible Axes */}
            <VictoryAxis dependentAxis tickValues={Y_LABELS} style={{ axis: { stroke: "none" }, tickLabels: { fill: "none" }, grid: { stroke: "#E5E7EB", strokeDasharray: "5, 5" } }} />
            <VictoryAxis tickValues={X_LABELS} style={{ axis: { stroke: "#E5E7EB" }, tickLabels: { fill: "none" }, grid: { stroke: "none" } }} />

            <VictoryLine
              data={inflationData}
              x="time"
              y="pressure"
              interpolation="catmullRom"
              style={{ data: { stroke: COLORS.primaryBlue, strokeWidth: 3 } }}
            />

            {/* Active Dot (Controlled by our State) */}
            <VictoryScatter
              data={inflationData}
              x="time"
              y="pressure"
              size={({ datum }) => {
                 // Manually check if this dot matches our active index
                 const idx = inflationData.findIndex(d => d.time === datum.time);
                 return idx === activeIndex ? 6 : 4;
              }}
              style={{
                data: {
                  fill: ({ datum }) => {
                     const idx = inflationData.findIndex(d => d.time === datum.time);
                     return idx === activeIndex ? COLORS.accentOrange : COLORS.primaryBlue;
                  },
                  stroke: "white",
                  strokeWidth: 2,
                },
              }}
            />
          </VictoryChart>

          {/* X-Axis Labels */}
          <View style={{ position: 'absolute', bottom: 0, left: 10, right: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
            {X_LABELS.map((label) => (
              <Text key={label} style={{ fontSize: 10, color: "#6B7280" }}>{label}</Text>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
}