const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for viem import.meta issue
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_conditionNames = ['react-native', 'browser', 'require'];

// Add crypto polyfill for viem
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  crypto: require.resolve('expo-crypto'),
};

// Add support for .cjs files
config.resolver.sourceExts = [...config.resolver.sourceExts, 'cjs'];

// Transform import.meta
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;