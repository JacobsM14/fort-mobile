import { Stack } from "expo-router";

// Nested stack so screens pushed inside the profile tab keep the tab bar.
export default function ProfileLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
