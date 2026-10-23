const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver.sourceExts.push("sql");
// expo-sqlite on web loads SQLite as a WebAssembly file.
config.resolver.assetExts.push("wasm");

// The synchronous expo-sqlite API runs in a worker on web and needs
// SharedArrayBuffer, which browsers only allow on cross-origin isolated pages.
config.server.enhanceMiddleware = (middleware) => (req, res, next) => {
  res.setHeader("Cross-Origin-Embedder-Policy", "credentialless");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  middleware(req, res, next);
};

module.exports = config;
