import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { spacing } from "@/constants/theme";
import {
  getExerciseDetail,
  getExerciseInfo,
  getExerciseText,
  type ExerciseInfo,
} from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import {
  createRoutine,
  deleteRoutine,
  ROUTINE_NAME_MAX_LENGTH,
  updateRoutine,
} from "@/features/routines/queries";
import { NEW_ROUTINE_ID, useRoutineDraft } from "@/hooks/use-routine-draft";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

const TRANSITION_MS = 300;
const LAYOUT_TRANSITION = LinearTransition.duration(TRANSITION_MS).easing(
  Easing.inOut(Easing.ease),
);

export default function RoutineFormScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const { routineId, name, setName, exerciseIds, setExerciseIds } =
    useRoutineDraft();
  const { exercises, loaded } = useExerciseList();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const texts = routineId === null ? t.newRoutine : t.editRoutine;

  function removeExercise(id: string) {
    setExerciseIds((current) =>
      current.filter((exerciseId) => exerciseId !== id),
    );
  }

  const selectedExercises = exerciseIds
    .map((id) => exercises.find((exercise) => exercise.id === id))
    .filter((exercise) => exercise !== undefined);

  const canSave = name.trim() !== "" && selectedExercises.length > 0;

  function saveRoutine() {
    const input = {
      name,
      exerciseIds: selectedExercises.map((exercise) => exercise.id),
    };
    try {
      if (routineId === null) {
        createRoutine(input);
      } else {
        updateRoutine(routineId, input);
      }
    } catch {
      Alert.alert(t.newRoutine.saveError);
      return;
    }
    router.back();
  }

  function removeRoutine(id: string) {
    setConfirmingDelete(false);
    try {
      deleteRoutine(id);
    } catch {
      Alert.alert(t.editRoutine.deleteError);
      return;
    }
    router.back();
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={t.newRoutine.breadCrumb}
        title={[texts.title1, texts.title2]}
        action={
          routineId !== null && (
            <IconButton
              tone="danger"
              icon={{ ios: "trash", android: "delete", web: "delete" }}
              accessibilityLabel={t.editRoutine.delete}
              onPress={() => setConfirmingDelete(true)}
            />
          )
        }
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.formCage}>
          <View style={styles.labelRow}>
            <Text style={globalStyles.inputLabel}>
              {t.newRoutine.nameLabel}
            </Text>
            <Text style={globalStyles.inputLabel}>
              {name.length}/{ROUTINE_NAME_MAX_LENGTH}
            </Text>
          </View>
          <TextInput
            style={globalStyles.boxInput}
            value={name}
            onChangeText={setName}
            maxLength={ROUTINE_NAME_MAX_LENGTH}
            placeholder={t.newRoutine.namePlaceholder}
            placeholderTextColor={colors.disabled}
          />
        </View>
        <Animated.View style={globalStyles.formCage} layout={LAYOUT_TRANSITION}>
          <Text style={globalStyles.inputLabel}>
            {t.newRoutine.exercisesLabel} · {selectedExercises.length}
          </Text>
          {loaded && selectedExercises.length === 0 && (
            <NoContentBox label={t.newRoutine.noContent} />
          )}
          {selectedExercises.map((exercise) => (
            <Animated.View
              key={exercise.id}
              entering={FadeIn.duration(TRANSITION_MS)}
              exiting={FadeOut.duration(TRANSITION_MS)}
              layout={LAYOUT_TRANSITION}
            >
              <ExerciseRow
                name={getExerciseText(exercise, t).name}
                detail={getExerciseDetail(exercise, t)}
                trackingType={exercise.trackingType}
                removeLabel={t.newRoutine.removeExercise}
                onRemove={() => removeExercise(exercise.id)}
                infoLabel={t.exercises.showInfo}
                onInfo={() => setInfo(getExerciseInfo(exercise, t))}
              />
            </Animated.View>
          ))}
          <DashedButton
            tone="muted"
            label={t.newRoutine.addExercise}
            onPress={() =>
              router.push({
                pathname: "/routine/[id]/new_exercises",
                params: { id: routineId ?? NEW_ROUTINE_ID },
              })
            }
          />
          <PrimaryButton
            label={texts.primaryButton}
            onPress={saveRoutine}
            disabled={!canSave}
          />
        </Animated.View>
      </ScrollView>
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
      {routineId !== null && (
        <ConfirmDialog
          visible={confirmingDelete}
          tone="danger"
          title={t.editRoutine.deleteTitle}
          message={t.editRoutine.deleteMessage}
          confirmLabel={t.editRoutine.deleteConfirm}
          cancelLabel={t.editRoutine.cancel}
          onConfirm={() => removeRoutine(routineId)}
          onCancel={() => setConfirmingDelete(false)}
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
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
