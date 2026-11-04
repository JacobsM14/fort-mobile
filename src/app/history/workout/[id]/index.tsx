import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Alert, StyleSheet, Text, View, type HostInstance } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import {
  DASHED_BUTTON_HEIGHT,
  DashedButton,
} from "@/components/ui/buttons/dashed-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import {
  ActionMenu,
  type ActionMenuAnchor,
} from "@/components/ui/overlays/action-menu";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { ExerciseTracker } from "@/components/workout/layout/exercise-tracker";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getExerciseInfo } from "@/features/exercises/catalog";
import { useWorkoutEntries } from "@/features/workouts/entries";
import {
  deleteSet,
  deleteWorkoutExercise,
  discardWorkout,
  resetSetTimer,
} from "@/features/workouts/queries";

import type { ExerciseInfo } from "@/features/exercises/catalog";
import type { WorkoutEntry } from "@/features/workouts/entries";

import { formatDayHeader } from "@/utils/date";
import { formatDuration } from "@/utils/duration";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type Confirmation =
  | { kind: "deleteSet"; setId: string; number: number }
  | { kind: "resetTimer"; setId: string; seconds: number }
  | { kind: "deleteExercise"; workoutExerciseId: string; name: string }
  | { kind: "deleteWorkout" };

type DialogTexts = {
  title: string;
  message: string;
  confirmLabel: string;
};

