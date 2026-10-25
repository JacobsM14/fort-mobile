import { Stack } from "expo-router";

// A day opened straight from Today keeps the list underneath, so going back
// lands on the history rather than closing the modal.
export const unstable_settings = {
  initialRouteName: "index",
};

// Stack inside the modal so the day and the workout editor open within it and
// get back navigation.
export default function HistoryLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
