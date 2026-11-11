import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles } from "@/hooks/use-theme";

import { fontsInstrument, radii, spacing } from "@/constants/theme";

type NoContentBoxProps = {
  label: string;
  fill?: boolean;
  onPress?: () => void;
};

export function NoContentBox({
  label,
  fill = false,
  onPress,
}: NoContentBoxProps) {
  const styles = useStyles();

  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        fill ? styles.fill : styles.fixed,
        pressed && styles.pressed,
      ]}
      onPress={handlePress}
      disabled={onPress === undefined}
      accessibilityRole={onPress === undefined ? undefined : "button"}
    >
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.lineHorizontal} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.lineHorizontal} />
      </View>
      <View style={styles.line} />
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      borderRadius: radii.md,
      alignItems: "center",
      gap: spacing.sm,
    },
    fixed: {
      height: 300,
    },
    fill: {
      flex: 1,
    },
    pressed: {
      opacity: 0.6,
    },
    line: {
      flex: 1,
      width: 1,
      backgroundColor: colors.border,
    },
    row: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    lineHorizontal: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    label: {
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
  }),
);
