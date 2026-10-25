import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DayBox } from "@/components/today/day-box";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { formatDayHeader } from "@/utils/date";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

type DayRowProps = {
  day: Date;
  exerciseCount: number;
  onPress: () => void;
};

export function DayRow({ day, exerciseCount, onPress }: DayRowProps) {
  const { t, language } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const open = useFocusedPress(onPress);
  const today = new Date();
  const trained = exerciseCount > 0;
  const isToday = day.toDateString() === today.toDateString();
  const missed = !trained && !isToday && day < today;
  const title = formatDayHeader(day, language);
  const detail = trained
    ? t.history.exerciseCount(exerciseCount)
    : t.history.noWorkout;

  return (
    <Pressable
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
      onPress={open}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${detail}`}
    >
      {({ pressed }) => (
        <>
          <DayBox
            dayOfMonth={day.getDate()}
            trained={trained}
            isToday={isToday}
            missed={missed}
          />
          <View style={styles.info}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{detail}</Text>
          </View>
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            tintColor={pressed ? colors.primary : colors.disabled}
            size={iconSizes.md}
          />
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      paddingHorizontal: spacing.sm,
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.sm,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.border,
    },
    rowPressed: {
      backgroundColor: colors.primaryTint,
    },
    info: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
