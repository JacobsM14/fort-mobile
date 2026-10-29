import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ExercisePickerScreen } from "@/components/exercises/exercise-picker-screen";

import { useTranslation } from "@/i18n";

import { addWorkoutExercises, useWorkout } from "@/features/workouts/queries";

export default function HistoryAddExercisesScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { workout, exercises, loaded } = useWorkout(id);
  // Taken once: the exercises added here mustn't vanish from the list while
  // the screen closes.
  const [excludeIds, setExcludeIds] = useState<string[]>();
  if (excludeIds === undefined && loaded) {
    setExcludeIds(exercises.map((exercise) => exercise.exerciseId));
  }

  function addExercises(selectedIds: string[]) {
    try {
      addWorkoutExercises(id, selectedIds);
    } catch {
      Alert.alert(t.workout.saveError);
      return;
    }
    router.back();
  }

  if (excludeIds === undefined) {
    return null;
  }

  return (
    <ExercisePickerScreen
      backLabel={workout?.name ?? t.workout.title}
      excludeIds={excludeIds}
      doneLabel={t.workout.addExercises}
      allowEmpty={false}
      onDone={addExercises}
    />
  );
}
