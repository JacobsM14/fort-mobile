import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NoContentBox } from "@/components/ui/content/no-content-box";
import { ExerciseSummary } from "@/components/workout/summary/exercise-summary";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { useWorkoutHistory } from "@/features/workouts/queries";

import { formatDateTime } from "@/utils/date";
import { formatDuration } from "@/utils/duration";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

export default function ProgressScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const { workouts, loaded: workoutsLoaded } = useWorkoutHistory();
  const { exercises, loaded: exercisesLoaded } = useExerciseList();
  const loaded = workoutsLoaded && exercisesLoaded;
  const exercisesById = new Map(
    exercises.map((exercise) => [exercise.id, exercise] as const),
  );

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View>
        <Text style={globalStyles.subtitle}>{t.progress.history}</Text>
        <Text style={globalStyles.title}>{t.tabs.progress}</Text>
      </View>
      <FlatList
        data={workouts}
        keyExtractor={(workout) => workout.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? <NoContentBox label={t.progress.noContent} /> : null
        }
        renderItem={({ item }) => {
          const inProgress = item.endedAt === null;
          return (
            <View style={[globalStyles.card, styles.card]}>
              {inProgress && (
                <Text style={[globalStyles.inputLabel, styles.status]}>
                  {t.progress.inProgress}
                </Text>
              )}
              <Text style={styles.name} numberOfLines={1}>
                {item.name ?? t.workout.title}
              </Text>
              <Text style={styles.detail}>
                {[
                  formatDateTime(item.startedAt, language),
                  item.endedAt === null
                    ? null
                    : formatDuration(
                        (item.endedAt.getTime() - item.startedAt.getTime()) /
                          1000,
                      ),
                ]
                  .filter((part) => part !== null)
                  .join(" · ")}
              </Text>
              <Text style={styles.detail}>
                {t.progress.summary(item.exercises.length, item.setCount)}
              </Text>
              {item.exercises.map((entry) => {
                // Exercises deleted since are archived and no longer listed.
                const exercise = exercisesById.get(entry.exerciseId);
                if (exercise === undefined) {
                  return null;
                }
                return (
                  <ExerciseSummary
                    key={entry.id}
                    name={getExerciseText(exercise, t).name}
                    trackingType={exercise.trackingType}
                    sets={entry.sets}
                  />
                );
              })}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: {
      paddingBottom: 0,
    },
    list: {
      gap: spacing.sm,
      paddingBottom: spacing.lg,
    },
    // The card style is a row; here each line stacks.
    card: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: spacing.xs,
    },
    status: {
      color: colors.primary,
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
