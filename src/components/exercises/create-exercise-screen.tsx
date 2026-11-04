import { router } from "expo-router";
import { Alert, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseForm } from "@/components/exercises/exercise-form";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  createExercise,
  type ExerciseInput,
} from "@/features/exercises/queries";

type CreateExerciseScreenProps = {
  backLabel: string;
  // Each modal keeps the padding of the screens around it.
  screenStyle: "screen" | "modalScreen";
  onCreated?: (exerciseId: string) => void;
};

export function CreateExerciseScreen({
  backLabel,
  screenStyle,
  onCreated,
}: CreateExerciseScreenProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  function saveExercise(input: ExerciseInput) {
    let exerciseId: string;
    try {
      exerciseId = createExercise(input);
    } catch {
      Alert.alert(t.exercises.saveError);
      return;
    }
    onCreated?.(exerciseId);
    router.back();
  }

  return (
    <SafeAreaView
      style={[globalStyles[screenStyle], styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={backLabel}
        title={[t.newCustomExercise.title1, t.newCustomExercise.title2]}
      />
      <ExerciseForm
        submitLabel={t.newCustomExercise.primaryButton}
        onSubmit={saveExercise}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
});
