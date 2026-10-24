import { SymbolView } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
} from "@/constants/theme";

type DayBoxProps = {
  dayOfMonth: number;
  trained: boolean;
  isToday: boolean;
  // A day already gone without a workout.
  missed: boolean;
};

export function DayBox({ dayOfMonth, trained, isToday, missed }: DayBoxProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={[
        styles.box,
        missed && styles.missedBox,
        trained
          ? styles.trainedBox
          : isToday
            ? styles.activeBox
            : styles.disabledBox,
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
          {dayOfMonth}
        </Text>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      width: 36,
      height: 36,
      borderRadius: radii.sm,
      // Always set: trained days arrive after a first render as missed, and a
      // dashed border left out of the style isn't reset back to solid.
      borderStyle: "solid",
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
