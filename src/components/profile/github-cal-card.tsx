import { useRef } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  type ScrollViewInstance,
} from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { INTENSITY_LEVELS } from "@/features/profile/activity-calendar";

import type { IntensityLevel } from "@/features/profile/activity-calendar";

import {
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";

const CELL = 16;
const GAP = 3;
// Room for the weekday names at the left of the grid.
const LABEL_WIDTH = 24;
// The row of month names over the grid.
const MONTHS_HEIGHT = fontSizes.caption + spacing.xs;
// Month names are wider than a column: each needs two.
const MONTH_LABEL_SPAN = 2;
// Only these days are named, as in GitHub's: Monday, Wednesday and Friday.
const NAMED_WEEKDAYS = [1, 3, 5];

type GithubCalCardProps = {
  // The first day of each week, the oldest first.
  weekStarts: readonly Date[];
  // The level of each day of each week; null for a day still to come.
  levels: readonly (readonly (IntensityLevel | null)[])[];
};

// The days trained as a calendar of squares, a column per week, each as dark
// as the day was intense.
export function GithubCalCard({ weekStarts, levels }: GithubCalCardProps) {
  const { t, language } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const texts = t.profile.activity;
  const scrollRef = useRef<ScrollViewInstance>(null);

  const weeks = weekStarts.length;
  const colorOf = (level: IntensityLevel) =>
    level === 0 ? colors.intensityEmpty : colors.intensity[level - 1];

  // The name of each row's weekday, or null for the ones left unnamed.
  const firstWeek = weekStarts[0];
  const weekdays = Array.from({ length: 7 }, (_, index) => {
    const day = new Date(
      firstWeek.getFullYear(),
      firstWeek.getMonth(),
      firstWeek.getDate() + index,
    );
    return NAMED_WEEKDAYS.includes(day.getDay())
      ? day.toLocaleDateString(language, { weekday: "short" }).replace(".", "")
      : null;
  });

  // A month is named over the week it starts in, unless the last name is too
  // close for this one to fit.
  const months: { index: number; name: string }[] = [];
  weekStarts.forEach((weekStart, index) => {
    const last = months.at(-1);
    const previous = weekStarts[index - 1];
    const newMonth =
      previous === undefined || previous.getMonth() !== weekStart.getMonth();
    if (
      newMonth &&
      (last === undefined || index - last.index >= MONTH_LABEL_SPAN)
    ) {
      months.push({
        index,
        name: weekStart
          .toLocaleDateString(language, { month: "short" })
          .replace(".", ""),
      });
    }
  });

  return (
    <View style={globalStyles.titledSection}>
      <Text style={globalStyles.sectionTitle}>{texts.title}</Text>
      <View style={globalStyles.panel}>
        <View
          style={styles.body}
          accessible
          accessibilityLabel={texts.summary(weeks)}
        >
          <View style={styles.weekdays}>
            {weekdays.map((name, index) => (
              <View key={index} style={styles.weekday}>
                {name !== null && <Text style={styles.label}>{name}</Text>}
              </View>
            ))}
          </View>
          <ScrollView
            ref={scrollRef}
            style={styles.scroll}
            horizontal
            showsHorizontalScrollIndicator={false}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: false })
            }
          >
            <View>
              <View style={styles.months}>
                {months.map((month) => (
                  <Text
                    key={month.index}
                    style={[
                      styles.label,
                      styles.month,
                      { left: month.index * (CELL + GAP) },
                    ]}
                    numberOfLines={1}
                  >
                    {month.name}
                  </Text>
                ))}
              </View>
              <View style={styles.grid}>
                {levels.map((week, weekIndex) => (
                  <View key={weekIndex} style={styles.week}>
                    {week.map((level, dayIndex) => (
                      <View
                        key={dayIndex}
                        style={[
                          styles.cell,
                          level !== null && {
                            backgroundColor: colorOf(level),
                          },
                        ]}
                      />
                    ))}
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={styles.legend}>
          <Text style={styles.label}>{texts.less}</Text>
          {INTENSITY_LEVELS.map((level) => (
            <View
              key={level}
              style={[styles.legendCell, { backgroundColor: colorOf(level) }]}
            />
          ))}
          <Text style={styles.label}>{texts.more}</Text>
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    body: {
      flexDirection: "row",
      gap: GAP,
    },
    scroll: {
      flex: 1,
    },
    months: {
      height: MONTHS_HEIGHT,
    },
    weekdays: {
      gap: GAP,
      marginTop: MONTHS_HEIGHT,
    },
    label: {
      fontSize: fontSizes.lowFont,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    month: {
      position: "absolute",
    },
    weekday: {
      width: LABEL_WIDTH,
      height: CELL,
      justifyContent: "center",
    },
    grid: {
      flexDirection: "row",
      gap: GAP,
    },
    week: {
      gap: GAP,
    },
    cell: {
      width: CELL,
      height: CELL,
      borderRadius: radii.sm,
    },
    legend: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: GAP,
    },
    legendCell: {
      width: CELL,
      height: CELL,
      borderRadius: radii.sm,
    },
  }),
);
