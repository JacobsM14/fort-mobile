import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { LineChart } from "@/components/progress/line-chart";
import { IconButton } from "@/components/ui/buttons/icon-button";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { getExerciseInfo } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { formatMetric } from "@/features/progress/metrics";
import { SAMPLE_EXERCISES } from "@/features/progress/sample-data";

import type { ExerciseInfo } from "@/features/exercises/catalog";

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

  const openHistory = useFocusedPress(() => router.push("/history"));

  // The chart only knows the catalog key; the exercise is looked up in the
  // list for what the sheet shows. An exercise deleted since has none.
  function showInfo(key: string) {
    const exercise = exercises.find((candidate) => candidate.key === key);
    if (exercise !== undefined) {
      setInfo(getExerciseInfo(exercise, t));
    }
  }

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
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
        <Text style={globalStyles.inputLabel}>{t.progress.sampleNotice}</Text>
        {SAMPLE_EXERCISES.map((exercise) => {
          const metric = t.progress.metrics[exercise.trackingType];
          const format = (value: number) =>
            formatMetric(exercise.trackingType, value, units, t, language);
          const first = exercise.points.at(0);
          const last = exercise.points.at(-1);
          return (
            <View key={exercise.key} style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitle}>
                  <Text style={styles.name}>
                    {t.exerciseCatalog[exercise.key].name}
                  </Text>
                  <Text style={globalStyles.inputLabel}>{metric}</Text>
                </View>
                <IconButton
                  tone="muted"
                  icon={{ ios: "info.circle", android: "info", web: "info" }}
                  accessibilityLabel={t.exercises.showInfo}
                  onPress={() => showInfo(exercise.key)}
                />
              </View>
              <LineChart
                points={exercise.points}
                formatValue={format}
                accessibilityLabel={
                  first === undefined || last === undefined
                    ? metric
                    : t.progress.chartSummary(
                        metric,
                        format(first.value),
                        format(last.value),
                        exercise.points.length,
                      )
                }
              />
            </View>
          );
        })}
      </ScrollView>
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
    section: {
      gap: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      padding: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionTitle: {
      flex: 1,
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
  }),
);
