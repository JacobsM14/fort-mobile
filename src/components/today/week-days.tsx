import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { DayBox } from "@/components/today/day-box";

import { useFirstWeekday } from "@/hooks/use-first-weekday";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useFirstBodyWeightDay } from "@/features/body/queries";
import {
  useDailyExerciseCounts,
  useFirstWorkoutStart,
} from "@/features/workouts/queries";

import {
  earliestDate,
  formatDayHeader,
  getWeekDays,
  isMissedDay,
  toDateKey,
  weekEnd,
  weekStartsSince,
} from "@/utils/date";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

// This week, and a swipe to the right for each week before it, one whole
// week at a time. Never ahead of this week.
export function WeekDays() {
  const styles = useStyles();
  const firstWeekday = useFirstWeekday();
  const { firstWorkoutStart } = useFirstWorkoutStart();
  const firstWeighIn = useFirstBodyWeightDay();
  const openDay = useFocusedPress((day: Date) =>
    router.push({
      pathname: "/history/day/[date]",
      params: { date: toDateKey(day), from: "today" },
    }),
  );
  // Each page is as wide as the row, which is only known once laid out.
  const [width, setWidth] = useState(0);

  const today = new Date();
  const since = earliestDate([firstWorkoutStart, firstWeighIn]);
  const weeks = weekStartsSince(today, firstWeekday, since).map((start) =>
    getWeekDays(start, firstWeekday),
  );

  return (
    <View
      style={styles.container}
      onLayout={(event) => setWidth(event.nativeEvent.layout.width)}
    >
      {width === 0 ? (
        <Week days={weeks[0]} today={today} onOpenDay={openDay} />
      ) : (
        <FlatList
          data={weeks}
          keyExtractor={(days) => toDateKey(days[0])}
          renderItem={({ item: days }) => (
            <Week days={days} today={today} width={width} onOpenDay={openDay} />
          )}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          extraData={width}
          horizontal
          inverted
          pagingEnabled
          scrollEnabled={weeks.length > 1}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          overScrollMode="never"
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          windowSize={3}
        />
      )}
    </View>
  );
}

type WeekProps = {
  days: Date[];
  today: Date;
  // Unset while he row hasn't been measured: then the week takes the row.
  width?: number;
  onOpenDay: (day: Date) => void;
};

function Week({ days, today, width, onOpenDay }: WeekProps) {
  const { language } = useTranslation();
  const styles = useStyles();
  const exerciseCounts = useDailyExerciseCounts(days[0], weekEnd(days[0]));

  return (
    <View style={[styles.week, width !== undefined && { width }]}>
      {days.map((day) => {
        const key = day.toDateString();
        const isToday = key === today.toDateString();
        const trained = exerciseCounts.has(key);
        const missed = isMissedDay(day, trained, today);
        const disabled = day > today;
        return (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.day, pressed && styles.dayPressed]}
            onPress={() => onOpenDay(day)}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel={formatDayHeader(day, language)}
            accessibilityState={{ disabled }}
          >
            <Text style={styles.initial}>
              {day
                .toLocaleDateString(language, { weekday: "narrow" })
                .toLocaleUpperCase(language)}
            </Text>
            <DayBox
              dayOfMonth={day.getDate()}
              trained={trained}
              isToday={isToday}
              missed={missed}
            />
          </Pressable>
        );
      })}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      marginTop: spacing.lg,
    },
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    day: {
      alignItems: "center",
      gap: spacing.xs,
    },
    dayPressed: {
      opacity: 0.6,
    },
    initial: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
