import { Stack } from "expo-router";

// Nested stack so screens pushed inside the routines tab keep the tab bar.
export default function RoutinesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
