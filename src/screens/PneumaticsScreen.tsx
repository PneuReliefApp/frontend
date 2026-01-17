import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView } from 'react-native';
import InflationGraph from '../graphs/inflation_graph';

export default function PneumaticsScreen() {
  const [position, setPosition] = useState('Supine');
  const [controlMode, setControlMode] = useState('Auto');
  const [selectedMode, setSelectedMode] = useState('Alternating');
  const [isRunning, setIsRunning] = useState(false);

  // --- REPORT THEME COLORS ---
  const COLORS = {
    primaryDarkBlue: "#0F3057",
    accentOrange: "#F37021",
    lightBlueBg: "#E6F0FF",
    mediumBlueAccent: "#80BFFF",
    iconBg: "#D0E6FF",
    white: "#FFFFFF",
    textGray: "#333333",
    warningBg: '#FFF7ED',
    warningBorder: '#FDBA74',
    warningText: '#C2410C',
  };

  const renderPositionButton = (label: string) => {
    const isActive = position === label;
    return (
      <TouchableOpacity
        style={[
          styles.segmentButton,
          isActive && { backgroundColor: COLORS.primaryDarkBlue }
        ]}
        onPress={() => setPosition(label)}
      >
        <Text style={[
          styles.segmentText,
          isActive ? { color: 'white', fontWeight: 'bold' } : { color: COLORS.primaryDarkBlue }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderModeCard = (modeName: string, description: string) => {
    const isActive = selectedMode === modeName;
    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          isActive && {
            backgroundColor: COLORS.primaryDarkBlue,
            borderColor: COLORS.primaryDarkBlue
          }
        ]}
        onPress={() => setSelectedMode(modeName)}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text style={[styles.modeTitle, isActive ? { color: 'white' } : { color: COLORS.primaryDarkBlue }]}>
             {modeName}
           </Text>
           {isActive && <View style={[styles.activeDot, { borderColor: COLORS.accentOrange }]} />}
        </View>
        <Text style={[styles.modeDesc, isActive ? { color: '#E0E0E0' } : { color: COLORS.textGray }]}>
          {description}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderAutoUI = () => (
    <View style={styles.cardContainer}>
      <Text style={[styles.sectionTitle, { color: COLORS.primaryDarkBlue }]}>Select Mode</Text>
      <View style={styles.divider} />
      {renderModeCard('Alternating', 'Cycles pressure every 10 mins')}
      {renderModeCard('Sleep', 'Reduced noise and gentle cycles')}
      {renderModeCard('Firm', 'Maximum inflation for patient transfer')}
    </View>
  );

  const renderManualUI = () => (
    <View style={styles.cardContainer}>
       <Text style={[styles.sectionTitle, { color: COLORS.primaryDarkBlue }]}>Manual Control</Text>
       <View style={styles.divider} />

      <View style={styles.manualControlsRow}>
        <TouchableOpacity
          style={[styles.manualBtn, { backgroundColor: COLORS.primaryDarkBlue }]}
          onPress={() => setIsRunning(true)}
        >
          <Text style={styles.manualBtnIcon}>▶</Text>
          <Text style={styles.manualBtnText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.manualBtn, { backgroundColor: COLORS.textGray }]}
          onPress={() => setIsRunning(false)}
        >
          <Text style={styles.manualBtnIcon}>■</Text>
          <Text style={styles.manualBtnText}>Stop</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.warningBanner, { backgroundColor: COLORS.warningBg, borderColor: COLORS.warningBorder }]}>
        <Text style={[styles.warningText, { color: COLORS.warningText }]}>
          Manual mode requires careful monitoring. Switch to Auto for optimal pressure relief.
        </Text>
      </View>
    </View>
  );

  // --- MAIN RENDER ---
  return (
    // 1. Changed View/ScrollView to SafeAreaView as the root
    <SafeAreaView style={[styles.safeArea, { backgroundColor: COLORS.lightBlueBg }]}>

      {/* 2. ScrollView now lives INSIDE SafeAreaView */}
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* 3. Title uses exact same styling/margin as Reports Screen */}
        <Text style={[styles.header, { color: COLORS.primaryDarkBlue }]}>Pneumatic System</Text>

        <InflationGraph />

        <View style={styles.cardContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.primaryDarkBlue }]}>Patient Position</Text>
          <View style={styles.divider} />

          <View style={[styles.segmentContainer, { backgroundColor: COLORS.iconBg }]}>
            {renderPositionButton('Supine')}
            {renderPositionButton('Seated')}
            {renderPositionButton('Standing')}
          </View>
        </View>

        <View style={styles.cardContainer}>
          <Text style={[styles.sectionTitle, { color: COLORS.primaryDarkBlue }]}>Control Mode</Text>
          <View style={styles.divider} />

          <View style={[styles.toggleContainer, { backgroundColor: COLORS.iconBg }]}>
            {['Auto', 'Manual'].map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[
                  styles.toggleBtn,
                  controlMode === mode && { backgroundColor: COLORS.primaryDarkBlue }
                ]}
                onPress={() => setControlMode(mode)}
              >
                <Text style={[
                  styles.toggleText,
                  controlMode === mode ? { color: 'white', fontWeight: 'bold' } : { color: COLORS.primaryDarkBlue }
                ]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {controlMode === 'Auto' ? renderAutoUI() : renderManualUI()}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // New Safe Area Container
  safeArea: {
    flex: 1,
  },
  // Padding moved to ScrollView content container
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Exact match to Reports Screen Title
  header: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 10, // Reduced from 16 to match Reports
    textAlign: "center",
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
    shadowColor: '#0F3057',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    marginVertical: 12,
    backgroundColor: '#80BFFF',
    height: 1,
    opacity: 0.5,
  },
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
  },
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  modeCard: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  modeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 12,
  },
  activeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
    borderWidth: 2,
  },
  manualControlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 15,
  },
  manualBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  manualBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  manualBtnIcon: {
    color: 'white',
    fontSize: 14,
  },
  warningBanner: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
  },
  warningText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  }
});