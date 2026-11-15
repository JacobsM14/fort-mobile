import { type RefObject } from "react";
import { StyleSheet, Text, View, type HostInstance } from "react-native";

import { EmptyChart } from "@/components/progress/charts/empty-chart";
import {
  CHART_HEIGHT,
  LineChart,
} from "@/components/progress/charts/line-chart";
import { ExercisePickerButton } from "@/components/progress/strength/exercise-picker-button";
import { IconButton } from "@/components/ui/buttons/icon-button";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { getExerciseText } from "@/features/exercises/catalog";
import {
  formatChange,
  formatMetric,
  progressChange,
} from "@/features/progress/metrics";
import { useExerciseProgress } from "@/features/progress/queries";
import { pointsInRange } from "@/features/progress/ranges";

import type { ExerciseSummary } from "@/features/exercises/queries";
import type { ProgressRange } from "@/features/progress/ranges";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  spacing,
} from "@/constants/theme";

type StrengthCardProps = {
  exercise: ExerciseSummary | undefined;
  loaded: boolean;
  range: ProgressRange;
  headerRef: RefObject<HostInstance | null>;
  menuOpen: boolean;
  onShowInfo: () => void;
  onToggleMenu: () => void;
};

export function StrengthCard({
  exercise,
  loaded,
  range,
  headerRef,
  menuOpen,
  onShowInfo,
  onToggleMenu,
}: StrengthCardProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  const trackingType = exercise?.trackingType;
  const { points: allPoints, loaded: pointsLoaded } = useExerciseProgress(
    exercise?.id,
    trackingType,
  );
  const name = exercise === undefined ? "" : getExerciseText(exercise, t).name;
  const metric =
    trackingType === undefined ? "" : t.progress.metrics[trackingType];
  const format = (value: number) =>
    trackingType === undefined
      ? String(value)
      : formatMetric(trackingType, value, units, t, language);
  const points = pointsInRange(allPoints, range, new Date());
  const first = points.at(0);
  const last = points.at(-1);
  const change = progressChange(points);
  const changeText =
    change === null || trackingType === undefined
      ? null
      : formatChange(trackingType, change, units, t, language);

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{t.progress.strength}</Text>
      {loaded && exercise === undefined && (
        <View style={[globalStyles.panel, styles.emptySection]}>
          <EmptyChart label={t.progress.noTrained} />
        </View>
      )}
      {exercise !== undefined && (
        <View style={globalStyles.panel}>
          <View ref={headerRef} style={styles.pickerRow}>
            <IconButton
              tone="muted"
              icon={{ ios: "info.circle", android: "info", web: "info" }}
              accessibilityLabel={t.exercises.showInfo}
              onPress={onShowInfo}
            />
            <ExercisePickerButton
              name={name}
              open={menuOpen}
              onPress={onToggleMenu}
            />
          </View>
          {changeText !== null && (
            <Text
              style={[
                styles.change,
                change !== null && change < 0 && styles.changeDown,
                change === 0 && styles.changeFlat,
              ]}
              numberOfLines={1}
              accessibilityLabel={t.progress.changeLabel(changeText)}
            >
              {changeText}
            </Text>
          )}
          {pointsLoaded && points.length === 0 && (
            <Text style={styles.note}>{t.progress.noData}</Text>
          )}
          <LineChart
            key={`${exercise.id}-${range}`}
            points={points}
            formatValue={format}
            accessibilityLabel={
              first === undefined || last === undefined
                ? metric
                : t.progress.chartSummary(
                    metric,
                    format(first.value),
                    format(last.value),
                    points.length,
                  )
            }
          />
          {exercise.trackingType === "weight_reps" && (
            <Text style={styles.note}>{t.progress.oneRepMaxNote}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    note: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    emptySection: {
      minHeight: CHART_HEIGHT,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    pickerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    change: {
      alignSelf: "flex-end",
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.primary,
    },
    changeDown: {
      color: colors.danger,
    },
    changeFlat: {
      color: colors.disabled,
    },
  }),
);
