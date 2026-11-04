import { router } from "expo-router";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IconButton } from "@/components/ui/buttons/icon-button";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";
import { NavCard } from "@/components/ui/content/nav-card";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  getExerciseDetail,
  getExerciseText,
} from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";

import { spacing } from "@/constants/theme";

export default function ExercisesScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { exercises, loaded } = useExerciseList();

  const collator = new Intl.Collator(language);
  const customExercises = exercises
    .filter((exercise) => exercise.key === null)
    .map((exercise) => ({
      ...exercise,
      label: getExerciseText(exercise, t).name,
    }))
    .sort((a, b) => collator.compare(a.label, b.label));

  function openNewExercise() {
    router.push("/settings/exercise/new");
  }

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.exercises}
        action={
          <IconButton
            icon={{ ios: "plus", android: "add", web: "add" }}
            accessibilityLabel={t.manageExercises.add}
            onPress={openNewExercise}
          />
        }
      />
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {loaded && customExercises.length === 0 ? (
          <EmptyStateCard
            title={t.manageExercises.emptyTitle}
            message={t.manageExercises.emptyMessage}
            actionLabel={t.manageExercises.add}
            onAction={openNewExercise}
          />
        ) : (
          customExercises.map((exercise) => (
            <NavCard
              key={exercise.id}
              title={exercise.label}
              detail={getExerciseDetail(exercise, t)}
              onPress={() =>
                router.push({
                  pathname: "/settings/exercise/[id]",
                  params: { id: exercise.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
