import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

type WorkoutStatsProps = {
  seconds: number;
  exercisesCount: number;
  setsCount: number;
};

export function WorkoutStats({
  seconds,
  exercisesCount,
  setsCount,
}: WorkoutStatsProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  const stats = [
    {
      label: t.finished.duration,
      value: seconds > 0 ? t.progress.minutes(Math.floor(seconds / 60)) : "-",
    },
    { label: t.finished.sets, value: setsCount.toString() },
    { label: t.finished.exercises, value: exercisesCount.toString() },
  ];

  return (
    <View style={styles.row}>
      {stats.map((stat, index) => (
        <Fragment key={stat.label}>
          {index > 0 && <View style={styles.divider} />}
          <View
            style={styles.stat}
            accessible
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Text style={styles.value} numberOfLines={1} adjustsFontSizeToFit>
              {stat.value}
            </Text>
            <Text
              style={globalStyles.inputLabel}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {stat.label}
            </Text>
          </View>
        </Fragment>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    stat: {
      flexShrink: 1,
      gap: spacing.xs,
    },
    divider: {
      width: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
    value: {
      fontSize: fontSizes.heading,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
  }),
);
