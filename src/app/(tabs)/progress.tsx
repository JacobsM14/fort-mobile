import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef, useState } from "react";
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  type HostInstance,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { BmiCard } from "@/components/progress/bmi-card";
import { BodyWeightCard } from "@/components/progress/body-weight-card";
import { BodyWeightEntry } from "@/components/progress/body-weight-entry";
import { EmptyChart } from "@/components/progress/empty-chart";
import { ExercisePickerButton } from "@/components/progress/exercise-picker-button";
import { LineChart } from "@/components/progress/line-chart";
import { RangeFilter } from "@/components/progress/range-filter";
import { IconButton } from "@/components/ui/buttons/icon-button";
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
  iconSizes,
  spacing,
} from "@/constants/theme";

export default function ProgressScreen() {
  const { t, language } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  const { profile } = useUserProfile();

  const { exercises, loaded } = useTrainedExercises();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [selectedId, setSelectedId] = useState<string>();
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>();
  const [range, setRange] = useState<ProgressRange>("3m");
  const screenRef = useRef<HostInstance>(null);
  const headerRef = useRef<HostInstance>(null);

  const openHistory = useFocusedPress(() => router.push("/history"));
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

  // The header scrolls with the content, so its place on the screen is only
  // known when the menu opens: measured against the screen the menu covers.
  function toggleMenu() {
    if (menuAnchor !== undefined) {
      setMenuAnchor(undefined);
      return;
    }
    screenRef.current?.measureInWindow((screenX, screenY) => {
      headerRef.current?.measureInWindow((x, y, width, height) => {
        setMenuAnchor({
          top: y - screenY + height + spacing.xs,
          left: x - screenX,
          width,
        });
      });
    });
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
    <SafeAreaView
      ref={screenRef}
      style={[globalStyles.screen, styles.screen]}
      edges={["top"]}
    >
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.progress}</Text>
        <Pressable
          onPress={openHistory}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.history.title}
        >
          {({ pressed }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "calendar_check",
                web: "calendar_check",
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
        <RangeFilter value={range} onChange={setRange} />
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
            // Remounted on a unit change: the text typed is in the old unit,
            // and saving it as the new one would store another weight.
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
    // As tall as the chart card it stands in for, so the screen doesn't jump
    // when the first workout arrives.
    emptySection: {
      minHeight: 200,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    pickerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    // How the period went, under the picker and at the right.
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
