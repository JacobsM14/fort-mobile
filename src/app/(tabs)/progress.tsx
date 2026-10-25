import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type HostInstance,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExercisePickerButton } from "@/components/progress/exercise-picker-button";
import { LineChart } from "@/components/progress/line-chart";
import { RangeFilter } from "@/components/progress/range-filter";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { ExerciseSelectMenu } from "@/components/workout/header/exercise-select";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { getExerciseInfo } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { formatMetric } from "@/features/progress/metrics";
import { pointsInRange } from "@/features/progress/ranges";
import {
  SAMPLE_BODY_WEIGHT,
  SAMPLE_EXERCISES,
} from "@/features/progress/sample-data";

import type { MenuAnchor } from "@/components/workout/header/exercise-select";
import type { ExerciseInfo } from "@/features/exercises/catalog";
import type { ProgressRange } from "@/features/progress/ranges";

import { formatDecimal } from "@/utils/number";
import { weightToUnit } from "@/utils/units";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

export default function ProgressScreen() {
  const { t, language } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const units = useUnits();
  const styles = useStyles();

  const { exercises } = useExerciseList();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [selectedKey, setSelectedKey] = useState(SAMPLE_EXERCISES[0].key);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>();
  const [range, setRange] = useState<ProgressRange>("3m");
  const screenRef = useRef<HostInstance>(null);
  const headerRef = useRef<HostInstance>(null);

  const openHistory = useFocusedPress(() => router.push("/history"));

  const exercise =
    SAMPLE_EXERCISES.find((sample) => sample.key === selectedKey) ??
    SAMPLE_EXERCISES[0];
  const name = t.exerciseCatalog[exercise.key].name;
  const metric = t.progress.metrics[exercise.trackingType];
  const format = (value: number) =>
    formatMetric(exercise.trackingType, value, units, t, language);
  const points = pointsInRange(exercise.points, range, new Date());
  const first = points.at(0);
  const last = points.at(-1);

  const weightPoints = pointsInRange(SAMPLE_BODY_WEIGHT, range, new Date());
  const firstWeight = weightPoints.at(0);
  const lastWeight = weightPoints.at(-1);
  const formatWeight = (kg: number) =>
    `${formatDecimal(Math.round(weightToUnit(kg, units.weight) * 10) / 10, language)} ${units.weight}`;

  // The chart only knows the catalog key; the exercise is looked up in the
  // list for what the sheet shows. An exercise deleted since has none.
  function showInfo() {
    const found = exercises.find((candidate) => candidate.key === exercise.key);
    if (found !== undefined) {
      setInfo(getExerciseInfo(found, t));
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

  function selectExercise(key: string) {
    setMenuAnchor(undefined);
    const sample = SAMPLE_EXERCISES.find((candidate) => candidate.key === key);
    if (sample !== undefined) {
      setSelectedKey(sample.key);
    }
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
        <View>
          <Text style={styles.sectionTitle}>{t.progress.strength}</Text>
          <View style={styles.section}>
            <View ref={headerRef} style={styles.pickerRow}>
              <ExercisePickerButton
                name={name}
                open={menuAnchor !== undefined}
                onPress={toggleMenu}
              />
              <IconButton
                tone="muted"
                icon={{ ios: "info.circle", android: "info", web: "info" }}
                accessibilityLabel={t.exercises.showInfo}
                onPress={showInfo}
              />
            </View>
            {points.length === 0 && (
              <Text style={styles.note}>{t.progress.noData}</Text>
            )}
            <LineChart
              key={`${exercise.key}-${range}`}
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
        </View>
        <View>
          <Text style={styles.sectionTitle}>{t.progress.bodyWeight}</Text>
          <View style={styles.section}>
            {weightPoints.length === 0 && (
              <Text style={styles.note}>{t.progress.noData}</Text>
            )}
            <LineChart
              key={`body-weight-${range}`}
              points={weightPoints}
              color={colors.text}
              formatValue={formatWeight}
              accessibilityLabel={
                firstWeight === undefined || lastWeight === undefined
                  ? t.progress.bodyWeight
                  : t.progress.chartSummary(
                      t.progress.bodyWeight,
                      formatWeight(firstWeight.value),
                      formatWeight(lastWeight.value),
                      weightPoints.length,
                    )
              }
            />
          </View>
        </View>
      </ScrollView>
      {menuAnchor !== undefined && (
        <ExerciseSelectMenu
          items={SAMPLE_EXERCISES.map((sample) => ({
            id: sample.key,
            name: t.exerciseCatalog[sample.key].name,
            trackingType: sample.trackingType,
            done: false,
          }))}
          currentId={exercise.key}
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
      gap: spacing.md,
      paddingBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    section: {
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    note: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    pickerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
  }),
);
