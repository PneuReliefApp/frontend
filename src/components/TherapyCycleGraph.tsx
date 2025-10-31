import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useTheme } from 'react-native-paper';

// Types for therapy cycle data
interface CyclePhase {
  type: 'inflate' | 'hold' | 'deflate' | 'rest';
  duration: number; // in seconds
  startTime: number;
}

interface ZoneData {
  zoneName: string;
  cycles: CyclePhase[];
}

interface ActivityPhase {
  activity: string;
  duration: number;
  startTime: number;
}

interface AlertMarker {
  time: number;
  label: string;
}

interface TherapyCycleGraphProps {
  zones?: ZoneData[];
  activities?: ActivityPhase[];
  alerts?: AlertMarker[];
  totalDuration?: number; // in seconds
}

const TherapyCycleGraph: React.FC<TherapyCycleGraphProps> = ({
  zones,
  activities,
  alerts,
  totalDuration = 600, // default 10 minutes
}) => {
  const theme = useTheme();
  const screenWidth = Dimensions.get('window').width;
  const graphWidth = Math.max(screenWidth - 120, 600); // Minimum 600px for scrolling
  const pixelsPerSecond = graphWidth / totalDuration;

  // Default mock data for 6 patches:
  // Purple Group (inflates together): Bottom of Foot (3 patches) + Back of Foot (1 patch)
  // Orange Group (inflates together): Right Ankle + Left Ankle
  // Groups alternate: when Purple inflates, Orange deflates, and vice versa
  const defaultZones: ZoneData[] = zones || [
    {
      zoneName: 'Bottom of Foot - Left',
      cycles: [
        { type: 'inflate', duration: 40, startTime: 0 },    // Purple inflates (fast - small volume)
        { type: 'hold', duration: 30, startTime: 40 },
        { type: 'deflate', duration: 20, startTime: 70 },
        { type: 'rest', duration: 30, startTime: 90 },
        { type: 'inflate', duration: 40, startTime: 180 },   // Purple inflates again
        { type: 'hold', duration: 30, startTime: 220 },
        { type: 'deflate', duration: 20, startTime: 250 },
        { type: 'rest', duration: 30, startTime: 270 },
        { type: 'inflate', duration: 40, startTime: 360 },
        { type: 'hold', duration: 30, startTime: 400 },
      ],
    },
    {
      zoneName: 'Bottom of Foot - Center',
      cycles: [
        { type: 'inflate', duration: 40, startTime: 0 },    // Purple inflates (fast - small volume)
        { type: 'hold', duration: 30, startTime: 40 },
        { type: 'deflate', duration: 20, startTime: 70 },
        { type: 'rest', duration: 30, startTime: 90 },
        { type: 'inflate', duration: 40, startTime: 180 },   // Purple inflates again
        { type: 'hold', duration: 30, startTime: 220 },
        { type: 'deflate', duration: 20, startTime: 250 },
        { type: 'rest', duration: 30, startTime: 270 },
        { type: 'inflate', duration: 40, startTime: 360 },
        { type: 'hold', duration: 30, startTime: 400 },
      ],
    },
    {
      zoneName: 'Bottom of Foot - Right',
      cycles: [
        { type: 'inflate', duration: 45, startTime: 0 },    // Purple inflates (fast - small volume)
        { type: 'hold', duration: 30, startTime: 45 },
        { type: 'deflate', duration: 20, startTime: 75 },
        { type: 'rest', duration: 25, startTime: 95 },
        { type: 'inflate', duration: 45, startTime: 180 },   // Purple inflates again
        { type: 'hold', duration: 30, startTime: 225 },
        { type: 'deflate', duration: 20, startTime: 255 },
        { type: 'rest', duration: 25, startTime: 275 },
        { type: 'inflate', duration: 45, startTime: 360 },
        { type: 'hold', duration: 30, startTime: 405 },
      ],
    },
    {
      zoneName: 'Back of Foot',
      cycles: [
        { type: 'inflate', duration: 60, startTime: 0 },    // Purple inflates (slower - larger volume)
        { type: 'hold', duration: 30, startTime: 60 },
        { type: 'deflate', duration: 20, startTime: 90 },
        { type: 'rest', duration: 10, startTime: 110 },
        { type: 'inflate', duration: 60, startTime: 180 },   // Purple inflates again
        { type: 'hold', duration: 30, startTime: 240 },
        { type: 'deflate', duration: 20, startTime: 270 },
        { type: 'rest', duration: 10, startTime: 290 },
        { type: 'inflate', duration: 60, startTime: 360 },
        { type: 'hold', duration: 30, startTime: 420 },
      ],
    },
    {
      zoneName: 'Right Ankle',
      cycles: [
        { type: 'deflate', duration: 30, startTime: 0 },    // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 30 },
        { type: 'inflate', duration: 50, startTime: 120 },   // Orange inflates
        { type: 'hold', duration: 30, startTime: 170 },
        { type: 'deflate', duration: 30, startTime: 180 },   // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 210 },
        { type: 'inflate', duration: 50, startTime: 300 },   // Orange inflates
        { type: 'hold', duration: 30, startTime: 350 },
        { type: 'deflate', duration: 30, startTime: 360 },   // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 390 },
      ],
    },
    {
      zoneName: 'Left Ankle',
      cycles: [
        { type: 'deflate', duration: 30, startTime: 0 },    // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 30 },
        { type: 'inflate', duration: 50, startTime: 120 },   // Orange inflates
        { type: 'hold', duration: 30, startTime: 170 },
        { type: 'deflate', duration: 30, startTime: 180 },   // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 210 },
        { type: 'inflate', duration: 50, startTime: 300 },   // Orange inflates
        { type: 'hold', duration: 30, startTime: 350 },
        { type: 'deflate', duration: 30, startTime: 360 },   // Orange deflates while Purple inflates
        { type: 'rest', duration: 30, startTime: 390 },
      ],
    },
  ];

  const defaultActivities: ActivityPhase[] = activities || [
    { activity: 'Sitting/Lying', duration: 180, startTime: 0 },
    { activity: 'Standing', duration: 150, startTime: 180 },
    { activity: 'Walking', duration: 120, startTime: 330 },
    { activity: 'Standing', duration: 90, startTime: 450 },
    { activity: 'Sitting/Lying', duration: 60, startTime: 540 },
  ];

  const defaultAlerts: AlertMarker[] = alerts || [
    { time: 120, label: 'Alert' },
    { time: 350, label: 'Alert' },
    { time: 520, label: 'Alert' },
  ];

  // Color mapping for cycle phases
  const getPhaseColor = (type: CyclePhase['type']) => {
    switch (type) {
      case 'inflate':
        return '#FFD54F'; // Yellow
      case 'hold':
        return '#FFB74D'; // Orange
      case 'deflate':
        return '#FFA726'; // Darker Orange
      case 'rest':
        return '#FFCC80'; // Light Orange
      default:
        return '#E0E0E0';
    }
  };

  const renderZoneRow = (zoneData: ZoneData, index: number) => {
    return (
      <View key={index} style={styles.zoneRow}>
        <View style={[styles.zoneTimeline, { width: graphWidth }]}>
          {zoneData.cycles.map((phase, phaseIndex) => {
            const width = phase.duration * pixelsPerSecond;
            const left = phase.startTime * pixelsPerSecond;
            
            // Use abbreviated text for narrow blocks (less than 40px wide)
            const getPhaseLabel = () => {
              const fullText = phase.type.charAt(0).toUpperCase() + phase.type.slice(1);
              if (width < 40) {
                // Show first letter only for very narrow blocks
                return fullText.charAt(0);
              } else if (width < 55) {
                // Show abbreviated text for narrow blocks
                const abbreviations: { [key: string]: string } = {
                  'Inflate': 'Infl',
                  'Deflate': 'Defl',
                };
                return abbreviations[fullText] || fullText;
              }
              return fullText;
            };
            
            return (
              <View
                key={phaseIndex}
                style={[
                  styles.phaseBlock,
                  {
                    backgroundColor: getPhaseColor(phase.type),
                    width,
                    left,
                  },
                ]}
              >
                <Text style={styles.phaseText} numberOfLines={1}>
                  {getPhaseLabel()}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderActivityRow = () => {
    return (
      <View style={styles.zoneRow}>
        <View style={[styles.zoneTimeline, { width: graphWidth }]}>
          {defaultActivities.map((activity, index) => {
            const width = activity.duration * pixelsPerSecond;
            const left = activity.startTime * pixelsPerSecond;
            return (
              <View
                key={index}
                style={[
                  styles.activityBlock,
                  {
                    width,
                    left,
                  },
                ]}
              >
                <Text style={styles.activityText} numberOfLines={1}>{activity.activity}</Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderAlerts = () => {
    return defaultAlerts.map((alert, index) => {
      const left = alert.time * pixelsPerSecond;
      return (
        <View
          key={index}
          style={[styles.alertMarker, { left }]}
        >
          <View style={styles.alertArrow} />
          <Text style={styles.alertLabel}>{alert.label}</Text>
        </View>
      );
    });
  };

  const renderTimeAxis = () => {
    const timeMarkers = [];
    const interval = 100; // Every 100 seconds
    for (let i = 0; i <= totalDuration; i += interval) {
      const left = i * pixelsPerSecond;
      timeMarkers.push(
        <View key={i} style={[styles.timeMarker, { left }]}>
          <Text style={styles.timeText}>{i}</Text>
        </View>
      );
    }
    return timeMarkers;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Therapy Cycle Graph</Text>
      <Text style={styles.subtitle}>(Conceptual Layout)</Text>
      
      {/* Y-axis label */}
      <View style={styles.axisLabelsContainer}>
        <View style={styles.yAxisLabelContainer}>
          <Text style={styles.axisTitle}>Zones</Text>
        </View>
      </View>

      <View style={styles.graphWrapper}>
        {/* Y-axis with zone labels */}
        <View style={styles.yAxis}>
          <View style={styles.yAxisSpacer} />
          {defaultZones.map((zone, index) => (
            <View key={index} style={styles.yAxisLabel}>
              <Text style={styles.yAxisText}>{zone.zoneName}</Text>
            </View>
          ))}
          <View style={styles.yAxisLabel}>
            <Text style={styles.yAxisText}>Activity</Text>
          </View>
        </View>

        {/* Scrollable graph area */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.scrollView}>
          <View style={styles.graphContainer}>
            {/* Alert markers */}
            <View style={styles.alertsContainer}>{renderAlerts()}</View>

            {/* Zone rows */}
            <View style={styles.zonesContainer}>
              {defaultZones.map((zone, index) => renderZoneRow(zone, index))}
              {/* Activity row */}
              {renderActivityRow()}
            </View>

            {/* X-axis (Time axis) */}
            <View style={[styles.xAxis, { width: graphWidth }]}>
              <View style={styles.xAxisLine} />
              {renderTimeAxis()}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* X-axis label */}
      <Text style={styles.xAxisTitle}>Time (seconds)</Text>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Legend:</Text>
        <View style={styles.legendRow}>
          <View style={[styles.legendBox, { backgroundColor: '#FFD54F' }]} />
          <Text style={styles.legendText}>Inflate</Text>
          <View style={[styles.legendBox, { backgroundColor: '#FFB74D' }]} />
          <Text style={styles.legendText}>Hold</Text>
          <View style={[styles.legendBox, { backgroundColor: '#FFA726' }]} />
          <Text style={styles.legendText}>Deflate</Text>
          <View style={[styles.legendBox, { backgroundColor: '#FFCC80' }]} />
          <Text style={styles.legendText}>Rest</Text>
        </View>
      </View>

      {/* Info note */}
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          • 6 zones with 12 valves (2 per zone: inflation & deflation)
        </Text>
        <Text style={styles.infoText}>
          • Zones cannot be inflated together, but can deflate simultaneously
        </Text>
        <Text style={styles.infoText}>
          • Time shown in seconds
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  axisLabelsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  yAxisLabelContainer: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  axisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  graphWrapper: {
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 4,
    backgroundColor: '#FAFAFA',
  },
  yAxis: {
    width: 100,
    borderRightWidth: 2,
    borderRightColor: '#333',
    backgroundColor: '#F5F5F5',
  },
  yAxisSpacer: {
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  yAxisLabel: {
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  yAxisText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  graphContainer: {
    position: 'relative',
  },
  alertsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    zIndex: 10,
  },
  alertMarker: {
    position: 'absolute',
    top: 5,
    alignItems: 'center',
  },
  alertArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#00BCD4',
  },
  alertLabel: {
    fontSize: 10,
    color: '#00BCD4',
    fontWeight: 'bold',
    marginTop: 2,
  },
  zonesContainer: {
    marginTop: 50,
  },
  zoneRow: {
    height: 70,
    marginBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  zoneTimeline: {
    height: '100%',
    position: 'relative',
    backgroundColor: '#FFF',
  },
  phaseBlock: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 2,
  },
  phaseText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  activityBlock: {
    position: 'absolute',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D4A574',
    borderRightWidth: 1,
    borderRightColor: '#FFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    paddingHorizontal: 4,
  },
  activityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  xAxis: {
    height: 50,
    position: 'relative',
    marginTop: 0,
  },
  xAxisLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#333',
  },
  timeMarker: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 11,
    color: '#333',
    fontWeight: '500',
    marginTop: 8,
  },
  xAxisTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  legend: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 6,
    marginLeft: 8,
    borderRadius: 2,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
  },
  infoBox: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E3F2FD',
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 12,
    color: '#333',
    marginBottom: 4,
  },
});

export default TherapyCycleGraph;
