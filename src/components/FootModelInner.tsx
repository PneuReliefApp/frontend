import React, { useRef, useEffect, useState } from 'react';
import { Group, Object3D } from 'three';
import { Asset } from 'expo-asset';
import { loadAsync } from 'expo-three';

// Basic foot model component that just displays a 3D foot
export default function FootModelInner() {
  const groupRef = useRef<Group>(null);
  const [scene, setScene] = useState<Object3D | null>(null);
  
  // Load the GLB model using expo-three which properly handles assets in Expo
  useEffect(() => {
    async function loadModel() {
      try {
        // Load the asset from the local file system
        const asset = Asset.fromModule(require('../../assets/models/human_foot_base_mesh.glb'));
        await asset.downloadAsync();
        
        // Use expo-three to load the GLB file
        const model = await loadAsync(asset.localUri || asset.uri);
        setScene(model.scene);
      } catch (error) {
        console.error('Error loading 3D model:', error);
      }
    }
    
    loadModel();
  }, []);
  
  // Add auto-rotation effect - this must be called before any conditional returns
  useEffect(() => {
    if (!scene) return; // Early return inside the effect is fine
    
    let frameId: number;
    
    const animate = () => {
      if (groupRef.current) {
        // Gentle rotation effect for better visibility
        groupRef.current.rotation.y += 0.002;
      }
      frameId = requestAnimationFrame(animate);
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [scene]); // Add scene as dependency
  
  // Don't render anything until the model is loaded
  if (!scene) {
    return null;
  }
  
  return (
    <group ref={groupRef} scale={[2, 2, 2]} rotation={[0.1, 0, 0]} position={[0, -1, 0]}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}
