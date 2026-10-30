import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AthleteTypeCard } from "@/components/profile/athlete-type-card";
import { GithubCalCard } from "@/components/profile/github-cal-card";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";

import { useFirstWeekday } from "@/hooks/use-first-weekday";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { lastWeekStarts } from "@/features/profile/athlete-type";
import { useAthleteType } from "@/features/profile/queries";

import type { IntensityLevel } from "@/features/profile/activity-calendar";

import { iconSizes, spacing } from "@/constants/theme";

// A little over 7 months.
const CALENDAR_WEEKS = 31;
const SAMPLE_SEED = 2026;

// A small seeded generator (mulberry32): the sample looks random but is the
// same on every render.
function seededRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let mixed = Math.imul(state ^ (state >>> 15), 1 | state);
    mixed = (mixed + Math.imul(mixed ^ (mixed >>> 7), 61 | mixed)) ^ mixed;
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

// Sample days to lay the calendar out with: a column per week, the oldest
// first, and null for the days of this week still to come. Some weeks are
// busy, some light and some off, and weekends are quieter. They aren't read
// from the workouts yet.
function sampleLevels(
  weeks: number,
  today: Date,
  firstWeekday: number,
): (IntensityLevel | null)[][] {
  const random = seededRandom(SAMPLE_SEED);
  const todayIndex = (today.getDay() - (firstWeekday - 1) + 7) % 7;
  return Array.from({ length: weeks }, (_, week) => {
    const off = random() < 0.15;
    const energy = off ? 0 : 0.35 + random() * 0.5;
    return Array.from({ length: 7 }, (_, day): IntensityLevel | null => {
      // Drawn for every day, so the days before don't change the later ones.
      const trains = random();
      const effort = random();
      if (week === weeks - 1 && day > todayIndex) {
        return null;
      }
      const weekday = (firstWeekday - 1 + day) % 7;
      const weekend = weekday === 0 || weekday === 6;
      if (trains >= (weekend ? energy / 2 : energy)) {
        return 0;
      }
      return effort < 0.25 ? 1 : effort < 0.55 ? 2 : effort < 0.8 ? 3 : 4;
    });
  });
}

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const openSettings = useFocusedPress(() => router.push("/settings"));
  const firstWeekday = useFirstWeekday();
  const { athleteType, loaded } = useAthleteType(firstWeekday);
  const today = new Date();

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
        {loaded &&
          (athleteType === null ? (
            <EmptyStateCard
              title={t.profile.athleteType.title}
              message={t.profile.athleteType.empty}
            />
          ) : (
            <AthleteTypeCard athleteType={athleteType} />
          ))}
        <GithubCalCard
          weekStarts={lastWeekStarts(today, firstWeekday, CALENDAR_WEEKS)}
          levels={sampleLevels(CALENDAR_WEEKS, today, firstWeekday)}
        />
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
