import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
import {
  averageSessions,
  CONSISTENCY_LEVELS,
  consistencyLevel,
  LEVEL_SESSIONS,
  nextConsistencyLevel,
  UNSTOPPABLE_WEEKS,
} from "@/features/profile/athlete-type";

import type {
  AthleteType,
  ConsistencyLevel,
} from "@/features/profile/athlete-type";
import type { Translations } from "@/i18n/es";

import { formatDecimal, roundToTenth } from "@/utils/number";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";
import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";

const EXERCISE_BAR_HEIGHT = 6;
const PILL_HEIGHT = 8;

type AthleteTypeCardProps = {
  athleteType: AthleteType;
};

// The kind of athlete the user is, with what it comes from: the exercises done
// most and how consistent the weeks are.
export function AthleteTypeCard({ athleteType }: AthleteTypeCardProps) {
  const { t, language } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const texts = t.profile.athleteType;
  const { style, frequentExercises, weeklySessions } = athleteType;

  const average = formatDecimal(
    roundToTenth(averageSessions(weeklySessions)),
    language,
  );
  const level = consistencyLevel(weeklySessions);
  const levelIndex = CONSISTENCY_LEVELS.indexOf(level);
  const maxWorkouts = Math.max(
    1,
    ...frequentExercises.map((exercise) => exercise.workoutCount),
  );

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{texts.title}</Text>
      <View style={[globalStyles.panel, styles.panel]}>
        <View style={styles.identity}>
          <Text style={styles.name}>{texts.styles[style].name}</Text>
          <Text style={styles.description}>
            {texts.styles[style].description}
          </Text>
        </View>
        <View style={styles.section}>
          <Text style={globalStyles.inputLabel}>{texts.frequentExercises}</Text>
          {frequentExercises.map((exercise) => {
            const name = getExerciseText(exercise, t).name;
            const count = texts.workoutCount(exercise.workoutCount);
            return (
              <View
                key={exercise.id}
                style={styles.exercise}
                accessible
                accessibilityLabel={`${name}, ${count}`}
              >
                <SymbolView
                  name={TRACKING_TYPE_ICONS[exercise.trackingType]}
                  tintColor={colors.text}
                  size={iconSizes.md}
                />
                <View style={styles.exerciseInfo}>
                  <View style={styles.exerciseText}>
                    <Text style={styles.exerciseName} numberOfLines={1}>
                      {name}
                    </Text>
                    <Text style={styles.count}>{count}</Text>
                  </View>
                  <View
                    style={[
                      styles.exerciseBar,
                      {
                        width: `${(exercise.workoutCount / maxWorkouts) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
        <View style={styles.section}>
          <View
            style={styles.consistencyHeader}
            accessible
            accessibilityLabel={`${texts.consistency}, ${texts.averageSessions(average)}`}
          >
            <Text style={globalStyles.inputLabel}>{texts.consistency}</Text>
            <View style={styles.average}>
              <Text style={styles.averageUnit}>
                {average} {texts.sessionsPerWeek}
              </Text>
            </View>
          </View>
          <View
            style={styles.levels}
            accessible
            accessibilityLabel={texts.levelSummary(
              texts.levels[level],
              levelIndex + 1,
              CONSISTENCY_LEVELS.length,
            )}
          >
            {CONSISTENCY_LEVELS.map((item, index) => (
              <View key={item} style={styles.level}>
                <View
                  style={[
                    styles.pill,
                    index <= levelIndex
                      ? styles.pillReached
                      : styles.pillNotReached,
                  ]}
                />
                <Text
                  style={[
                    styles.levelLabel,
                    item === level && styles.levelLabelCurrent,
                  ]}
                  numberOfLines={1}
                  adjustsFontSizeToFit
                >
                  {texts.levels[item]}
                </Text>
              </View>
            ))}
          </View>
          <Text style={styles.hint}>{nextLevelHint(texts, level)}</Text>
        </View>
      </View>
    </View>
  );
}

function nextLevelHint(
  texts: Translations["profile"]["athleteType"],
  level: ConsistencyLevel,
) {
  const next = nextConsistencyLevel(level);
  if (next === null) {
    return texts.topLevel(LEVEL_SESSIONS.unstoppable);
  }
  if (next === "unstoppable") {
    return texts.toNextLevel.unstoppable(
      LEVEL_SESSIONS.unstoppable,
      UNSTOPPABLE_WEEKS,
    );
  }
  return texts.toNextLevel[next](LEVEL_SESSIONS[next]);
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    panel: {
      gap: spacing.md,
    },
    identity: {
      paddingTop: spacing.xs,
      gap: spacing.xs,
    },
    name: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    description: {
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
    },
    // Each part under the type, split from the one above by a hairline.
    section: {
      gap: spacing.sm,
      paddingTop: spacing.md,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    exercise: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    exerciseInfo: {
      flex: 1,
      gap: spacing.xs,
    },
    exerciseText: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.sm,
    },
    exerciseName: {
      flex: 1,
      fontSize: fontSizes.label,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    count: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    exerciseBar: {
      height: EXERCISE_BAR_HEIGHT,
      borderTopRightRadius: radii.xs,
      borderBottomRightRadius: radii.xs,
      backgroundColor: colors.primary,
    },
    consistencyHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    average: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.xs,
    },
    averageUnit: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    levels: {
      flexDirection: "row",
      gap: spacing.xs,
    },
    level: {
      flex: 1,
      gap: spacing.xs,
    },
    pill: {
      height: PILL_HEIGHT,
    },
    pillNotReached: {
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
    },
    pillReached: {
      backgroundColor: colors.primary,
    },
    levelLabel: {
      textAlign: "left",
      fontSize: fontSizes.lowFont,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    levelLabelCurrent: {
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    hint: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
