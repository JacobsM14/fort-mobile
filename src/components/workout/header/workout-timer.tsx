import { SymbolView } from "expo-symbols";
import { StyleSheet, View } from "react-native";

import { ElapsedTime } from "@/components/workout/shared/elapsed-time";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  fontsJetBrainsMono,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type WorkoutTimerProps = {
  startedAt: Date;
};

// How long the workout has been going, counted from when it started, so it
// keeps the right time after leaving and coming back.
export function WorkoutTimer({ startedAt }: WorkoutTimerProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View
      style={styles.timer}
      accessibilityRole="timer"
      accessibilityLabel={t.workout.elapsed}
    >
      <SymbolView
        name={{ ios: "stopwatch", android: "timer", web: "timer" }}
        tintColor={colors.primary}
        size={iconSizes.sm}
      />
      <ElapsedTime since={startedAt} style={styles.time} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    timer: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
      backgroundColor: colors.primaryTint,
    },
    time: {
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.primary,
    },
  }),
);
