import { StyleSheet, View } from "react-native";

import { ExerciseRow } from "@/components/progress/today/exercise-row";
import { SectionTitle } from "@/components/progress/today/section-title";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { TodayEntry } from "@/features/progress/today";

import { spacing } from "@/constants/theme";

type TodayExercisesProps = {
  entries: readonly TodayEntry[];
};

export function TodayExercises({ entries }: TodayExercisesProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  const maxSets = Math.max(...entries.map((entry) => entry.sets.length));

  return (
    <View>
      <SectionTitle label={t.progress.todayExercises} />
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
