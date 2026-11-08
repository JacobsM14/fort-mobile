import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DayRow } from "@/components/history/day-row";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { toBodyWeightsByDay, useBodyWeights } from "@/features/body/queries";
import {
  useDailyExerciseCounts,
  useFirstWorkoutStart,
} from "@/features/workouts/queries";

import { earliestDate, getDaysBetween, toDateKey } from "@/utils/date";

import { spacing } from "@/constants/theme";

const PAGE_DAYS = 30;

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  const [today] = useState(() => new Date());
  const [pages, setPages] = useState(1);
  const y = today.getFullYear();
  const m = today.getMonth();
  const d = today.getDate();
  // From midnight PAGE_DAYS * pages days back up to the end of today.
  const from = new Date(y, m, d - PAGE_DAYS * pages + 1);
  const to = new Date(y, m, d + 1);
  const days = getDaysBetween(from, to);
  const dailyExerciseCounts = useDailyExerciseCounts(from, to);
  const { firstWorkoutStart } = useFirstWorkoutStart();
  const { entries } = useBodyWeights();
  const weightsByDay = toBodyWeightsByDay(entries);
  const firstLogged = earliestDate([firstWorkoutStart, entries.at(0)?.date]);
  const hasMore = firstLogged !== undefined && firstLogged < from;

  function loadMore() {
    if (hasMore) {
      setPages((count) => count + 1);
    }
  }

  return (
    <SafeAreaView style={globalStyles.modalScreen} edges={["top", "bottom"]}>
      <BackHeader backLabel={t.tabs.progress} title={t.history.title} />

      <FlatList
        data={days}
        keyExtractor={(day) => day.toDateString()}
        renderItem={({ item: day }) => {
          const count = dailyExerciseCounts.get(day.toDateString()) ?? 0;
          return (
            <DayRow
              day={day}
              exerciseCount={count}
              weightKg={weightsByDay.get(toDateKey(day))}
              onPress={() =>
                router.push({
                  pathname: "/history/day/[date]",
                  params: { date: toDateKey(day) },
                })
              }
            />
          );
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: {
    paddingBottom: spacing.lg,
  },
});
