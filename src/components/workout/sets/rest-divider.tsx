import { Pressable, StyleSheet, Text, View } from "react-native";

import { ElapsedTime } from "@/components/workout/shared/elapsed-time";
import {
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  radii,
  spacing,
} from "@/constants/theme";
import { makeStyles } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { formatDuration } from "@/utils/duration";

type RestDividerProps =
  { startedAt: Date; onStop: () => void } | { seconds: number };

// The rest between two sets, between lines: live in the accent color while it
// runs, then fixed in gray.
export function RestDivider(props: RestDividerProps) {
  const { t } = useTranslation();
  const styles = useStyles();

  if ("seconds" in props) {
    const time = formatDuration(props.seconds);
    return (
      <View
        style={styles.row}
        accessible
        accessibilityLabel={t.workout.rest(time)}
      >
        <View style={styles.line} />
        <Text style={styles.time}>{time}</Text>
        <View style={styles.line} />
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={[styles.line, styles.lineRunning]} />
      <ElapsedTime
        since={props.startedAt}
        style={[styles.time, styles.timeRunning]}
      />
      <Pressable
        style={({ pressed }) => [styles.stop, pressed && styles.stopPressed]}
        onPress={props.onStop}
        hitSlop={spacing.sm}
        accessibilityRole="button"
      >
        {({ pressed }) => (
          <Text style={[styles.stopText, pressed && styles.stopTextPressed]}>
            {t.workout.stopRest}
          </Text>
        )}
      </Pressable>
      <View style={[styles.line, styles.lineRunning]} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 32,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    lineRunning: {
      backgroundColor: colors.primary,
    },
    time: {
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.disabled,
    },
    timeRunning: {
      fontSize: fontSizes.lead,
      color: colors.primary,
    },
    stop: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.xs,
    },
    stopPressed: {
      backgroundColor: colors.primary,
    },
    stopText: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsInstrument.semiBold,
      color: colors.primary,
    },
    stopTextPressed: {
      color: colors.onPrimary,
    },
  }),
);
