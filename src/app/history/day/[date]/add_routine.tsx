import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { NavCard } from "@/components/ui/content/nav-card";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";

import { NEW_ROUTINE_ID } from "@/hooks/use-routine-draft";
import { useStartRoutine } from "@/hooks/use-start-routine";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getRoutineMuscleGroups } from "@/features/routines/detail";
import {
  useRoutineList,
  type RoutineSummary,
} from "@/features/routines/queries";
import { logWorkout } from "@/features/workouts/queries";

import {
  formatDayHeader,
  isDateKey,
  parseDateKey,
  toDateKey,
} from "@/utils/date";

import { spacing } from "@/constants/theme";

// The workout replaces the whole history modal, so closing it goes back to
// the tabs, as when it is started from Today.
function openWorkout(workoutId: string) {
  router.replace({ pathname: "/workout/[id]", params: { id: workoutId } });
}

// On a past day, logs a routine already done: the workout is created
// finished and opens in the editor to fill in its sets. Today, the routine is
// started instead, the same as from Today.
export default function AddRoutineScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const day = parseDateKey(date);
  const { routines, loaded } = useRoutineList();
  const { start, confirmDialog } = useStartRoutine(openWorkout);
  // A malformed link has no day to log to. The key is checked, not the date:
  // "2026-13-45" still parses, rolled over to another day.
  const validDay = isDateKey(date);
  const isToday = date === toDateKey(new Date());

  function addRoutine(routine: RoutineSummary) {
    if (isToday) {
      start(routine);
      return;
    }
    // At the current time of day, so several logged on the same day keep the
    // order they were added in.
    const now = new Date();
    const startedAt = new Date(
      day.getFullYear(),
      day.getMonth(),
      day.getDate(),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );
    let workoutId: string;
    try {
      workoutId = logWorkout(routine.id, startedAt);
    } catch {
      Alert.alert(t.history.logError);
      return;
    }
    router.replace({
      pathname: "/history/workout/[id]",
      params: { id: workoutId },
    });
  }

  if (!validDay) {
    return null;
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={formatDayHeader(day, language)}
        title={isToday ? t.today.pickRoutine : t.history.chooseRoutine}
      />
      <FlatList
        data={routines}
        keyExtractor={(routine) => routine.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? (
            <>
              <NoContentBox label={t.routines.noContent} />
              <PrimaryButton
                label={t.routines.add}
                onPress={() =>
                  router.push({
                    pathname: "/routine/[id]",
                    params: { id: NEW_ROUTINE_ID },
                  })
                }
              />
            </>
          ) : undefined
        }
        renderItem={({ item }) => (
          <NavCard
            title={item.name}
            detail={getRoutineMuscleGroups(item, t)}
            onPress={() => addRoutine(item)}
          />
        )}
      />
      {confirmDialog}
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
