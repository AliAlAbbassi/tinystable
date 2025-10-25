const { getDefaultConfig } = require('expo/metro-config');
const nodeLibs = require('node-libs-react-native');

const config = getDefaultConfig(__dirname);

// Polyfill node modules for viem
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    ...nodeLibs,
    crypto: require.resolve('expo-crypto'),
  },
  sourceExts: [...config.resolver.sourceExts, 'cjs'],
};

// Transform import.meta for viem
config.transformer = {
  ...config.transformer,
  babelTransformerPath: require.resolve('metro-react-native-babel-transformer'),
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Handle import.meta.url
config.serializer = {
  ...config.serializer,
  getPolyfills: () => {
    return [];
  },
};

module.exports = config;