import { useCalendars } from "expo-localization";
import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useTrainedDays } from "@/features/workouts/queries";

import { getWeekDays } from "@/utils/date";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const MONDAY = 2;

export function WeekDays() {
  const { language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const [calendar] = useCalendars();
  const today = new Date();
  const days = getWeekDays(today, calendar.firstWeekday ?? MONDAY);
  const weekEnd = new Date(days[6]);
  weekEnd.setDate(weekEnd.getDate() + 1);
  // A day counts as trained when a workout started that day has a set done.
  const trainedDays = useTrainedDays(days[0], weekEnd);

  return (
    <View style={styles.week}>
      {days.map((day) => {
        const key = day.toDateString();
        const isToday = key === today.toDateString();
        const trained = trainedDays.has(key);
        // Days already gone without a workout are dashed.
        const missed = !trained && !isToday && day < today;
        return (
          <View key={key} style={styles.day}>
            <Text style={styles.initial}>
              {day
                .toLocaleDateString(language, { weekday: "narrow" })
                .toLocaleUpperCase(language)}
            </Text>
            <View
              style={[
                styles.box,
                trained
                  ? styles.trainedBox
                  : isToday
                    ? styles.activeBox
                    : styles.disabledBox,
                missed && styles.missedBox,
              ]}
            >
              {trained ? (
                <SymbolView
                  name={{ ios: "checkmark", android: "check", web: "check" }}
                  tintColor={colors.primary}
                  size={iconSizes.sm}
                />
              ) : (
                <Text
                  style={[
                    styles.number,
                    isToday ? styles.activeNumber : styles.disabledNumber,
                  ]}
                >
                  {day.getDate()}
                </Text>
              )}
            </View>
          </View>
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
    initial: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    box: {
      width: 36,
      height: 36,
      borderRadius: radii.sm,
      alignItems: "center",
      justifyContent: "center",
    },
    number: {
      fontSize: fontSizes.label,
    },
    disabledBox: {
      borderWidth: 1,
      borderColor: colors.disabled,
    },
    missedBox: {
      borderStyle: "dashed",
    },
    activeBox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    trainedBox: {
      borderWidth: 1,
      borderColor: colors.primary,
      backgroundColor: colors.primaryTint,
    },
    disabledNumber: {
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    activeNumber: {
      fontFamily: fontsInstrument.bold,
      color: colors.onPrimary,
    },
  }),
);
