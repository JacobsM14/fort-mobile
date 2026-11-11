import { router } from "expo-router";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { Alert, StyleSheet, Text, View, type HostInstance } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { BmiCard } from "@/components/progress/bmi/bmi-card";
import { BodyWeightCard } from "@/components/progress/body-weight/body-weight-card";
import { BodyWeightEntry } from "@/components/progress/body-weight/body-weight-entry";
import { EmptyChart } from "@/components/progress/charts/empty-chart";
import {
  CHART_HEIGHT,
  LineChart,
} from "@/components/progress/charts/line-chart";
import { ExercisePickerButton } from "@/components/progress/strength/exercise-picker-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { measureMenuAnchor } from "@/components/ui/overlays/measure-anchor";
import { ExerciseSelectMenu } from "@/components/workout/header/exercise-select";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { assessBmi } from "@/features/body/bmi";
import {
  bodyWeightOnDay,
  latestBodyWeightKg,
  saveBodyWeight,
  useBodyWeights,
} from "@/features/body/queries";
import { getExerciseInfo, getExerciseText } from "@/features/exercises/catalog";
import {
  formatChange,
  formatMetric,
  progressChange,
} from "@/features/progress/metrics";
import {
  useExerciseProgress,
  useTrainedExercises,
} from "@/features/progress/queries";
import { pointsInRange } from "@/features/progress/ranges";

import type { MenuAnchor } from "@/components/workout/header/exercise-select";
import type { ExerciseInfo } from "@/features/exercises/catalog";
import type { ProgressRange } from "@/features/progress/ranges";

import { formatShortDay, toDateKey } from "@/utils/date";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  spacing,
} from "@/constants/theme";

type RangeProgressProps = {
  range: ProgressRange;
  filter: ReactNode;
  screenRef: RefObject<HostInstance | null>;
};

export function RangeProgress({
  range,
  filter,
  screenRef,
}: RangeProgressProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  const { profile } = useUserProfile();

  const { exercises, loaded } = useTrainedExercises();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>();
  const headerRef = useRef<HostInstance>(null);

  const openUserProfile = useFocusedPress(() => router.push("/settings/user"));

  // The exercise charted: the one picked, or the one trained last. None while
  // loading or before the first workout.
  const exercise =
    exercises.find((e) => e.id === selectedId) ?? exercises.at(0);
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

  const { entries, loaded: weightsLoaded } = useBodyWeights();
  // The box starts from the latest weigh-in, whatever the range filtered.
  const latestWeightKg = latestBodyWeightKg(entries);
  const todayWeight = bodyWeightOnDay(entries, toDateKey(new Date()));

  function showInfo() {
    if (exercise !== undefined) {
      setInfo(getExerciseInfo(exercise, t));
    }
  }

  // As wide as the header, which scrolls with the content.
  function toggleMenu() {
    if (menuAnchor !== undefined) {
      setMenuAnchor(undefined);
      return;
    }
    measureMenuAnchor(
      screenRef.current,
      headerRef.current,
      ({ top, left, width }) => setMenuAnchor({ top, left, width }),
    );
  }

  function saveWeight(kg: number) {
    try {
      saveBodyWeight(new Date(), kg);
    } catch {
      Alert.alert(t.progress.saveWeightError);
    }
  }

  function selectExercise(id: string) {
    setMenuAnchor(undefined);
    setSelectedId(id);
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filter}
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
                  onPress={showInfo}
                />
                <ExercisePickerButton
                  name={name}
                  open={menuAnchor !== undefined}
                  onPress={toggleMenu}
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
        <BodyWeightCard
          entries={entries}
          range={range}
          loaded={weightsLoaded}
        />
        <View style={globalStyles.titledSection}>
          <View style={styles.entryHeader}>
            <Text style={globalStyles.sectionTitle}>
              {t.progress.registerWeight}
            </Text>
            <Text style={styles.today}>
              {t.progress.today} · {formatShortDay(new Date(), language)}
            </Text>
          </View>
          {weightsLoaded && (
            <BodyWeightEntry
              key={units.weight}
              initialKg={latestWeightKg}
              savedKg={todayWeight?.weightKg}
              onSave={saveWeight}
            />
          )}
        </View>
        {weightsLoaded && (
          <BmiCard
            assessment={assessBmi(profile, entries.at(-1))}
            onCompleteProfile={openUserProfile}
          />
        )}
      </ScrollView>
      {menuAnchor !== undefined && (
        <ExerciseSelectMenu
          items={exercises.map((item) => ({
            id: item.id,
            name: getExerciseText(item, t).name,
            trackingType: item.trackingType,
            done: false,
          }))}
          currentId={exercise?.id}
          anchor={menuAnchor}
          onSelect={selectExercise}
          onClose={() => setMenuAnchor(undefined)}
        />
      )}
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      gap: spacing.lg,
      paddingBottom: spacing.lg,
    },
    entryHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    today: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.primary,
    },
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
