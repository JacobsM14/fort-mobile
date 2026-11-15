import { StyleSheet, Text, View } from "react-native";

import { ExerciseRow } from "@/components/progress/today/exercise-row";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { TodayEntry } from "@/features/progress/today";

import { spacing } from "@/constants/theme";

type TodayExercisesProps = {
  entries: readonly TodayEntry[];
};

export function TodayExercises({ entries }: TodayExercisesProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  if (entries.length === 0) {
    return null;
  }

  const maxSets = Math.max(...entries.map((entry) => entry.sets.length));

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{t.progress.todayExercises}</Text>
      <View style={styles.exercisesContainer}>
        {entries.map((entry) => (
          <ExerciseRow key={entry.id} entry={entry} maxSets={maxSets} />
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    exercisesContainer: {
      gap: spacing.sm,
    },
  }),
);
