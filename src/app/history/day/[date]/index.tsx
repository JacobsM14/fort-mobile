import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BodyWeightSheet } from "@/components/history/body-weight-sheet";
import { DayWeightButton } from "@/components/history/day-weight-button";
import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { BackHeader } from "@/components/ui/layout/back-header";
import { WorkoutCard } from "@/components/workout/summary/workout-card";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  bodyWeightOnDay,
  deleteBodyWeight,
  latestBodyWeightKg,
  saveBodyWeight,
  useBodyWeights,
} from "@/features/progress/queries";
import { useWorkoutHistory } from "@/features/workouts/queries";

import { formatDayHeader, parseDateKey } from "@/utils/date";

import { spacing } from "@/constants/theme";

export default function HistoryDayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  // "today" when opened from Today's week: going back closes the modal and
  // returns there instead of to the history list.
  const { date, from } = useLocalSearchParams<{
    date: string;
    from?: "today";
  }>();
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

  const { entries, loaded: weightsLoaded } = useBodyWeights();
  const weight = bodyWeightOnDay(entries, date);
  const [weightSheetOpen, setWeightSheetOpen] = useState(false);

  // The sheet stays open when it fails, so nothing typed is lost.
  function saveWeight(kg: number) {
    try {
      saveBodyWeight(day, kg);
    } catch {
      Alert.alert(t.progress.saveWeightError);
      return;
    }
    setWeightSheetOpen(false);
  }

  function deleteWeight() {
    try {
      deleteBodyWeight(day);
    } catch {
      Alert.alert(t.history.deleteError);
      return;
    }
    setWeightSheetOpen(false);
  }

  // A malformed link has no day to show.
  if (Number.isNaN(day.getTime())) {
    return null;
  }

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={from === "today" ? t.tabs.today : t.history.title}
        title={formatDayHeader(day, language)}
      />
      <View style={globalStyles.titledSection}>
        <Text style={globalStyles.subtitle}>{t.history.weight}</Text>
        {weightsLoaded && (
          <DayWeightButton
            weight={weight}
            onPress={() => setWeightSheetOpen(true)}
          />
        )}
      </View>
      <View style={[globalStyles.titledSection, styles.workouts]}>
        <Text style={globalStyles.subtitle}>{t.history.workouts}</Text>
        <FlatList
          data={workouts}
          keyExtractor={(workout) => workout.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            loaded ? <NoContentBox label={t.history.noWorkout} /> : undefined
          }
          ListFooterComponent={
            loaded ? (
              <DashedButton
                icon={{ ios: "plus", android: "add", web: "add" }}
                label={t.history.addRoutine}
                onPress={() =>
                  router.push({
                    pathname: "/history/day/[date]/add_routine",
                    params: { date },
                  })
                }
              />
            ) : undefined
          }
          renderItem={({ item }) => (
            <WorkoutCard
              workout={item}
              onPress={() =>
                // The workout in progress belongs to its own screen, with the
                // stopwatch, rests and notification.
                item.endedAt === null
                  ? router.push({
                      pathname: "/workout/[id]",
                      params: { id: item.id },
                    })
                  : router.push({
                      pathname: "/history/workout/[id]",
                      params: { id: item.id },
                    })
              }
            />
          )}
        />
      </View>
      <BodyWeightSheet
        visible={weightSheetOpen}
        onClose={() => setWeightSheetOpen(false)}
        day={day}
        initialKg={weight?.weightKg ?? latestBodyWeightKg(entries)}
        savedKg={weight?.weightKg}
        onSave={saveWeight}
        onDelete={deleteWeight}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  workouts: {
    flex: 1,
  },
  list: {
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
});
