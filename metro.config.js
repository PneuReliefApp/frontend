// Learn more https://docs.expo.dev/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for 3D model files
config.resolver.assetExts.push(
  // 3D Model formats
  'glb',
  'gltf',
  'obj',
  'mtl',
  // Binary and texture formats
  'bin',
  'hdr',
  'fbx'
);

// Ensure proper handling of 3D model files in Expo Go
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

// Make sure asset loader can handle 3D assets correctly
config.resolver.sourceExts = [...config.resolver.sourceExts, 'obj', 'glb', 'gltf'];

module.exports = config;
