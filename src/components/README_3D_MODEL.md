# 3D Foot Model Visualization

## Overview

This module provides a 3D foot model visualization for the PneuRelief app. It displays a 3D foot model that can be rotated and zoomed by the user.

## Components

### ThreeJSFootVisualization

The main component that renders the 3D scene. It:
- Handles loading states for the 3D model
- Sets up the Three.js scene with proper lighting
- Provides user controls for interacting with the model

### FootModelInner

The component that renders the actual 3D foot model. It:
- Loads the GLB file from the assets directory
- Applies a gentle rotation animation to the model
- Sets up the proper scaling and positioning of the model

## Usage

To use the 3D foot visualization in your React Native component:

```tsx
import ThreeJSFootVisualization from '../components/ThreeJSFootVisualization';

function MyComponent() {
  return (
    <View style={styles.container}>
      <ThreeJSFootVisualization />
    </View>
  );
}
```

## Model File

The 3D model file should be placed in:
```
/assets/models/human_foot_base_mesh.glb
```

## Dependencies

This module requires the following packages:
- @react-three/fiber/native
- @react-three/drei/native
- three
- expo-gl
- expo-asset
- expo-three

## User Interaction

Users can:
- Rotate the model by dragging
- Zoom in/out by pinching
- The model will also slowly rotate on its own for better visibility

## Customization

To customize the appearance:
1. Modify the `styles` object in ThreeJSFootVisualization.tsx
2. Adjust lighting parameters in the Canvas component
3. Change rotation speed or initial position in FootModelInner.tsx
