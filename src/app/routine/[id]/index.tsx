import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import {
  Alert,
  Pressable,
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

import { DashedButton } from "@/components/ui/dashed-button";
import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { NoContentBox } from "@/components/ui/no-content-box";
import { PrimaryButton } from "@/components/ui/primary-button";
import { fontsJetBrainsMono, spacing } from "@/constants/theme";
import {
  getExerciseDetail,
  getExerciseInfo,
  getExerciseText,
  type ExerciseInfo,
} from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { createRoutine, updateRoutine } from "@/features/routines/queries";
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
  const { exercises } = useExerciseList();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const texts = routineId === null ? t.new_routine : t.edit_routine;

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
      Alert.alert(t.new_routine.saveError);
      return;
    }
    router.back();
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <View style={styles.header}>
        <Pressable
          style={globalStyles.breadCrumbPress}
          onPress={() => router.back()}
          hitSlop={spacing.sm}
          accessibilityRole="link"
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left",
            }}
            tintColor={colors.primary}
            size={22}
          />
          <Text style={globalStyles.breadCrumbText}>
            {t.new_routine.bread_crumb}
          </Text>
        </Pressable>
        <Text style={globalStyles.title}>{texts.title1}</Text>
        <Text style={globalStyles.title}>{texts.title2}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={globalStyles.formCage}>
          <Text style={globalStyles.inputLabel}>{t.new_routine.nameLabel}</Text>
          <TextInput
            style={globalStyles.boxInput}
            value={name}
            onChangeText={setName}
            placeholder={t.new_routine.namePlaceholder}
            placeholderTextColor={colors.disabled}
          />
        </View>
        <Animated.View style={globalStyles.formCage} layout={LAYOUT_TRANSITION}>
          <View style={styles.labelRow}>
            <Text style={globalStyles.inputLabel}>
              {t.new_routine.exercisesLabel} · {selectedExercises.length}
            </Text>
            <Text
              style={{
                fontFamily: fontsJetBrainsMono.medium,
                fontSize: 12,
                color: colors.disabled,
                letterSpacing: 0.08,
              }}
            >
              {t.new_routine.exercisesLabelSecondary}
            </Text>
          </View>
          {selectedExercises.length === 0 ? (
            <NoContentBox label={t.new_routine.no_content} />
          ) : (
            selectedExercises.map((exercise) => (
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
                  removeLabel={t.new_routine.removeExercise}
                  onRemove={() => removeExercise(exercise.id)}
                  infoLabel={t.exercises.showInfo}
                  onInfo={() => setInfo(getExerciseInfo(exercise, t))}
                />
              </Animated.View>
            ))
          )}
          <DashedButton
            tone="muted"
            label={t.new_routine.addExercise}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  header: {
    gap: spacing.xs,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
