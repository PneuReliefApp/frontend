import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Canvas } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import { Asset } from 'expo-asset';
import FootModelInner from './FootModelInner';

export default function ThreeJSFootVisualization() {
  return (
    <View style={styles.container}>
      <Canvas camera={{ position: [3, 2, 3], fov: 50 }} style={{ width: "100%", height: "100%" }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={0.8} />
        <pointLight position={[-10, -10, -5]} intensity={0.3} />

        <FootModelInner />

        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
        />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 350, // Good height for mobile
    backgroundColor: '#f1f5f9', // Tailwind slate-100 equivalent
    borderRadius: 8,
    overflow: 'hidden',
  },
  loadingContainer: {
    width: '100%',
    height: 350,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
