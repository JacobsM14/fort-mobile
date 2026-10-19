import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StartRoutineRow } from "@/components/today/start-routine-row";
import { WeekDays } from "@/components/today/week-days";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";
import { NumberedSteps } from "@/components/ui/content/numbered-steps";
import { spacing } from "@/constants/theme";
import { getRoutineMuscleGroups } from "@/features/routines/detail";
import { useRoutineList } from "@/features/routines/queries";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { NEW_ROUTINE_ID } from "@/hooks/use-routine-draft";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { formatDayHeader } from "@/utils/date";

export default function TodayScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { routines, loaded } = useRoutineList();
  const manageRoutines = useFocusedPress(() => router.navigate("/routines"));

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
              {routines.map((routine) => (
                <StartRoutineRow
                  key={routine.id}
                  name={routine.name}
                  muscles={getRoutineMuscleGroups(routine, t)}
                  trackingTypes={routine.trackingTypes}
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
