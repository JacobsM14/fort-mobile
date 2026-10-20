import { StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { formatSet } from "@/features/workouts/sets";

import type { TrackingType } from "@/constants/enums";
import type { SetValues } from "@/features/workouts/queries";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type ExerciseSummaryProps = {
  name: string;
  trackingType: TrackingType;
  sets: readonly SetValues[];
};

// One exercise of a finished workout: its name and its sets on one line.
export function ExerciseSummary({
  name,
  trackingType,
  sets,
}: ExerciseSummaryProps) {
  const { t, language } = useTranslation();
  const units = useUnits();
  const styles = useStyles();

  return (
    <View style={styles.exercise}>
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.sets}>
        {sets
          .map((set) => formatSet(trackingType, set, units, t, language))
          .join(" · ")}
      </Text>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    exercise: {
      gap: spacing.xs,
      paddingTop: spacing.sm,
      borderTopWidth: 1,
      borderColor: colors.border,
    },
    name: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    sets: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
  }),
);