// Every exercise at once, unlike the workout screen: a finished workout is
// read and corrected as a whole. Changes are saved as they are made.
export default function HistoryWorkoutScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title, found, entries, startedAt, loaded } = useWorkoutEntries(id);
  const [confirmation, setConfirmation] = useState<Confirmation>();
  const [menu, setMenu] = useState<{
    entry: WorkoutEntry;
    anchor: ActionMenuAnchor;
  }>();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const screenRef = useRef<HostInstance>(null);
  const menuButtons = useRef(new Map<string, HostInstance>());

  // The button scrolls with the list, so where it is on the screen is only
  // known when the menu opens: measured against the screen the menu covers.
  function openMenu(entry: WorkoutEntry) {
    const button = menuButtons.current.get(entry.id);
    screenRef.current?.measureInWindow((screenX, screenY, screenWidth) => {
      button?.measureInWindow((x, y, width, height) => {
        setMenu({
          entry,
          anchor: {
            top: y - screenY + height + spacing.xs,
            right: screenWidth - (x - screenX + width),
          },
        });
      });
    });
  }

  function selectMenuItem(action: string) {
    if (menu === undefined) {
      return;
    }
    const { entry } = menu;
    setMenu(undefined);
    if (action === "info") {
      setInfo(getExerciseInfo(entry.summary, t));
    } else {
      setConfirmation({
        kind: "deleteExercise",
        workoutExerciseId: entry.id,
        name: entry.name,
      });
    }
  }

  function addExercise() {
    router.push({
      pathname: "/history/workout/[id]/add_exercises",
      params: { id },
    });
  }

  function confirm(action: Confirmation) {
    setConfirmation(undefined);
    try {
      switch (action.kind) {
        case "deleteSet":
          deleteSet(action.setId);
          break;
        case "resetTimer":
          resetSetTimer(action.setId);
          break;
        case "deleteExercise":
          deleteWorkoutExercise(action.workoutExerciseId);
          break;
        case "deleteWorkout":
          discardWorkout(id);
          router.back();
          break;
      }
    } catch {
      Alert.alert(
        action.kind === "resetTimer"
          ? t.workout.saveError
          : t.history.deleteError,
      );
    }
  }

  function getDialogTexts(action: Confirmation): DialogTexts {
    switch (action.kind) {
      case "deleteSet":
        return {
          title: t.workout.deleteSetTitle(action.number),
          message: t.workout.deleteSetMessage,
          confirmLabel: t.workout.deleteSetConfirm,
        };
      case "resetTimer":
        return {
          title: t.workout.resetTitle,
          message: t.workout.resetMessage(formatDuration(action.seconds)),
          confirmLabel: t.workout.resetConfirm,
        };
      case "deleteExercise":
        return {
          title: t.history.deleteExerciseTitle(action.name),
          message: t.history.deleteExerciseMessage,
          confirmLabel: t.history.deleteExerciseConfirm,
        };
      case "deleteWorkout":
        return {
          title: t.history.deleteWorkoutTitle,
          message: t.history.deleteWorkoutMessage,
          confirmLabel: t.history.deleteWorkoutConfirm,
        };
    }
  }

  if (!loaded || !found) {
    return null;
  }

  return (
    <SafeAreaView
      ref={screenRef}
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={
          startedAt === undefined
            ? t.history.day
            : formatDayHeader(startedAt, language)
        }
        title={title}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {entries.length === 0 && <NoContentBox label={t.workout.noExercises} />}
        {entries.map((entry, index) => (
          <View key={entry.id} style={styles.exercise}>
            {index > 0 && (
              <View style={styles.divider} accessibilityElementsHidden>
                <View style={styles.dividerLine} />
                <View style={styles.dividerTick} />
              </View>
            )}
            <View style={styles.exerciseHeader}>
              <Text style={styles.name} numberOfLines={2} ellipsizeMode="tail">
                {entry.name}
              </Text>
              <View
                ref={(node) => {
                  if (node === null) {
                    menuButtons.current.delete(entry.id);
                  } else {
                    menuButtons.current.set(entry.id, node);
                  }
                }}
              >
                <IconButton
                  tone="muted"
                  icon={{
                    ios: "ellipsis",
                    android: "more_horiz",
                    web: "more_horiz",
                  }}
                  accessibilityLabel={t.history.exerciseOptions(entry.name)}
                  onPress={() => openMenu(entry)}
                />
              </View>
            </View>
            <ExerciseTracker
              workoutId={id}
              exercise={entry}
              trackingType={entry.summary.trackingType}
              mode="edit"
              onDeleteSet={(setId, number) =>
                setConfirmation({ kind: "deleteSet", setId, number })
              }
              onResetTimer={(setId, seconds) =>
                setConfirmation({ kind: "resetTimer", setId, seconds })
              }
            />
          </View>
        ))}
      </ScrollView>
      <View style={styles.footer}>
        <IconButton
          tone="danger"
          size={DASHED_BUTTON_HEIGHT}
          icon={{ ios: "trash", android: "delete", web: "delete" }}
          accessibilityLabel={t.history.deleteWorkout}
          onPress={() => setConfirmation({ kind: "deleteWorkout" })}
        />
        <View style={styles.addExercise}>
          <DashedButton
            icon={{ ios: "plus", android: "add", web: "add" }}
            label={t.history.addExercise}
            onPress={addExercise}
          />
        </View>
      </View>
      {menu !== undefined && (
        <ActionMenu
          items={[
            {
              id: "info",
              label: t.exercises.showInfo,
              icon: { ios: "info.circle", android: "info", web: "info" },
            },
            {
              id: "remove",
              label: t.history.removeExercise,
              icon: { ios: "trash", android: "delete", web: "delete" },
              tone: "danger",
            },
          ]}
          anchor={menu.anchor}
          closeLabel={t.history.closeMenu}
          onSelect={selectMenuItem}
          onClose={() => setMenu(undefined)}
        />
      )}
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
      {confirmation !== undefined && (
        <ConfirmDialog
          visible
          tone="danger"
          {...getDialogTexts(confirmation)}
          cancelLabel={t.workout.cancel}
          onConfirm={() => confirm(confirmation)}
          onCancel={() => setConfirmation(undefined)}
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: {
      paddingBottom: 0,
    },
    content: {
      gap: spacing.md,
      paddingBottom: spacing.lg,
    },
    exercise: {
      gap: spacing.md,
    },
    // A hairline across the screen with a short tick through its middle,
    // between one exercise and the next.
    divider: {
      height: spacing.md,
      justifyContent: "center",
      marginBottom: spacing.md,
    },
    dividerLine: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    dividerTick: {
      position: "absolute",
      alignSelf: "center",
      width: StyleSheet.hairlineWidth,
      height: spacing.md,
      backgroundColor: colors.border,
    },
    exerciseHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    name: {
      flex: 1,
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    // Stays under the scrolling list, like the workout's own footer.
    footer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    addExercise: {
      flex: 1,
    },
  }),
);
