import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ExercisePickerScreen } from "@/components/exercises/exercise-picker-screen";

import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useTranslation } from "@/i18n";

import { addWorkoutExercises, useWorkout } from "@/features/workouts/queries";

export default function AddExercisesScreen() {
  const { t } = useTranslation();
  const { workoutId, notifyExerciseAdded } = useWorkoutSession();
  const { exercises, loaded } = useWorkout(workoutId);
  // Taken once: the exercises added here mustn't vanish from the list while
  // the screen closes.
  const [excludeIds, setExcludeIds] = useState<string[]>();
  if (excludeIds === undefined && loaded) {
    setExcludeIds(exercises.map((exercise) => exercise.exerciseId));
  }

  function addExercises(selectedIds: string[]) {
    let addedIds: string[];
    try {
      addedIds = addWorkoutExercises(workoutId, selectedIds);
    } catch {
      Alert.alert(t.workout.saveError);
      return;
    }
    const firstId = addedIds.at(0);
    if (firstId !== undefined) {
      notifyExerciseAdded(firstId);
    }
    router.back();
  }

  if (excludeIds === undefined) {
    return null;
  }

  return (
    <ExercisePickerScreen
      backLabel={t.workout.title}
      excludeIds={excludeIds}
      doneLabel={t.workout.addExercises}
      allowEmpty={false}
      onDone={addExercises}
    />
  );
}
