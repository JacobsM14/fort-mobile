import { router } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DayRow } from "@/components/history/day-row";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useDailyExerciseCounts } from "@/features/workouts/queries";

import { getDaysBetween, toDateKey } from "@/utils/date";

import { spacing } from "@/constants/theme";

export default function HistoryScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  const [range] = useState(() => {
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth();
    const d = now.getDate();
    return {
      from: new Date(y, m, d - 29), // 30 days back, from midnight
      to: new Date(y, m, d + 1), // up to the end of today
    };
  });
  const days = getDaysBetween(range.from, range.to);
  const dailyExerciseCounts = useDailyExerciseCounts(range.from, range.to);

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
              onPress={() =>
                router.push({
                  pathname: "/history/day/[date]",
                  params: { date: toDateKey(day) },
                })
              }
            />
          );
        }}
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
