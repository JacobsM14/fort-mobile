import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { StopwatchState } from "@/features/workouts/sets";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type Tone = "filled" | "outline" | "muted";

type Control = {
  key: string;
  label: string;
  icon: SymbolViewProps["name"];
  tone: Tone;
  enabled: boolean;
  onPress: () => void;
};

type StopwatchControlsProps = {
  status: StopwatchState["status"];
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onReset: () => void;
};

export function StopwatchControls({
  status,
  onStart,
  onPause,
  onStop,
  onReset,
}: StopwatchControlsProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();
  const started = status !== "idle";

  const controls: Control[] = [
    {
      key: "start",
      label: status === "paused" ? t.workout.resume : t.workout.start,
      icon: { ios: "play.fill", android: "play_arrow", web: "play_arrow" },
      tone: "filled",
      enabled: status !== "running",
      onPress: onStart,
    },
    {
      key: "pause",
      label: t.workout.pause,
      icon: { ios: "pause.fill", android: "pause", web: "pause" },
      tone: "outline",
      enabled: status === "running",
      onPress: onPause,
    },
    {
      key: "stop",
      label: t.workout.stop,
      icon: { ios: "stop.fill", android: "stop", web: "stop" },
      tone: "outline",
      enabled: started,
      onPress: onStop,
    },
    {
      key: "reset",
      label: t.workout.reset,
      icon: {
        ios: "arrow.counterclockwise",
        android: "replay",
        web: "replay",
      },
      tone: "muted",
      enabled: started,
      onPress: onReset,
    },
  ];

  function getContentColor(tone: Tone) {
    switch (tone) {
      case "filled":
        return colors.onPrimary;
      case "outline":
        return colors.primary;
      case "muted":
        return colors.disabled;
    }
  }

  return (
    <View style={styles.controls}>
      {controls.map((control) => {
        const color = getContentColor(control.tone);
        return (
          <Pressable
            key={control.key}
            style={({ pressed }) => [
              styles.control,
              styles[control.tone],
              pressed && styles[`${control.tone}Pressed`],
              !control.enabled && styles.disabled,
            ]}
            onPress={control.onPress}
            disabled={!control.enabled}
            accessibilityRole="button"
            accessibilityLabel={control.label}
            accessibilityState={{ disabled: !control.enabled }}
          >
            <SymbolView
              name={control.icon}
              tintColor={color}
              size={iconSizes.lg}
            />
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {control.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const CONTROL_HEIGHT = 64;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    controls: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    control: {
      flex: 1,
      height: CONTROL_HEIGHT,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      borderWidth: 1,
      borderRadius: radii.xs,
    },
    filled: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filledPressed: {
      opacity: 0.8,
    },
    outline: {
      borderColor: colors.primary,
    },
    outlinePressed: {
      backgroundColor: colors.primaryTint,
    },
    muted: {
      borderColor: colors.border,
    },
    mutedPressed: {
      backgroundColor: colors.primaryTint,
    },
    disabled: {
      opacity: 0.4,
    },
    label: {
      fontSize: fontSizes.footnote,
      fontFamily: fontsInstrument.semiBold,
    },
  }),
);
