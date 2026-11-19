import { useState } from "react";
import { Alert } from "react-native";

import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";

import { useTranslation } from "@/i18n";

import {
  finishWorkout,
  startWorkout,
  useActiveWorkout,
} from "@/features/workouts/queries";

import type { RoutineSummary } from "@/features/routines/queries";

// Starting a routine now, from Today or from today's page in the history.
// Only one workout runs at a time: the routine already running opens again,
// and another one asks first to finish it. Each screen opens the workout its
// own way, and renders confirmDialog.
export function useStartRoutine(openWorkout: (workoutId: string) => void) {
  const { t } = useTranslation();
  const { activeWorkout, loaded } = useActiveWorkout();
  const [pendingRoutine, setPendingRoutine] = useState<RoutineSummary>();

  function startNewWorkout(routineId: string) {
    let workoutId: string;
    try {
      workoutId = startWorkout(routineId);
    } catch {
      Alert.alert(t.today.startError);
      return;
    }
    openWorkout(workoutId);
  }

  function start(routine: RoutineSummary) {
    if (!loaded) {
      return;
    }
    if (activeWorkout === undefined) {
      startNewWorkout(routine.id);
    } else if (activeWorkout.routineId === routine.id) {
      openWorkout(activeWorkout.id);
    } else {
      setPendingRoutine(routine);
    }
  }

  function finishActiveAndStart(activeId: string, routineId: string) {
    setPendingRoutine(undefined);
    try {
      finishWorkout(activeId);
    } catch {
      Alert.alert(t.workout.finishError);
      return;
    }
    startNewWorkout(routineId);
  }

  const confirmDialog = activeWorkout !== undefined &&
    pendingRoutine !== undefined && (
      <ConfirmDialog
        visible
        title={t.today.activeTitle}
        message={t.today.activeMessage(
          activeWorkout.name ?? t.workout.title,
          pendingRoutine.name,
        )}
        confirmLabel={t.today.activeConfirm}
        cancelLabel={t.today.cancel}
        onConfirm={() =>
          finishActiveAndStart(activeWorkout.id, pendingRoutine.id)
        }
        onCancel={() => setPendingRoutine(undefined)}
      />
    );

  return { activeWorkout, loaded, start, confirmDialog };
}
