import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseForm } from "@/components/exercises/exercise-form";
import { BackHeader } from "@/components/ui/layout/back-header";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { IconButton } from "@/components/ui/buttons/icon-button";
import {
  countRoutinesWithExercise,
  deleteExercise,
  updateExercise,
  useExerciseList,
  type ExerciseInput,
  type ExerciseSummary,
} from "@/features/exercises/queries";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function EditExerciseScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { exercises } = useExerciseList();
  // null while the delete dialog is closed; otherwise, how many routines the
  // exercise would be taken out of.
  const [routinesUsingIt, setRoutinesUsingIt] = useState<number | null>(null);
  // Kept from the first time the exercise is found: the form only reads its
  // initial values, and after deleting it the screen still shows it while it
  // closes instead of going blank.
  const [exercise, setExercise] = useState<ExerciseSummary>();

  // Only user exercises can be edited: catalog ones belong to the app.
  const found = exercises.find(
    (candidate) => candidate.id === id && candidate.key === null,
  );
  if (exercise === undefined && found !== undefined) {
    setExercise(found);
  }

  if (exercise === undefined) {
    return null;
  }

  function saveExercise(input: ExerciseInput) {
    try {
      updateExercise(id, input);
    } catch {
      Alert.alert(t.exercises.saveError);
      return;
    }
    router.back();
  }

  function removeExercise() {
    setRoutinesUsingIt(null);
    try {
      deleteExercise(id);
    } catch {
      Alert.alert(t.editExercise.deleteError);
      return;
    }
    router.back();
  }

  return (
    <SafeAreaView
      style={[globalStyles.screen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={t.settings.sections.exercises}
        title={[t.editExercise.title1, t.editExercise.title2]}
        action={
          <IconButton
            tone="danger"
            icon={{ ios: "trash", android: "delete", web: "delete" }}
            accessibilityLabel={t.editExercise.delete}
            onPress={() => setRoutinesUsingIt(countRoutinesWithExercise(id))}
          />
        }
      />
      <ExerciseForm
        initial={{
          name: exercise.name ?? "",
          description: exercise.description ?? "",
          trackingType: exercise.trackingType,
          equipment: exercise.equipment,
          primaryMuscles: exercise.primaryMuscles,
        }}
        submitLabel={t.editExercise.primaryButton}
        onSubmit={saveExercise}
      />
      <ConfirmDialog
        visible={routinesUsingIt !== null}
        tone="danger"
        title={t.editExercise.deleteTitle}
        message={t.editExercise.deleteMessage(routinesUsingIt ?? 0)}
        confirmLabel={t.editExercise.deleteConfirm}
        cancelLabel={t.editExercise.cancel}
        onConfirm={removeExercise}
        onCancel={() => setRoutinesUsingIt(null)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
});
