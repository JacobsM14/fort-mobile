import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NoContentBox } from "@/components/ui/content/no-content-box";
import { WorkoutCard } from "@/components/workout/summary/workout-card";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useWorkoutHistory } from "@/features/workouts/queries";

import { iconSizes, spacing } from "@/constants/theme";

export default function ProgressScreen() {
  const { t } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const { workouts, loaded } = useWorkoutHistory();

  const openHistory = useFocusedPress(() => router.push("/history"));

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.progress}</Text>
        <Pressable
          onPress={openHistory}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.history.title}
        >
          {({ pressed }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "calendar_check",
                web: "calendar_check",
              }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.xl}
            />
          )}
        </Pressable>
      </View>
      <FlatList
        data={workouts}
        keyExtractor={(workout) => workout.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loaded ? <NoContentBox label={t.progress.noContent} /> : undefined
        }
        renderItem={({ item }) => <WorkoutCard workout={item} />}
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
