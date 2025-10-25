// Polyfill import.meta for viem
if (typeof globalThis !== 'undefined' && !globalThis.importMetaPolyfilled) {
  globalThis.importMetaPolyfilled = true;

  // Mock import.meta for web environment
  if (typeof global !== 'undefined' && typeof global.importMeta === 'undefined') {
    global.importMeta = { url: 'https://localhost:8081' };
  }
}

// Add crypto polyfills
import 'react-native-get-random-values';