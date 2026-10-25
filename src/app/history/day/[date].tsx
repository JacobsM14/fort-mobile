import { router, useLocalSearchParams } from "expo-router";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import { WorkoutCard } from "@/components/workout/summary/workout-card";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useWorkoutHistory } from "@/features/workouts/queries";

import { formatDayHeader, parseDateKey } from "@/utils/date";

import { spacing } from "@/constants/theme";

export default function HistoryDayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const day = parseDateKey(date);
  const nextDay = new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate() + 1,
  );
  const { workouts, loaded } = useWorkoutHistory({
    from: day,
    to: nextDay,
  });

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={t.history.title}
        title={formatDayHeader(day, language)}
      />
      <FlatList
        data={workouts}
        keyExtractor={(workout) => workout.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? <NoContentBox label={t.history.noWorkout} /> : undefined
        }
        renderItem={({ item }) => (
          <WorkoutCard
            workout={item}

            onPress={() =>
              router.push({
                pathname: "/history/workout/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
