import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const BAR_HEIGHT = 4;

const EXERCISES = [
  {
    name: "Press banca",
    detail: "Pecho · 4 series",
    total: "2.140 kg",
    change: "+115",
    share: 1,
    sets: ["80×8", "85×6", "90×6", "90×5"],
  },
  {
    name: "Press inclinado manc.",
    detail: "Pecho · 3 series",
    total: "856 kg",
    change: "+66",
    share: 0.4,
    sets: ["30×10", "30×10", "32×8"],
  },
  {
    name: "Press militar",
    detail: "Hombro · 3 series",
    total: "960 kg",
    change: "+75",
    share: 0.45,
    sets: ["50×6", "50×6", "45×8"],
  },
];

export function TodayExercises() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View>
      <Text style={[globalStyles.inputLabel, styles.title]}>
        {t.progress.todayExercises}
      </Text>
      <View style={styles.exercisesContainer}>
        {EXERCISES.map((exercise) => (
          <View key={exercise.name} style={styles.exercise}>
            <View style={styles.header}>
              <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>
                  {exercise.name}
                </Text>
                <Text style={styles.detail}>{exercise.detail}</Text>
              </View>
              <View style={styles.totals}>
                <Text style={styles.total}>{exercise.total}</Text>
                <Text style={styles.change}>▲ {exercise.change}</Text>
              </View>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  exercise.share === 1 && styles.fillTop,
                  { width: `${exercise.share * 100}%` },
                ]}
              />
            </View>
            <View style={styles.sets}>
              {exercise.sets.map((set, index) => (
                <View key={index} style={styles.set}>
                  <Text style={styles.setText}>{set}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    title: {
      paddingBottom: spacing.xs,
      marginBottom: spacing.sm,
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    exercisesContainer: {
      gap: spacing.sm,
    },
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
    totals: {
      alignItems: "flex-end",
      gap: spacing.xs,
    },
    total: {
      fontSize: fontSizes.body,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    change: {
      fontSize: fontSizes.detail,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.primary,
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
