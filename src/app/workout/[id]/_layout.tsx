import { Stack, useLocalSearchParams } from "expo-router";

import { WorkoutSessionProvider } from "@/hooks/use-workout-session";

// Stack inside the modal so the extra exercise picker opens within it. The
// workout itself is saved as it goes, so closing the modal keeps it in
// progress.
export default function WorkoutLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <WorkoutSessionProvider workoutId={id}>
      <Stack screenOptions={{ headerShown: false }} />
    </WorkoutSessionProvider>
  );
}
