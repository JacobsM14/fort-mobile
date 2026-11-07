import { Alert } from "react-native";

import { useTranslation } from "@/i18n";

import { deleteSet } from "@/features/workouts/queries";
import { isSetDone } from "@/features/workouts/sets";

import type { WorkoutSet } from "@/features/workouts/queries";

// What both ways of logging sets, in rows and with the stopwatch, do with
// them. onDeleteSet is the screen's confirmation: its dialog has to cover the
// whole screen, not just the list.
export function useSetActions(
  onDeleteSet: (setId: string, number: number) => void,
) {
  const { t } = useTranslation();

  // A write that fails leaves the set as it was, and says so.
  function run(action: () => void) {
    try {
      action();
    } catch {
      Alert.alert(t.workout.saveError);
    }
  }

  // Only a done set asks first; one not done yet holds nothing to lose.
  function removeSet(set: WorkoutSet, number: number) {
    if (isSetDone(set)) {
      onDeleteSet(set.id, number);
    } else {
      run(() => deleteSet(set.id));
    }
  }

  return { run, removeSet };
}
