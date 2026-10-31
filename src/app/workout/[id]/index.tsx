import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, StyleSheet, View, type LayoutChangeEvent } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { CurrentExerciseHeader } from "@/components/workout/header/current-exercise-header";
import { ExerciseSelectMenu } from "@/components/workout/header/exercise-select";
import { WorkoutTimer } from "@/components/workout/header/workout-timer";
import { ExerciseTracker } from "@/components/workout/layout/exercise-tracker";
import { WorkoutFooter } from "@/components/workout/layout/workout-footer";

import { useTheme } from "@/hooks/use-theme";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useTranslation } from "@/i18n";

import { getExerciseInfo } from "@/features/exercises/catalog";
import { useWorkoutEntries } from "@/features/workouts/entries";
import { useWorkoutNotification } from "@/features/workouts/notification";
import {
  deleteSet,
  discardWorkout,
  finishWorkout,
  resetSetTimer,
} from "@/features/workouts/queries";
import { getDefaultExerciseId, isExerciseDone } from "@/features/workouts/sets";

import type { MenuAnchor } from "@/components/workout/header/exercise-select";
import type { ExerciseInfo } from "@/features/exercises/catalog";
import type { WorkoutEntry } from "@/features/workouts/entries";

import { formatDuration } from "@/utils/duration";

import { spacing } from "@/constants/theme";

type Confirmation =
  | { kind: "finish" }
  | { kind: "cancel" }
  | { kind: "deleteSet"; setId: string; number: number }
  | { kind: "resetTimer"; setId: string; seconds: number };

type DialogTexts = {
  tone: "primary" | "danger";
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
};

type WorkoutView = {
  title: string;
  entries: WorkoutEntry[];
};

