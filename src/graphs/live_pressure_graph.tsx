import React, { useState, useEffect } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Text } from 'react-native-paper';

type Point = { x: number; y: number };

const legendData = [
  { name: "Heel", color: "tomato" },
  { name: "Left Ankle", color: "green" },
  { name: "Right Ankle", color: "blue" },
];

const CHART_WIDTH = Dimensions.get('window').width - 60;
const CHART_HEIGHT = 150;
const MAX_Y = 50;

const LivePressureGraph = () => {
  const [dataB, setDataB] = useState<{
    heel: Point[];
    leftAnkle: Point[];
    rightAnkle: Point[];
  }>({
    heel: [
      { x: 1, y: 2 }, { x: 2, y: 3 }, { x: 3, y: 5 }, { x: 4, y: 4 }, { x: 5, y: 7 },
      { x: 6, y: 5 }, { x: 7, y: 6 }, { x: 8, y: 3 }, { x: 9, y: 4 }, { x: 10, y: 2 },
    ],
    leftAnkle: [
      { x: 1, y: 6 }, { x: 2, y: 2 }, { x: 3, y: 1 }, { x: 4, y: 2 }, { x: 5, y: 5 },
      { x: 6, y: 5 }, { x: 7, y: 4 }, { x: 8, y: 3 }, { x: 9, y: 5 }, { x: 10, y: 6 },
    ],
    rightAnkle: [
      { x: 1, y: 3 }, { x: 2, y: 4 }, { x: 3, y: 7 }, { x: 4, y: 8 }, { x: 5, y: 4 },
      { x: 6, y: 2 }, { x: 7, y: 6 }, { x: 8, y: 5 }, { x: 9, y: 5 }, { x: 10, y: 1 },
    ],
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDataB((prevData) => {
        const shiftedHeel = prevData.heel.map((p) => ({ ...p, x: p.x - 1 }));
        const shiftedLeftAnkle = prevData.leftAnkle.map((p) => ({ ...p, x: p.x - 1 }));
        const shiftedRightAnkle = prevData.rightAnkle.map((p) => ({ ...p, x: p.x - 1 }));
        
        return {
          heel: [...shiftedHeel.slice(1), { x: 10, y: Math.floor(Math.random() * 10) + 1 }],
          leftAnkle: [...shiftedLeftAnkle.slice(1), { x: 10, y: Math.floor(Math.random() * 10) + 1 }],
          rightAnkle: [...shiftedRightAnkle.slice(1), { x: 10, y: Math.floor(Math.random() * 10) + 1 }],
        };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simple line renderer using absolute positioning
  const renderLine = (data: Point[], color: string) => {
    const points = data.map((point, index) => {
      const x = (index / (data.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - (point.y / MAX_Y) * CHART_HEIGHT;
      return { x, y };
    });

    return points.map((point, index) => (
      <View
        key={`${color}-${index}`}
        style={{
          position: 'absolute',
          left: point.x - 3,
          top: point.y - 3,
          width: 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: color,
        }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Legend */}
      <View style={styles.legendContainer}>
        {legendData.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text variant="bodySmall">{item.name}</Text>
          </View>
        ))}
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{MAX_Y}</Text>
          <Text style={styles.axisLabel}>{MAX_Y / 2}</Text>
          <Text style={styles.axisLabel}>0</Text>
        </View>

        {/* Chart area */}
        <View style={styles.chart}>
          {/* Grid lines */}
          <View style={[styles.gridLine, { top: 0 }]} />
          <View style={[styles.gridLine, { top: CHART_HEIGHT / 2 }]} />
          <View style={[styles.gridLine, { top: CHART_HEIGHT }]} />

          {/* Data lines */}
          {renderLine(dataB.heel, 'tomato')}
          {renderLine(dataB.leftAnkle, 'green')}
          {renderLine(dataB.rightAnkle, 'blue')}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  yAxis: {
    width: 30,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  chart: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#ddd',
  },
});

export default LivePressureGraph;
