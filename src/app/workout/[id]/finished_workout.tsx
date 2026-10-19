import { Image } from "expo-image";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { CornerFrame } from "@/components/ui/layout/corner-frame";
import { ExerciseSummary } from "@/components/workout/summary/exercise-summary";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useWorkoutSession } from "@/hooks/use-workout-session";
import { useTranslation } from "@/i18n";

import { useWorkoutEntries } from "@/features/workouts/entries";

import { formatDuration } from "@/utils/duration";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const ICON_BOX_SIZE = 128;
const TEXT_DELAY_MS = 150;

export default function FinishedWorkoutScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const { workoutId } = useWorkoutSession();
  const { title, found, entries, startedAt, endedAt, loaded } =
    useWorkoutEntries(workoutId);
  const close = useFocusedPress(() => router.back());
  const seeProgress = useFocusedPress(() => router.dismissTo("/progress"));

  if (!loaded || !found) {
    return null;
  }

  const setCount = entries.reduce(
    (count, entry) => count + entry.sets.length,
    0,
  );
  const stats = [
    {
      label: t.finished.duration,
      value:
        startedAt === undefined || endedAt === undefined
          ? "-"
          : formatDuration((endedAt.getTime() - startedAt.getTime()) / 1000),
    },
    { label: t.finished.exercises, value: String(entries.length) },
    { label: t.finished.sets, value: String(setCount) },
  ];

  return (
    <SafeAreaView
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <Animated.View entering={ZoomIn.springify()}>
            <CornerFrame>
              <View style={styles.iconBox}>
                <Image
                  source={require("@/assets/images/biceps.png")}
                  style={styles.icon}
                  tintColor={colors.primary}
                  accessibilityIgnoresInvertColors
                />
              </View>
            </CornerFrame>
          </Animated.View>
          <Animated.View
            style={styles.heading}
            entering={FadeInDown.delay(TEXT_DELAY_MS)}
          >
            <Text style={[globalStyles.inputLabel, styles.routine]}>
              {title}
            </Text>
            <Text style={[globalStyles.title, styles.centered]}>
              {t.finished.title}
            </Text>
            <Text style={styles.subtitle}>{t.finished.subtitle}</Text>
          </Animated.View>
        </View>
        <Animated.View
          style={styles.stats}
          entering={FadeInDown.delay(TEXT_DELAY_MS * 2)}
        >
          {stats.map((stat) => (
            <View key={stat.label} style={[globalStyles.card, styles.stat]}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={[globalStyles.inputLabel, styles.statLabel]}>
                {stat.label}
              </Text>
            </View>
          ))}
        </Animated.View>
        <Animated.View
          style={[globalStyles.card, styles.summary]}
          entering={FadeInDown.delay(TEXT_DELAY_MS * 3)}
        >
          <Text style={globalStyles.inputLabel}>{t.finished.summary}</Text>
          {entries.map((entry) => (
            <ExerciseSummary
              key={entry.id}
              name={entry.name}
              trackingType={entry.summary.trackingType}
              sets={entry.sets}
            />
          ))}
        </Animated.View>
      </ScrollView>
      <View style={styles.footer}>
        <PrimaryButton label={t.finished.seeProgress} onPress={seeProgress} />
        <Pressable
          style={[globalStyles.breadCrumbPress, styles.close]}
          onPress={close}
          accessibilityRole="button"
        >
          <Text style={globalStyles.breadCrumbText}>{t.finished.close}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    screen: {
      paddingBottom: 0,
    },
    content: {
      gap: spacing.lg,
      paddingVertical: spacing.lg,
    },
    hero: {
      alignItems: "center",
      gap: spacing.lg,
    },
    iconBox: {
      width: ICON_BOX_SIZE,
      height: ICON_BOX_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
      backgroundColor: colors.primaryTint,
    },
    icon: {
      width: iconSizes.hero,
      height: iconSizes.hero,
    },
    heading: {
      alignItems: "center",
      gap: spacing.xs,
    },
    routine: {
      color: colors.primary,
    },
    centered: {
      textAlign: "center",
    },
    subtitle: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    statLabel: {
      textAlign: "center",
      fontSize: fontSizes.lowFont,
    },
    stats: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    // The card style is a row; each stat stacks its value over its label.
    stat: {
      flex: 1,
      flexDirection: "column",
      gap: spacing.xs,
    },
    statValue: {
      fontSize: fontSizes.lead,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
    summary: {
      flexDirection: "column",
      alignItems: "stretch",
      gap: spacing.sm,
    },
    footer: {
      paddingVertical: spacing.sm,
    },
    close: {
      alignSelf: "center",
    },
  }),
);
