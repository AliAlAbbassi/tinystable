// Import crypto polyfill before anything else
import 'react-native-get-random-values';

// Polyfill Buffer
if (typeof Buffer === 'undefined') {
  global.Buffer = require('buffer').Buffer;
}

// Polyfill process
if (typeof process === 'undefined') {
  global.process = require('process');
}

// Polyfill import.meta
if (typeof globalThis !== 'undefined' && !globalThis.import) {
  globalThis.import = {
    meta: {
      url: 'https://localhost:8081',
    },
  };
}