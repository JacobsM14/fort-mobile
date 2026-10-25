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
import { IconButton } from "@/components/ui/buttons/icon-button";
import { ExerciseSelectMenu } from "@/components/workout/header/exercise-select";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { getExerciseInfo } from "@/features/exercises/catalog";
import { useExerciseList } from "@/features/exercises/queries";
import { formatMetric } from "@/features/progress/metrics";
import { SAMPLE_EXERCISES } from "@/features/progress/sample-data";

import type { MenuAnchor } from "@/components/workout/header/exercise-select";
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
  const [selectedKey, setSelectedKey] = useState(SAMPLE_EXERCISES[0].key);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>();
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
  const first = exercise.points.at(0);
  const last = exercise.points.at(-1);

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
        <Text style={styles.sectionTitle}>{t.progress.strength}</Text>
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
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
            <Text style={globalStyles.inputLabel}>{metric}</Text>
          </View>
          <LineChart
            key={exercise.key}
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
      gap: spacing.sm,
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
    sectionHeader: {
      gap: spacing.xs,
      paddingBottom: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    pickerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
  }),
);
