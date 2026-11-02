import { StyleSheet, View } from "react-native";

import { Chip } from "@/components/ui/inputs/chip";

import { useFirstWeekday } from "@/hooks/use-first-weekday";
import { useTranslation } from "@/i18n";

import { getWeekDays } from "@/utils/date";

import { spacing } from "@/constants/theme";

type WeekdayPickerProps = {
  // 0 (Sunday) to 6 (Saturday), as Date.getDay() counts them.
  value: number;
  onChange: (weekday: number) => void;
};

// The seven days by their initial, in the order of the user's calendar.
export function WeekdayPicker({ value, onChange }: WeekdayPickerProps) {
  const { language } = useTranslation();
  const firstWeekday = useFirstWeekday();
  // Any week would do: only the weekday of each date is used.
  const days = getWeekDays(new Date(), firstWeekday);

  return (
    <View style={styles.days} accessibilityRole="radiogroup">
      {days.map((day) => {
        const weekday = day.getDay();
        return (
          <Chip
            key={weekday}
            role="radio"
            label={day
              .toLocaleDateString(language, { weekday: "narrow" })
              .toLocaleUpperCase(language)}
            accessibilityLabel={day.toLocaleDateString(language, {
              weekday: "long",
            })}
            selected={weekday === value}
            onPress={() => onChange(weekday)}
            style={styles.day}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  days: {
    flexDirection: "row",
    gap: spacing.xs,
  },
  // Seven to a row only fit without the chip's own padding.
  day: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 0,
  },
});
