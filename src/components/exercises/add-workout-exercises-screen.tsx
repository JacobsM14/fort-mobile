import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

import { ExercisePickerScreen } from "@/components/exercises/exercise-picker-screen";

import { useTranslation } from "@/i18n";

import { addWorkoutExercises, useWorkout } from "@/features/workouts/queries";

type AddWorkoutExercisesScreenProps = {
  workoutId: string;
  // Where going back leads; the workout's name when left out.
  backLabel?: string;
  // The workout_exercises rows just added, in order.
  onAdded?: (workoutExerciseIds: string[]) => void;
};

// Extra exercises for one workout, from the workout itself or from the
// history editor. The ones already in it are left out of the list.
export function AddWorkoutExercisesScreen({
  workoutId,
  backLabel,
  onAdded,
}: AddWorkoutExercisesScreenProps) {
  const { t } = useTranslation();
  const { workout, exercises, loaded } = useWorkout(workoutId);
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
    onAdded?.(addedIds);
    router.back();
  }

  if (excludeIds === undefined) {
    return null;
  }

  return (
    <ExercisePickerScreen
      backLabel={backLabel ?? workout?.name ?? t.workout.title}
      excludeIds={excludeIds}
      doneLabel={t.workout.addExercises}
      allowEmpty={false}
      onDone={addExercises}
    />
  );
}
