import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StartRoutineRow } from "@/components/today/start-routine-row";
import { WeekDays } from "@/components/today/week-days";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";
import { NumberedSteps } from "@/components/ui/content/numbered-steps";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { NEW_ROUTINE_ID } from "@/hooks/use-routine-draft";
import { useStartRoutine } from "@/hooks/use-start-routine";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getRoutineMuscleGroups } from "@/features/routines/detail";
import { useRoutineList } from "@/features/routines/queries";

import { formatDayHeader } from "@/utils/date";

import { spacing } from "@/constants/theme";

function openWorkout(workoutId: string) {
  router.push({ pathname: "/workout/[id]", params: { id: workoutId } });
}

export default function TodayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { routines, loaded: routinesLoaded } = useRoutineList();
  const {
    activeWorkout,
    loaded: activeLoaded,
    start,
    confirmDialog,
  } = useStartRoutine(openWorkout);

  const manageRoutines = useFocusedPress(() => router.navigate("/routines"));

  const loaded = routinesLoaded && activeLoaded;
  const activeRoutineId = activeWorkout?.routineId ?? null;
  // A workout whose routine was deleted while it ran has no routine row, so
  // it gets its own to be continued from.
  const orphanWorkout = routines.some(
    (routine) => routine.id === activeRoutineId,
  )
    ? undefined
    : activeWorkout;

  const orderedRoutines = [
    ...routines.filter((routine) => routine.id === activeRoutineId),
    ...routines.filter((routine) => routine.id !== activeRoutineId),
  ];

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View>
        <Text style={globalStyles.subtitle}>
          {formatDayHeader(new Date(), language)}
        </Text>
        <Text style={globalStyles.title}>{t.today.title}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <WeekDays />
        {loaded && orphanWorkout !== undefined && (
          <StartRoutineRow
            name={orphanWorkout.name ?? t.workout.title}
            muscles=""
            trackingTypes={[]}
            active
            onStart={() => openWorkout(orphanWorkout.id)}
          />
        )}
        {loaded &&
          (routines.length === 0 ? (
            <>
              <EmptyStateCard
                title={t.today.emptyTitle}
                message={t.today.emptyMessage}
                actionLabel={t.today.emptyAction}
                onAction={() =>
                  router.push({
                    pathname: "/routine/[id]",
                    params: { id: NEW_ROUTINE_ID },
                  })
                }
              />
              <NumberedSteps title={t.today.howItWorks} steps={t.today.steps} />
            </>
          ) : (
            <View style={styles.routines}>
              <Text style={globalStyles.subtitle}>{t.today.pickRoutine}</Text>
              {orderedRoutines.map((routine) => (
                <StartRoutineRow
                  key={routine.id}
                  name={routine.name}
                  muscles={getRoutineMuscleGroups(routine, t)}
                  trackingTypes={routine.trackingTypes}
                  active={routine.id === activeRoutineId}
                  onStart={() => start(routine)}
                />
              ))}
              <Pressable
                style={[globalStyles.breadCrumbPress, styles.manage]}
                onPress={manageRoutines}
                accessibilityRole="link"
              >
                <Text style={globalStyles.breadCrumbText}>
                  {t.today.manageRoutines}
                </Text>
              </Pressable>
            </View>
          ))}
      </ScrollView>
      {confirmDialog}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
  routines: {
    gap: spacing.sm,
  },
  manage: {
    alignSelf: "flex-start",
  },
});
