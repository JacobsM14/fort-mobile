import { Stack, useLocalSearchParams } from "expo-router";

import {
  NEW_ROUTINE_ID,
  RoutineDraftProvider,
} from "@/hooks/use-routine-draft";

import { useRoutine } from "@/features/routines/queries";

// Stack inside the modal so new_exercises opens within it. The draft lives
// as long as the modal, so dismissing it discards the changes.
export default function RoutineLayout() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const routineId = id === NEW_ROUTINE_ID ? null : id;
  const { routine, loaded } = useRoutine(routineId);

  if (routineId !== null && !loaded) {
    return null;
  }

  return (
    <RoutineDraftProvider routineId={routineId} initial={routine}>
      <Stack screenOptions={{ headerShown: false }} />
    </RoutineDraftProvider>
  );
}
