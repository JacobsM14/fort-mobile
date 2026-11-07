import { AddWorkoutExercisesScreen } from "@/components/exercises/add-workout-exercises-screen";

import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useTranslation } from "@/i18n";

export default function AddExercisesScreen() {
  const { t } = useTranslation();
  const { workoutId, notifyExerciseAdded } = useWorkoutSession();

  return (
    <AddWorkoutExercisesScreen
      workoutId={workoutId}
      backLabel={t.workout.title}
      // The workout underneath switches to the first exercise added.
      onAdded={(addedIds) => {
        const firstId = addedIds.at(0);
        if (firstId !== undefined) {
          notifyExerciseAdded(firstId);
        }
      }}
    />
  );
}
