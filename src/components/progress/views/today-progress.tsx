import { useState, type ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { WorkoutPicker } from "@/components/progress/today/workout-picker";
import { NoContentBox } from "@/components/ui/content/no-content-box";

import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useWorkoutHistory } from "@/features/workouts/queries";

import { formatShortDate } from "@/utils/date";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

type TodayProgressProps = {
  filter: ReactNode;
};

export function TodayProgress({ filter }: TodayProgressProps) {
  const { t, language } = useTranslation();
  const styles = useStyles();

  const now = new Date();
  const day = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const nextDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );

  const { workouts, loaded } = useWorkoutHistory({ from: day, to: nextDay });
  const [selectedId, setSelectedId] = useState<string>();
  const selectedWorkoutId = workouts.some((w) => w.id === selectedId)
    ? selectedId
    : workouts.at(0)?.id;

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {filter}
      {loaded && (
        <Text style={styles.title}>
          {formatShortDate(day, language)} ·{" "}
          {t.progress.workoutCount(workouts.length)}
        </Text>
      )}
      {workouts.length > 1 && (
        <WorkoutPicker
          workouts={workouts}
          selectedId={selectedWorkoutId}
          onSelect={setSelectedId}
        />
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
      flex: 1,
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
