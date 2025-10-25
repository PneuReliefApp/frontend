import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryClipContainer
} from "victory-native";
type Point = { x: number; y: number };
const LivePressureGraph = () => {
  const [data, setData] = useState<{
    side: Point[];
    heel: Point[];
    leftAnkle: Point[];
    rightAnkle: Point[];
  }>({
    side: [{ x: 1, y: 50 }], // ← ADD INITIAL DATA POINTS
    heel: [{ x: 0, y: 50 }],
    leftAnkle: [{ x: 0, y: 50 }],
    rightAnkle: [{ x: 0, y: 50 }],
  });

  const [dataB, setDataB] = useState<{
    side: Point[];
    heel: Point[];
  }>({
    side: [
      { x: 1, y: 2 },
      { x: 2, y: 3 },
      { x: 3, y: 5 },
      { x: 4, y: 4 },
      { x: 5, y: 7 },
      { x: 6, y: 5 },
      { x: 7, y: 6 },
      { x: 8, y: 3 },
      { x: 9, y: 4 },
      { x: 10, y: 2 },
    ], // ← ADD INITIAL DATA POINTS
    heel: [
      { x: 1, y: 6 },
      { x: 2, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 2 },
      { x: 5, y: 5 },
      { x: 6, y: 5 },
      { x: 7, y: 4 },
      { x: 8, y: 3 },
      { x: 9, y: 5 },
      { x: 10, y: 6 },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataB((prevData) => {
        const shiftedSide = prevData.side.map((p) => ({
          ...p,
          x: p.x - 1,
        }));
        const shiftedHeel = prevData.heel.map((p) => ({
          ...p,
          x: p.x - 1,
        }));
        const newSidePoint = { x: 10, y: Math.floor(Math.random() * 10) + 1 };
        const newHeelPoint = { x: 10, y: Math.floor(Math.random() * 10) + 1 };

        return {
          side: [...shiftedSide.slice(1), newSidePoint],
          heel: [...shiftedHeel.slice(1), newHeelPoint],
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <VictoryChart
  theme={VictoryTheme.material}
  domain={{ y: [0, 20] }}
  domainPadding={{ y: 10 }}
  padding={{ left: 50, right: 20, top: 40, bottom: 40 }}
>
  <VictoryLegend
    x={80} y={0} orientation="horizontal" gutter={20}
    style={{
      labels: { fill: "black", fontSize: 12, fontWeight: "bold" },
    }}
    data={[
      { name: "Side", symbol: { fill: "#4f46e5" } },
      { name: "Heel", symbol: { fill: "tomato" } },
    ]}
  />

  <VictoryLine
    data={dataB.side}
    interpolation="monotoneX"
    style={{ data: { stroke: "#4f46e5", strokeWidth: 2 } }}
    groupComponent={
      <VictoryClipContainer clipPadding={{ top: 5, right: 10 }} />
    }
  />

  <VictoryLine
    data={dataB.heel}
    interpolation="monotoneX"
    style={{ data: { stroke: "tomato", strokeWidth: 2 } }}
    groupComponent={
      <VictoryClipContainer clipPadding={{ top: 5, right: 10 }} />
    }
  />
</VictoryChart>

    </View>
  );
};

export default LivePressureGraph;
