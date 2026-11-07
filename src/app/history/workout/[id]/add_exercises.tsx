import { useLocalSearchParams } from "expo-router";

import { AddWorkoutExercisesScreen } from "@/components/exercises/add-workout-exercises-screen";

export default function HistoryAddExercisesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return <AddWorkoutExercisesScreen workoutId={id} />;
}
