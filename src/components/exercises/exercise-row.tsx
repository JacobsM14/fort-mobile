import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import type { TrackingType } from "@/constants/enums";
import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";

const TRACKING_TYPE_ICONS: Record<TrackingType, SymbolViewProps["name"]> = {
  weight_reps: {
    ios: "dumbbell.fill",
    android: "fitness_center",
    web: "fitness_center",
  },
  bodyweight_reps: {
    ios: "figure.strengthtraining.functional",
    android: "sports_gymnastics",
    web: "sports_gymnastics",
  },
  duration: { ios: "timer", android: "timer", web: "timer" },
  distance_duration: {
    ios: "figure.run",
    android: "directions_run",
    web: "directions_run",
  },
};

type ExerciseRowProps = {
  name: string;
  detail: string;
  trackingType: TrackingType;
  onInfo?: () => void;
  infoLabel?: string;
} & (
  | { selected: boolean; onToggle: () => void }
  | { removeLabel: string; onRemove: () => void }
);

export function ExerciseRow(props: ExerciseRowProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.row}>
      <View style={styles.typeBox}>
        <SymbolView
          name={TRACKING_TYPE_ICONS[props.trackingType]}
          tintColor={colors.text}
          size={iconSizes.md}
        />
      </View>
      <View style={styles.text}>
        <Text style={styles.name} numberOfLines={2}>
          {props.name}
        </Text>
        <Text style={styles.detail} numberOfLines={1}>
          {props.detail}
        </Text>
      </View>
      {props.onInfo !== undefined && (
        <Pressable
          style={({ pressed }) => [
            styles.box,
            styles.outlineBox,
            pressed && styles.outlineBoxPressed,
          ]}
          onPress={props.onInfo}
          accessibilityRole="button"
          accessibilityLabel={props.infoLabel}
        >
          {({ pressed }) => (
            <SymbolView
              name={{ ios: "info.circle", android: "info", web: "info" }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.md}
            />
          )}
        </Pressable>
      )}
      {"onRemove" in props ? (
        <Pressable
          style={({ pressed }) => [
            styles.box,
            styles.outlineBox,
            pressed && styles.outlineBoxPressed,
          ]}
          onPress={props.onRemove}
          accessibilityRole="button"
          accessibilityLabel={props.removeLabel}
        >
          {({ pressed }) => (
            <SymbolView
              name={{ ios: "xmark", android: "close", web: "close" }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.sm}
            />
          )}
        </Pressable>
      ) : (
        <Pressable
          style={({ pressed }) => [
            styles.box,
            props.selected ? styles.addedBox : styles.addBox,
            pressed && styles.togglePressed,
          ]}
          onPress={props.onToggle}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: props.selected }}
          accessibilityLabel={props.name}
        >
          <SymbolView
            name={
              props.selected
                ? { ios: "checkmark", android: "check", web: "check" }
                : { ios: "plus", android: "add", web: "add" }
            }
            tintColor={props.selected ? colors.onPrimary : colors.primary}
            size={iconSizes.md}
          />
        </Pressable>
      )}
    </View>
  );
}

const BOX_SIZE = 44;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    typeBox: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
    },
    text: {
      flex: 1,
    },
    name: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
    box: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: radii.sm,
    },
    outlineBox: {
      borderColor: colors.border,
    },
    outlineBoxPressed: {
      borderColor: colors.primary,
    },
    addBox: {
      borderColor: colors.primary,
    },
    addedBox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    togglePressed: {
      opacity: 0.7,
    },
  }),
);
