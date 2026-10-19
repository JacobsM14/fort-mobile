const path = require("node:path");
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

// The exercise photos have no license to be distributed (see
// src/constants/app-info.ts). Builds for the stores and testers set
// EXERCISE_PHOTOS=off, which swaps the generated photo map for an empty one,
// so none of them reaches the bundle.
if (process.env.EXERCISE_PHOTOS === "off") {
  const photoMap = path.join(__dirname, "src/features/exercises/images.ts");
  const emptyMap = path.join(
    __dirname,
    "src/features/exercises/images-none.ts",
  );
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    const resolution = context.resolveRequest(context, moduleName, platform);
    return resolution.type === "sourceFile" && resolution.filePath === photoMap
      ? { type: "sourceFile", filePath: emptyMap }
      : resolution;
  };
}

module.exports = config;
