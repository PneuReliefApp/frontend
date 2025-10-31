import React, { useState, useEffect, useRef } from "react";
import { View } from "react-native";
import { Text, Card } from 'react-native-paper';
import {
  VictoryChart,
  VictoryLine,
  VictoryTheme,
  VictoryLegend,
  VictoryClipContainer,
  VictoryContainer,
} from "victory-native";
type Point = { x: number; y: number };

const legendData = [
  { name: "Heel", color: "tomato" },
  { name: "Left Ankle", color: "green" },
  { name: "Right Ankle", color: "blue" },
];

const LivePressureGraph = () => {

  const [dataB, setDataB] = useState<{
    heel: Point[];
    leftAnkle: Point[];
    rightAnkle: Point[];
  }>({
    heel: [
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
    leftAnkle: [
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
    rightAnkle: [
      { x: 1, y: 3 },
      { x: 2, y: 4 },
      { x: 3, y: 7 },
      { x: 4, y: 8 },
      { x: 5, y: 4 },
      { x: 6, y: 2 },
      { x: 7, y: 6 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y:1 },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataB((prevData) => {
        const shiftedHeel = prevData.heel.map((p) => ({
          ...p,
          x: p.x - 1,
        }));
        const shiftedLeftAnkle = prevData.leftAnkle.map((p) => ({
          ...p,
          x: p.x - 1,
        }));
        const shiftedRightAnkle = prevData.rightAnkle.map((p) => ({
          ...p,
          x: p.x - 1,
        }));
        const newHeelPoint = { x: 10, y: Math.floor(Math.random() * 10) + 1 };
        const newLeftAnklePoint = { x: 10, y: Math.floor(Math.random() * 10) + 1 };
        const newRightAnklePoint = { x: 10, y: Math.floor(Math.random() * 10) + 1 };

        return {
          heel: [...shiftedHeel.slice(1), newHeelPoint],
          leftAnkle: [...shiftedLeftAnkle.slice(1), newLeftAnklePoint],
          rightAnkle: [...shiftedRightAnkle.slice(1), newRightAnklePoint],
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <View style={{ 
        flexDirection: "row", 
        justifyContent: "center", 
        alignItems: "center",

      }}>
        
        
        {legendData.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginHorizontal: 12,
              marginVertical: 4,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 8,
            }}
          >
            <View
              style={{
                width: 10,
                height:10,
                backgroundColor: item.color,
                marginRight: 6,
                borderRadius: 5,
              }}
            />
            <Text variant="bodySmall" style={{ textTransform: "capitalize" }}>
              {item.name}
            </Text>
          </View>
        ))}
      </View>
      
      <VictoryChart
        theme={VictoryTheme.material}
        domain={{ y: [0, 50] }}
        domainPadding={{ y: 10 }}
        padding={{ left: 40, right: 20, bottom: 40 }}
      >
        <VictoryLine
          data={dataB.heel}
          interpolation="monotoneX"
          style={{ data: { stroke: "tomato", strokeWidth: 2 } }}
          groupComponent={
            <VictoryClipContainer clipPadding={{ top: 5, right: 10 }} />
          }
        />

        <VictoryLine
          data={dataB.leftAnkle}
          interpolation="monotoneX"
          style={{ data: { stroke: "green", strokeWidth: 2 } }}
          groupComponent={
            <VictoryClipContainer clipPadding={{ top: 5, right: 10 }} />
          }
        />
        <VictoryLine
          data={dataB.rightAnkle}
          interpolation="monotoneX"
          style={{ data: { stroke: "blue", strokeWidth: 2 } }}
          groupComponent={
            <VictoryClipContainer clipPadding={{ top: 5, right: 10 }} />
          }
        />
      </VictoryChart>
    </View>
  );
};

export default LivePressureGraph;
