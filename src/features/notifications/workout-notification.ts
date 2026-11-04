import * as Linking from "expo-linking";
import { useEffect } from "react";

import { useTranslation } from "@/i18n";

import { useActiveWorkout } from "@/features/workouts/queries";
import { dismiss, show } from "@/modules/workout-notification";

import { loadNotificationPreferences } from "./preferences";

type UseWorkoutNotificationOptions = {
  workoutId: string;
  routineName: string;
  exerciseName: string | undefined;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
};

// Shows the workout in progress, with the chronometer drawn by Android, and
// updates it when the current exercise changes. It is not removed when the
// screen closes: the workout goes on in the background.
export function useWorkoutNotification({
  workoutId,
  routineName,
  exerciseName,
  startedAt,
  endedAt,
}: UseWorkoutNotificationOptions) {
  const { t } = useTranslation();
  const channelName = t.notifications.channel;
  const startedAtMs = startedAt?.getTime();
  const inProgress = endedAt === undefined;

  useEffect(() => {
    const { enabled, workout } = loadNotificationPreferences();
    if (
      !enabled ||
      !workout ||
      startedAtMs === undefined ||
      exerciseName === undefined ||
      !inProgress
    ) {
      return;
    }
    show({
      url: Linking.createURL(`workout/${workoutId}`),
      title: routineName,
      text: exerciseName,
      startedAtMs,
      channelName,
    });
  }, [
    workoutId,
    routineName,
    exerciseName,
    startedAtMs,
    inProgress,
    channelName,
  ]);
}

// For when the user turns the notification off with a workout going on.
export function dismissWorkoutNotification() {
  dismiss();
}

// Removes the notification once no workout is in progress, however it ended
// (finished, cancelled, or replaced from Today).
export function useDismissEndedWorkoutNotification() {
  const { activeWorkout, loaded } = useActiveWorkout();
  const active = activeWorkout !== undefined;

  useEffect(() => {
    if (loaded && !active) {
      dismiss();
    }
  }, [loaded, active]);
}
