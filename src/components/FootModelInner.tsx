import { useRef } from 'react';
import { Group } from 'three';
import { useFrame } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { GLTF } from 'three-stdlib';

// Basic foot model component that just displays a 3D foot
export default function FootModelInner() {
  const groupRef = useRef<Group>(null);

  const gltf = useGLTF(
    require('../../assets/models/human_foot_base_mesh.glb')
  ) as GLTF;
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  return (
    <group
      ref={groupRef}
      scale={[2, 2, 2]} 
      rotation={[0.1, 0, 0]} 
      position={[0, -1, 0]}
    >
      <primitive object={gltf.scene} />
    </group>
  );
}
