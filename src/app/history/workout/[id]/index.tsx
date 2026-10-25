import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { ExerciseTracker } from "@/components/workout/layout/exercise-tracker";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useWorkoutEntries } from "@/features/workouts/entries";
import {
  deleteSet,
  deleteWorkoutExercise,
  discardWorkout,
  resetSetTimer,
} from "@/features/workouts/queries";

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
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { title, found, entries, loaded } = useWorkoutEntries(id);
  const [confirmation, setConfirmation] = useState<Confirmation>();

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
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader backLabel={t.history.day} title={title} />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        {entries.length === 0 && <NoContentBox label={t.workout.noExercises} />}
        {entries.map((entry) => (
          <View key={entry.id} style={styles.exercise}>
            <View style={styles.exerciseHeader}>
              <Text style={styles.name} numberOfLines={1}>
                {entry.name}
              </Text>
              <IconButton
                tone="danger"
                icon={{ ios: "trash", android: "delete", web: "delete" }}
                accessibilityLabel={t.history.deleteExercise(entry.name)}
                onPress={() =>
                  setConfirmation({
                    kind: "deleteExercise",
                    workoutExerciseId: entry.id,
                    name: entry.name,
                  })
                }
              />
            </View>
            <ExerciseTracker
              workoutId={id}
              exercise={entry}
              trackingType={entry.summary.trackingType}
              onDeleteSet={(setId, number) =>
                setConfirmation({ kind: "deleteSet", setId, number })
              }
              onResetTimer={(setId, seconds) =>
                setConfirmation({ kind: "resetTimer", setId, seconds })
              }
            />
          </View>
        ))}
        <DashedButton
          icon={{ ios: "plus", android: "add", web: "add" }}
          label={t.history.addExercise}
          onPress={addExercise}
        />
        <Pressable
          style={({ pressed }) => [
            globalStyles.notPressedButton,
            styles.deleteWorkout,
            pressed && styles.deleteWorkoutPressed,
          ]}
          onPress={() => setConfirmation({ kind: "deleteWorkout" })}
          accessibilityRole="button"
        >
          <Text
            style={[
              globalStyles.notPressedButtonText,
              styles.deleteWorkoutText,
            ]}
          >
            {t.history.deleteWorkout}
          </Text>
        </Pressable>
      </ScrollView>
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
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
    exercise: {
      gap: spacing.sm,
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
    deleteWorkout: {
      alignItems: "center",
      borderColor: colors.danger,
    },
    deleteWorkoutPressed: {
      opacity: 0.7,
    },
    deleteWorkoutText: {
      color: colors.danger,
    },
  }),
);
