import { useCalendars } from "expo-localization";
import { StyleSheet, Text, View } from "react-native";

import { fontsInstrument, fontSizes, radii, spacing } from "@/constants/theme";
import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { getWeekDays } from "@/utils/date";

const MONDAY = 2;

export function WeekDays() {
  const { language } = useTranslation();
  const styles = useStyles();
  const [calendar] = useCalendars();
  const days = getWeekDays(new Date(), calendar.firstWeekday ?? MONDAY);
  const today = new Date();

  return (
    <View style={styles.week}>
      {days.map((day) => (
        <View key={day.toDateString()} style={styles.day}>
          <Text style={styles.initial}>
            {day
              .toLocaleDateString(language, { weekday: "narrow" })
              .toLocaleUpperCase(language)}
          </Text>
          <View
            style={[
              styles.box,
              day.toDateString() === today.toDateString()
                ? styles.activeBox
                : styles.disabledBox,
            ]}
          >
            <Text
              style={[
                styles.number,
                day.toDateString() === today.toDateString()
                  ? styles.activeNumber
                  : styles.disabledNumber,
              ]}
            >
              {day.getDate()}
            </Text>
          </View>
        </View>
      ))}
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
    activeBox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
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
