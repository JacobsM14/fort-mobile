import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  type HostInstance,
  type LayoutChangeEvent,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import {
  BackBreadcrumb,
  HeaderTitle,
} from "@/components/ui/layout/back-header";
import { ActionMenu } from "@/components/ui/overlays/action-menu";
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
import { useWorkoutNotification } from "@/features/notifications/workout-notification";
import { useWorkoutEntries } from "@/features/workouts/entries";
import {
  deleteSet,
  discardWorkout,
  finishWorkout,
  resetSetTimer,
} from "@/features/workouts/queries";
import { getDefaultExerciseId, isExerciseDone } from "@/features/workouts/sets";

import type {
  ActionMenuAnchor,
  ActionMenuItem,
} from "@/components/ui/overlays/action-menu";
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
  const [actionsAnchor, setActionsAnchor] = useState<ActionMenuAnchor>();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const [closingView, setClosingView] = useState<WorkoutView>();
  const screenRef = useRef<HostInstance>(null);
  const actionsButtonRef = useRef<HostInstance>(null);

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

  // Measured against the screen the menu covers, its right edge lined up with
  // the button's.
  function openActions() {
    setMenuOpen(false);
    screenRef.current?.measureInWindow((screenX, screenY, screenWidth) => {
      actionsButtonRef.current?.measureInWindow((x, y, width, height) => {
        setActionsAnchor({
          top: y - screenY + height + spacing.xs,
          right: screenWidth - (x - screenX + width),
        });
      });
    });
  }

  function getActionItems(): ActionMenuItem[] {
    const items: ActionMenuItem[] = [];
    if (current !== undefined) {
      items.push({
        id: "info",
        label: t.workout.exerciseInfo,
        icon: { ios: "info.circle", android: "info", web: "info" },
      });
    }
    items.push(
      {
        id: "addExercise",
        label: t.workout.addExtraExercise,
        icon: { ios: "plus", android: "add", web: "add" },
      },
      {
        id: "finish",
        label: t.workout.finishNow,
        icon: { ios: "checkmark", android: "check", web: "check" },
        tone: "primary",
        separated: true,
      },
      {
        id: "cancel",
        label: t.workout.cancelSession,
        icon: { ios: "trash", android: "delete", web: "delete" },
        tone: "danger",
      },
    );
    return items;
  }

  function selectAction(id: string) {
    setActionsAnchor(undefined);
    switch (id) {
      case "info":
        if (current !== undefined) {
          showInfo(current);
        }
        break;
      case "addExercise":
        addExtraExercise();
        break;
      case "finish":
        setConfirmation({ kind: "finish" });
        break;
      case "cancel":
        setConfirmation({ kind: "cancel" });
        break;
    }
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
      ref={screenRef}
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View onLayout={measureHeader}>
        <View style={styles.breadcrumbRow}>
          <BackBreadcrumb label={t.workout.breadCrumb} />
          <View ref={actionsButtonRef}>
            <IconButton
              tone="muted"
              bordered={false}
              icon={{
                ios: "ellipsis",
                android: "more_horiz",
                web: "more_horiz",
              }}
              accessibilityLabel={t.workout.moreOptions}
              onPress={openActions}
            />
          </View>
        </View>
        <HeaderTitle
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
      {actionsAnchor !== undefined && (
        <ActionMenu
          items={getActionItems()}
          anchor={actionsAnchor}
          closeLabel={t.workout.closeOptions}
          onSelect={selectAction}
          onClose={() => setActionsAnchor(undefined)}
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
  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