export default function WorkoutScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { workoutId, subscribeExerciseAdded } = useWorkoutSession();
  const { title, found, entries, anyDone, startedAt, endedAt, loaded } =
    useWorkoutEntries(workoutId);
  const [currentId, setCurrentId] = useState<string>();
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>({
    top: 0,
    left: 0,
    width: 0,
  });
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const [closingView, setClosingView] = useState<WorkoutView>();

  useEffect(
    () => subscribeExerciseAdded(setCurrentId),
    [subscribeExerciseAdded],
  );

  if (loaded && currentId === undefined) {
    const defaultId = getDefaultExerciseId(entries);
    if (defaultId !== undefined) {
      setCurrentId(defaultId);
    }
  }

  const liveView: WorkoutView = { title, entries };
  const view = closingView ?? liveView;
  const currentIndex = view.entries.findIndex(
    (entry) => entry.id === currentId,
  );
  const current = currentIndex === -1 ? undefined : view.entries[currentIndex];
  const previous =
    currentIndex > 0 ? view.entries[currentIndex - 1] : undefined;
  const next = currentIndex === -1 ? undefined : view.entries[currentIndex + 1];

  useWorkoutNotification({
    workoutId,
    routineName: title,
    exerciseName: current?.name,
    startedAt,
    endedAt,
  });

  function measureHeader(event: LayoutChangeEvent) {
    const { x, y, width, height } = event.nativeEvent.layout;
    setMenuAnchor({ top: y + height, left: x, width });
  }

  function selectExercise(id: string) {
    setCurrentId(id);
    setMenuOpen(false);
  }

  function showInfo(entry: WorkoutEntry) {
    setMenuOpen(false);
    setInfo(getExerciseInfo(entry.summary, t));
  }

  function addExtraExercise() {
    setMenuOpen(false);
    router.push({
      pathname: "/workout/[id]/add_exercises",
      params: { id: workoutId },
    });
  }

  function leaveAfter(
    save: () => "finished" | "discarded",
    errorMessage: string,
  ) {
    setClosingView(liveView);
    let result: "finished" | "discarded";
    try {
      result = save();
    } catch {
      setClosingView(undefined);
      Alert.alert(errorMessage);
      return;
    }
    if (result === "finished") {
      router.replace({
        pathname: "/workout/[id]/finished_workout",
        params: { id: workoutId },
      });
    } else {
      router.back();
    }
  }

  function attempt(action: () => void, errorMessage: string) {
    try {
      action();
    } catch {
      Alert.alert(errorMessage);
    }
  }

  function confirm(action: Confirmation) {
    setConfirmation(undefined);
    switch (action.kind) {
      case "finish":
        leaveAfter(() => finishWorkout(workoutId), t.workout.finishError);
        break;
      case "cancel":
        leaveAfter(() => {
          discardWorkout(workoutId);
          return "discarded";
        }, t.workout.cancelError);
        break;
      case "deleteSet":
        attempt(() => deleteSet(action.setId), t.workout.deleteSetError);
        break;
      case "resetTimer":
        attempt(() => resetSetTimer(action.setId), t.workout.saveError);
        break;
    }
  }

  function getDialogTexts(action: Confirmation): DialogTexts {
    switch (action.kind) {
      case "finish":
        return {
          tone: "primary",
          title: t.workout.finishTitle,
          message: anyDone
            ? t.workout.finishMessage
            : t.workout.finishEmptyMessage,
          confirmLabel: t.workout.finishConfirm,
          cancelLabel: t.workout.keepTraining,
        };
      case "cancel":
        return {
          tone: "danger",
          title: t.workout.cancelTitle,
          message: t.workout.cancelMessage,
          confirmLabel: t.workout.cancelConfirm,
          cancelLabel: t.workout.keepTraining,
        };
      case "deleteSet":
        return {
          tone: "danger",
          title: t.workout.deleteSetTitle(action.number),
          message: t.workout.deleteSetMessage,
          confirmLabel: t.workout.deleteSetConfirm,
          cancelLabel: t.workout.cancel,
        };
      case "resetTimer":
        return {
          tone: "danger",
          title: t.workout.resetTitle,
          message: t.workout.resetMessage(formatDuration(action.seconds)),
          confirmLabel: t.workout.resetConfirm,
          cancelLabel: t.workout.cancel,
        };
    }
  }

  if (!loaded || (!found && closingView === undefined)) {
    return null;
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View onLayout={measureHeader}>
        <BackHeader
          backLabel={t.workout.breadCrumb}
          title={view.title}
          action={
            startedAt !== undefined && <WorkoutTimer startedAt={startedAt} />
          }
        />
        {current !== undefined && (
          <CurrentExerciseHeader
            name={current.name}
            muscles={current.summary.primaryMuscles}
            position={currentIndex + 1}
            total={view.entries.length}
            menuOpen={menuOpen}
            onShowInfo={() => showInfo(current)}
            onToggleMenu={() => setMenuOpen((open) => !open)}
          />
        )}
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {view.entries.length === 0 && (
          <>
            <NoContentBox label={t.workout.noExercises} />
            <DashedButton
              icon={{ ios: "plus", android: "add", web: "add" }}
              label={t.workout.extraExercise}
              onPress={addExtraExercise}
            />
          </>
        )}
        {current !== undefined && (
          <ExerciseTracker
            key={current.id}
            workoutId={workoutId}
            exercise={current}
            trackingType={current.summary.trackingType}
            onDeleteSet={(setId, number) =>
              setConfirmation({ kind: "deleteSet", setId, number })
            }
            onResetTimer={(setId, seconds) =>
              setConfirmation({ kind: "resetTimer", setId, seconds })
            }
          />
        )}
      </ScrollView>
      <WorkoutFooter
        previousName={previous?.name}
        nextName={next?.name}
        onPrevious={() => previous !== undefined && selectExercise(previous.id)}
        onNext={() => next !== undefined && selectExercise(next.id)}
        onCancel={() => setConfirmation({ kind: "cancel" })}
        onFinish={() => setConfirmation({ kind: "finish" })}
      />
      {menuOpen && (
        <ExerciseSelectMenu
          items={view.entries.map((entry) => ({
            id: entry.id,
            name: entry.name,
            trackingType: entry.summary.trackingType,
            done: isExerciseDone(entry),
          }))}
          currentId={currentId}
          anchor={menuAnchor}
          onSelect={selectExercise}
          onAddExercise={addExtraExercise}
          onClose={() => setMenuOpen(false)}
        />
      )}
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
      {confirmation !== undefined && (
        <ConfirmDialog
          visible
          {...getDialogTexts(confirmation)}
          onConfirm={() => confirm(confirmation)}
          onCancel={() => setConfirmation(undefined)}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
