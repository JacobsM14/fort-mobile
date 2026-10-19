import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StartRoutineRow } from "@/components/today/start-routine-row";
import { WeekDays } from "@/components/today/week-days";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";
import { NumberedSteps } from "@/components/ui/content/numbered-steps";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";
import { spacing } from "@/constants/theme";
import { getRoutineMuscleGroups } from "@/features/routines/detail";
import {
  useRoutineList,
  type RoutineSummary,
} from "@/features/routines/queries";
import {
  finishWorkout,
  startWorkout,
  useActiveWorkout,
} from "@/features/workouts/queries";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { NEW_ROUTINE_ID } from "@/hooks/use-routine-draft";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { formatDayHeader } from "@/utils/date";

export default function TodayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { routines, loaded: routinesLoaded } = useRoutineList();
  const { activeWorkout, loaded: activeLoaded } = useActiveWorkout();

  const [pendingRoutine, setPendingRoutine] = useState<RoutineSummary>();
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

  function openWorkout(workoutId: string) {
    router.push({ pathname: "/workout/[id]", params: { id: workoutId } });
  }

  function startNewWorkout(routineId: string) {
    let workoutId: string;
    try {
      workoutId = startWorkout(routineId);
    } catch {
      Alert.alert(t.today.startError);
      return;
    }
    openWorkout(workoutId);
  }

  function start(routine: RoutineSummary) {
    if (activeWorkout === undefined) {
      startNewWorkout(routine.id);
    } else if (activeWorkout.routineId === routine.id) {
      openWorkout(activeWorkout.id);
    } else {
      setPendingRoutine(routine);
    }
  }

  function finishActiveAndStart(activeId: string, routineId: string) {
    setPendingRoutine(undefined);
    try {
      finishWorkout(activeId);
    } catch {
      Alert.alert(t.workout.finishError);
      return;
    }
    startNewWorkout(routineId);
  }

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
      {activeWorkout !== undefined && pendingRoutine !== undefined && (
        <ConfirmDialog
          visible
          title={t.today.activeTitle}
          message={t.today.activeMessage(
            activeWorkout.name ?? t.workout.title,
            pendingRoutine.name,
          )}
          confirmLabel={t.today.activeConfirm}
          cancelLabel={t.today.cancel}
          onConfirm={() =>
            finishActiveAndStart(activeWorkout.id, pendingRoutine.id)
          }
          onCancel={() => setPendingRoutine(undefined)}
        />
      )}
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
    alignSelf: "center",
  },
});
