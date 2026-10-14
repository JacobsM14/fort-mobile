import { Stack } from "expo-router";

// Nested stack so new_routine keeps the tab bar and gets back navigation.
export default function RoutinesLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
