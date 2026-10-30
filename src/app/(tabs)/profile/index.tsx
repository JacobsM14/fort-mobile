import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AthleteTypeCard } from "@/components/profile/athlete-type-card";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { AthleteType } from "@/features/profile/athlete-type";
import type { Translations } from "@/i18n/es";

import { iconSizes, spacing } from "@/constants/theme";

// Sample data to lay the block out with: it isn't worked out from the
// workouts yet.
function sampleAthleteType(t: Translations): AthleteType {
  return {
    style: "strength",
    frequentExercises: [
      {
        id: "bench_press",
        name: t.exerciseCatalog.bench_press.name,
        trackingType: "weight_reps",
        workoutCount: 18,
      },
      {
        id: "back_squat",
        name: t.exerciseCatalog.back_squat.name,
        trackingType: "weight_reps",
        workoutCount: 15,
      },
      {
        id: "pull_up",
        name: t.exerciseCatalog.pull_up.name,
        trackingType: "bodyweight_reps",
        workoutCount: 9,
      },
    ],
    weeklySessions: [3, 4, 3, 4, 2, 0, 3, 4, 4, 3, 5, 2],
  };
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const openSettings = useFocusedPress(() => router.push("/settings"));

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.profile}</Text>
        <Pressable
          onPress={openSettings}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.settings.title}
        >
          {({ pressed }) => (
            <SymbolView
              name={{
                ios: "gearshape",
                android: "settings",
                web: "settings",
              }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.xl}
            />
          )}
        </Pressable>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <AthleteTypeCard athleteType={sampleAthleteType(t)} />
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
});
