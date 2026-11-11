import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { DashedArrow } from "@/components/progress/body-weight/dashed-arrow";
import { ViewToggle } from "@/components/progress/body-weight/view-toggle";
import { EmptyChart } from "@/components/progress/charts/empty-chart";
import { LineChart } from "@/components/progress/charts/line-chart";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useUnits } from "@/hooks/use-units";
import { useTranslation } from "@/i18n";

import { formatBodyWeight, formatWeightChange } from "@/features/body/format";
import { recentBodyWeights, toBodyWeightPoints } from "@/features/body/queries";
import { pointsInRange } from "@/features/progress/ranges";

import type { WeightView } from "@/components/progress/body-weight/view-toggle";
import type { BodyWeightEntry } from "@/features/body/queries";
import type { ProgressRange } from "@/features/progress/ranges";

import { formatShortDay } from "@/utils/date";

import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  spacing,
} from "@/constants/theme";

const RECENT_WEIGHTS = 5;
// As tall as the box with the chart (padding, toggle, 200 of chart and note),
// so switching to a short list doesn't make the screen jump.
const BOX_MIN_HEIGHT = 300;

type BodyWeightCardProps = {
  entries: readonly BodyWeightEntry[];
  range: ProgressRange;
  loaded: boolean;
};

// The body weights in Progress: charted over the range, or the latest ones as
// a list with what each changed.
export function BodyWeightCard({
  entries,
  range,
  loaded,
}: BodyWeightCardProps) {
  const { t, language } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const units = useUnits();
  const styles = useStyles();
  const [view, setView] = useState<WeightView>("chart");

  const points = pointsInRange(toBodyWeightPoints(entries), range, new Date());
  const first = points.at(0);
  const last = points.at(-1);
  const recent = recentBodyWeights(entries, RECENT_WEIGHTS);
  // Nothing to switch between or to filter while there are no weigh-ins.
  const hasWeights = entries.length > 0;
  // The chart follows the range; the list is the latest weigh-ins, whenever.
  const empty =
    loaded && (view === "chart" ? points.length : recent.length) === 0;
  const formatWeight = (kg: number) => formatBodyWeight(kg, units, language);

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{t.progress.bodyWeight}</Text>
      <View style={[globalStyles.panel, styles.box]}>
        {hasWeights && <ViewToggle value={view} onChange={setView} />}
        <View style={styles.body}>
          {empty ? (
            <View style={styles.empty}>
              {/* Weigh-ins older than the range leave only the period empty. */}
              <EmptyChart
                label={hasWeights ? t.progress.noData : t.progress.noWeight}
              />
            </View>
          ) : view === "chart" ? (
            <LineChart
              key={`body-weight-${range}`}
              points={points}
              color={colors.text}
              formatValue={formatWeight}
              accessibilityLabel={
                first === undefined || last === undefined
                  ? t.progress.bodyWeight
                  : t.progress.chartSummary(
                      t.progress.bodyWeight,
                      formatWeight(first.value),
                      formatWeight(last.value),
                      points.length,
                    )
              }
            />
          ) : (
            <View>
              {recent.map((entry) => (
                <View key={entry.id} style={styles.row}>
                  <Text style={styles.date}>
                    {formatShortDay(entry.date, language)}
                  </Text>
                  <View style={styles.arrow}>
                    <DashedArrow />
                  </View>
                  <View style={styles.values}>
                    {entry.changeKg !== null && (
                      <Text style={styles.change}>
                        {formatWeightChange(entry.changeKg, units, language)}
                      </Text>
                    )}
                    <Text style={styles.value}>
                      {formatWeight(entry.weightKg)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
        <Text style={styles.note}>{t.progress.oneWeightPerDay}</Text>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      minHeight: BOX_MIN_HEIGHT,
    },
    // Takes the room the note leaves, so the note stays at the bottom whatever
    // the view.
    body: {
      flex: 1,
    },
    empty: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: spacing.lg,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    date: {
      fontSize: fontSizes.label,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    arrow: {
      flex: 1,
      marginHorizontal: spacing.sm,
    },
    values: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.xs,
    },
    value: {
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.bold,
      color: colors.text,
    },
    change: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    note: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
