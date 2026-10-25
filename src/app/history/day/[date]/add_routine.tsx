import { router, useLocalSearchParams } from "expo-router";
import { Alert, FlatList, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NavCard } from "@/components/ui/content/nav-card";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getRoutineMuscleGroups } from "@/features/routines/detail";
import { useRoutineList } from "@/features/routines/queries";
import { logWorkout } from "@/features/workouts/queries";

import { formatDayHeader, parseDateKey } from "@/utils/date";

import { spacing } from "@/constants/theme";

// Logs a routine done on this day: the workout is created already finished
// and opens in the editor to fill in its sets.
export default function AddRoutineScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { date } = useLocalSearchParams<{ date: string }>();
  const day = parseDateKey(date);
  const { routines, loaded } = useRoutineList();

  function addRoutine(routineId: string) {
    // At the current time of day, so today's lands at now and several logged
    // on the same day keep the order they were added in.
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
      workoutId = logWorkout(routineId, startedAt);
    } catch {
      Alert.alert(t.history.logError);
      return;
    }
    router.replace({
      pathname: "/history/workout/[id]",
      params: { id: workoutId },
    });
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={formatDayHeader(day, language)}
        title={t.history.chooseRoutine}
      />
      <FlatList
        data={routines}
        keyExtractor={(routine) => routine.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? <NoContentBox label={t.routines.noContent} /> : undefined
        }
        renderItem={({ item }) => (
          <NavCard
            title={item.name}
            detail={getRoutineMuscleGroups(item, t)}
            onPress={() => addRoutine(item.id)}
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
