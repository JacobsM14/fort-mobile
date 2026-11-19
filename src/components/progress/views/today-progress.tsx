import { useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { TodayExercises } from "@/components/progress/today/today-exercises";
import { TodayMuscles } from "@/components/progress/today/today-muscles";
import { WorkoutPicker } from "@/components/progress/today/workout-picker";
import { WorkoutStats } from "@/components/progress/today/workout-stats";
import { NoContentBox } from "@/components/ui/content/no-content-box";

import { makeStyles } from "@/hooks/use-theme";
import { useToday } from "@/hooks/use-today";
import { useTranslation } from "@/i18n";

import {
  formatWorkoutDuration,
  useTodayEntries,
} from "@/features/progress/today";
import {
  isFinishedWorkout,
  useWorkoutHistory,
} from "@/features/workouts/queries";

import { formatShortDate } from "@/utils/date";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

type TodayProgressProps = {
  filter: ReactNode;
};

export function TodayProgress({ filter }: TodayProgressProps) {
  const { t, language } = useTranslation();
  const styles = useStyles();

  const day = useToday();
  const nextDay = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate() + 1,
  );

  const history = useWorkoutHistory({ from: day, to: nextDay });

  const workouts = history.workouts.filter(isFinishedWorkout);
  const [selectedId, setSelectedId] = useState<string>();

  const selectedWorkout =
    workouts.find((w) => w.id === selectedId) ?? workouts.at(0);

  const { entries, loaded: entriesLoaded } = useTodayEntries(selectedWorkout);
  const loaded = history.loaded && entriesLoaded;

  const exercisesCount = entries.length;
  const setsCount = entries.reduce(
    (count, entry) => count + entry.sets.length,
    0,
  );

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {filter}
      {loaded && (
        <Text style={styles.title}>
          {formatShortDate(day, language)} ·{" "}
          {workouts.length === 1
            ? (workouts[0].name ?? t.workout.title)
            : t.progress.workoutCount(workouts.length)}
        </Text>
      )}
      {workouts.length > 1 && (
        <WorkoutPicker
          workouts={workouts}
          selectedId={selectedWorkout?.id}
          onSelect={setSelectedId}
        />
      )}
      {loaded && selectedWorkout && (
        <>
          <WorkoutStats
            duration={formatWorkoutDuration(selectedWorkout, t)}
            exercisesCount={exercisesCount}
            setsCount={setsCount}
          />
          <TodayMuscles entries={entries} />
          <TodayExercises entries={entries} />
        </>
      )}
      {!workouts.length && loaded && (
        <View style={styles.noContentBox}>
          <NoContentBox label={t.progress.noWorkoutToday} fill />
        </View>
      )}
    </ScrollView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
      flexGrow: 1,
    },
    title: {
      fontSize: fontSizes.overline,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
      textTransform: "uppercase",
    },
    noContentBox: {
      flex: 1,
    },
  }),
);
