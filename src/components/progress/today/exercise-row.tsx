import { StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { exerciseTotal, formatTotal } from "@/features/progress/today";
import { formatPreviousSet } from "@/features/workouts/sets";

import type { TodayEntry } from "@/features/progress/today";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const BAR_HEIGHT = 4;

type ExerciseRowProps = {
  entry: TodayEntry;
  maxSets: number;
};

export function ExerciseRow({ entry, maxSets }: ExerciseRowProps) {
  const { t, language } = useTranslation();
  const units = useUnits();
  const styles = useStyles();

  const { trackingType, primaryMuscles } = entry.summary;
  const mainMuscle = primaryMuscles.at(0);

  const detail = [
    mainMuscle === undefined ? null : t.muscles[mainMuscle],
    t.progress.setCount(entry.sets.length),
  ]
    .filter((part) => part !== null)
    .join(" · ");

  const total = exerciseTotal(trackingType, entry.sets);

  const share = entry.sets.length / maxSets;

  return (
    <View style={styles.exercise}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1}>
            {entry.name}
          </Text>
          <Text style={styles.detail}>{detail}</Text>
        </View>
        <Text style={styles.total}>
          {formatTotal(trackingType, total, units, t, language)}
        </Text>
      </View>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            share === 1 && styles.fillTop,
            { width: `${share * 100}%` },
          ]}
        />
      </View>
      <View style={styles.sets}>
        {entry.sets.map((set, index) => (
          <View key={index} style={styles.set}>
            <Text style={styles.setText}>
              {formatPreviousSet(trackingType, set, units, language)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    exercise: {
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.sm,
    },
    info: {
      flex: 1,
      gap: spacing.xs,
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    total: {
      fontSize: fontSizes.body,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    track: {
      height: BAR_HEIGHT,
      backgroundColor: colors.border,
    },
    fill: {
      height: BAR_HEIGHT,
      backgroundColor: colors.text,
    },
    fillTop: {
      backgroundColor: colors.primary,
    },
    sets: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.xs,
    },
    set: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.border,
      borderRadius: radii.xs,
    },
    setText: {
      fontSize: fontSizes.detail,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.text,
    },
  }),
);
