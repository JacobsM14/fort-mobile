import { Fragment } from "react";
import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { fontSizes, fontsJetBrainsMono, spacing } from "@/constants/theme";

export function WorkoutStats() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  const stats = [
    { label: t.finished.duration, value: t.progress.minutes(58) },
    { label: t.finished.sets, value: "18" },
    { label: t.finished.exercises, value: "5" },
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
