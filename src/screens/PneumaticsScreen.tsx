import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export default function PneumaticsScreen() {
  const [position, setPosition] = useState('Supine');
  const [controlMode, setControlMode] = useState('Auto'); // Toggles between 'Auto' and 'Manual'
  const [selectedMode, setSelectedMode] = useState('Alternating');
  const [isRunning, setIsRunning] = useState(false); // For Manual Start/Stop state

  // --- BRAND COLORS ---
  const COLORS = {
    primaryBlue: '#10355F', // Deep Navy (Text/Foot)
    accentOrange: '#F97316', // Orange (Swoosh Ring)
    softBlue: '#D1E5F4',    // Light Blue (Dots/Background)
    background: '#FFFFFF',
    lightGrey: '#F3F4F6',
    textGrey: '#6B7280',
    // New Warning Colors for Manual Mode
    warningBg: '#FFF7ED',   // Very light orange
    warningBorder: '#FDBA74',
    warningText: '#C2410C',
    stopBtnGrey: '#9CA3AF',
  };

  // --- COMPONENT: Position Selectors ---
  const renderPositionButton = (label: string) => {
    const isActive = position === label;
    return (
      <TouchableOpacity
        style={[
          styles.segmentButton,
          isActive && { backgroundColor: COLORS.primaryBlue }
        ]}
        onPress={() => setPosition(label)}
      >
        <Text style={[
          styles.segmentText,
          isActive && { color: 'white', fontWeight: 'bold' }
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  // --- COMPONENT: Auto Mode Cards ---
  const renderModeCard = (modeName: string, description: string) => {
    const isActive = selectedMode === modeName;
    return (
      <TouchableOpacity
        style={[
          styles.modeCard,
          isActive && {
            backgroundColor: COLORS.primaryBlue,
            borderColor: COLORS.primaryBlue
          }
        ]}
        onPress={() => setSelectedMode(modeName)}
      >
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
           <Text style={[styles.modeTitle, isActive && { color: 'white' }]}>
             {modeName}
           </Text>
           {isActive && <View style={[styles.activeDot, { borderColor: COLORS.accentOrange }]} />}
        </View>
        <Text style={[styles.modeDesc, isActive && { color: '#E0E0E0' }]}>
          {description}
        </Text>
      </TouchableOpacity>
    );
  };

  // --- SECTION: Auto Mode UI ---
  const renderAutoUI = () => (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: COLORS.primaryBlue }]}>Select Mode</Text>
      {renderModeCard('Alternating', 'Description...')}
      {renderModeCard('Sleep', 'Description...')}
      {renderModeCard('Firm', 'Description...')}
    </View>
  );

  // --- SECTION: Manual Mode UI ---
  const renderManualUI = () => (
    <View style={styles.sectionContainer}>
      {/* Start / Stop Buttons Row */}
      <View style={styles.manualControlsRow}>
        {/* Start Button */}
        <TouchableOpacity
          style={[styles.manualBtn, { backgroundColor: COLORS.primaryBlue }]}
          onPress={() => setIsRunning(true)}
        >
          <Text style={styles.manualBtnIcon}>▶</Text>
          <Text style={styles.manualBtnText}>Start</Text>
        </TouchableOpacity>

        {/* Stop Button */}
        <TouchableOpacity
          style={[styles.manualBtn, { backgroundColor: COLORS.textGrey }]}
          onPress={() => setIsRunning(false)}
        >
          <Text style={styles.manualBtnIcon}>■</Text>
          <Text style={styles.manualBtnText}>Stop</Text>
        </TouchableOpacity>
      </View>

      {/* Warning Banner */}
      <View style={[styles.warningBanner, { backgroundColor: COLORS.warningBg, borderColor: COLORS.warningBorder }]}>
        <Text style={[styles.warningText, { color: COLORS.warningText }]}>
          Manual mode requires careful monitoring. Switch to Auto for optimal pressure relief.
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: COLORS.background }]}>
      <Text style={[styles.header, { color: COLORS.primaryBlue }]}>Pneumatic System</Text>
      <Text style={styles.subHeader}>Pressure relief control</Text>

      {/* --- Patient Position (Always Visible) --- */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: COLORS.primaryBlue }]}>Patient Position</Text>
        <View style={[styles.segmentContainer, { backgroundColor: COLORS.lightGrey }]}>
          {renderPositionButton('Supine')}
          {renderPositionButton('Seated')}
          {renderPositionButton('Standing')}
        </View>
      </View>

      {/* --- Control Mode Toggle (Always Visible) --- */}
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, { color: COLORS.primaryBlue }]}>Control Mode</Text>
        <View style={[styles.toggleContainer, { backgroundColor: COLORS.lightGrey }]}>
          {['Auto', 'Manual'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.toggleBtn,
                controlMode === mode && { backgroundColor: COLORS.primaryBlue }
              ]}
              onPress={() => setControlMode(mode)}
            >
              <Text style={[
                styles.toggleText,
                controlMode === mode && { color: 'white', fontWeight: 'bold' }
              ]}>
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* --- CONDITIONAL RENDER: Switches based on Control Mode --- */}
      {controlMode === 'Auto' ? renderAutoUI() : renderManualUI()}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subHeader: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 30,
  },
  sectionContainer: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },
  // Position Segment Styles
  segmentContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  segmentText: {
    color: '#6B7280',
    fontWeight: '600',
  },
  // Toggle Styles
  toggleContainer: {
    flexDirection: 'row',
    borderRadius: 25,
    padding: 4,
    width: '100%',
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 20,
  },
  toggleText: {
    fontWeight: '600',
    color: '#6B7280',
  },
  // Auto Mode Card Styles
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
    color: '#10355F',
    marginBottom: 4,
  },
  modeDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  activeDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'white',
    borderWidth: 3,
  },
  // Manual Mode Styles
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