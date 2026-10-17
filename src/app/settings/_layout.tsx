import { Stack } from "expo-router";

// Stack inside the modal so every settings section opens within it and gets
// back navigation.
export default function SettingsLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
