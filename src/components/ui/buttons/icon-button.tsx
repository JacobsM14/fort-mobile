import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { iconSizes, radii } from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type IconButtonProps = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress: () => void;
  tone?: "primary" | "danger";
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = "primary",
}: IconButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const color = tone === "danger" ? colors.danger : colors.primary;
  const onColor = tone === "danger" ? colors.onDanger : colors.onPrimary;
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.box,
        { borderColor: color },
        pressed && { backgroundColor: color },
      ]}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {({ pressed }) => (
        <SymbolView
          name={icon}
          tintColor={pressed ? onColor : color}
          size={iconSizes.md}
        />
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    box: {
      width: 44,
      height: 44,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: radii.sm,
    },
  }),
);
