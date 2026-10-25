import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import { LineChart } from "@/components/progress/line-chart";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { formatMetric } from "@/features/progress/metrics";
import { SAMPLE_EXERCISES } from "@/features/progress/sample-data";

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

  const openHistory = useFocusedPress(() => router.push("/history"));

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
              <View>
                <Text style={styles.name}>
                  {t.exerciseCatalog[exercise.key].name}
                </Text>
                <Text style={globalStyles.inputLabel}>{metric}</Text>
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
    },
    name: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
  }),
);
