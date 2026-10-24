import { Stack } from "expo-router";

// Stack inside the modal so the day and the workout editor open within it and
// get back navigation.
export default function HistoryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
