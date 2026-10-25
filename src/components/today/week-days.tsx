import { useCalendars } from "expo-localization";
import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DayBox } from "@/components/today/day-box";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useTrainedDays } from "@/features/workouts/queries";

import { formatDayHeader, getWeekDays, toDateKey } from "@/utils/date";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

const MONDAY = 2;

export function WeekDays() {
  const { language } = useTranslation();
  const styles = useStyles();
  const [calendar] = useCalendars();
  const today = new Date();
  const days = getWeekDays(today, calendar.firstWeekday ?? MONDAY);
  const weekEnd = new Date(days[6]);
  weekEnd.setDate(weekEnd.getDate() + 1);
  // A day counts as trained when a workout started that day has a set done.
  const trainedDays = useTrainedDays(days[0], weekEnd);
  const openDay = useFocusedPress((day: Date) =>
    router.push({
      pathname: "/history/day/[date]",
      params: { date: toDateKey(day) },
    }),
  );

  return (
    <View style={styles.week}>
      {days.map((day) => {
        const key = day.toDateString();
        const isToday = key === today.toDateString();
        const trained = trainedDays.has(key);
        // Days already gone without a workout are dashed.
        const missed = !trained && !isToday && day < today;
        // Days still to come have nothing to show yet.
        const upcoming = !isToday && day > today;
        return (
          <Pressable
            key={key}
            style={({ pressed }) => [styles.day, pressed && styles.dayPressed]}
            onPress={() => openDay(day)}
            disabled={upcoming}
            accessibilityRole="button"
            accessibilityLabel={formatDayHeader(day, language)}
            accessibilityState={{ disabled: upcoming }}
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
    week: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: spacing.lg,
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
