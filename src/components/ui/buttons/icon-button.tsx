import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

import { controlHeights, iconSizes, radii } from "@/constants/theme";

type IconButtonProps = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress: () => void;
  // "muted" is a gray outline that turns to the accent when pressed, for
  // secondary actions such as showing an exercise's info.
  tone?: "primary" | "danger" | "muted";
  // Width and height; a control height square unless a neighbor sets another.
  size?: number;
  // Some glyphs, like the xmark, look bigger than the rest and go a size down.
  iconSize?: number;
  // Without the outline the icon stands alone, for a quiet action next to text.
  bordered?: boolean;
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = "primary",
  size = controlHeights.md,
  iconSize = iconSizes.md,
  bordered = true,
}: IconButtonProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  function getColors(pressed: boolean) {
    if (tone === "muted") {
      return {
        border: pressed ? colors.primary : colors.border,
        fill: undefined,
        icon: pressed ? colors.primary : colors.disabled,
      };
    }
    const color = tone === "danger" ? colors.danger : colors.primary;
    const onColor = tone === "danger" ? colors.onDanger : colors.onPrimary;
    return {
      border: color,
      fill: pressed ? color : undefined,
      icon: pressed ? onColor : color,
    };
  }

  return (
    <Pressable
      style={({ pressed }) => {
        const { border, fill } = getColors(pressed);
        return [
          styles.box,
          { width: size, height: size },
          bordered
            ? { borderColor: border, backgroundColor: fill }
            : styles.bare,
        ];
      }}
      // A small bare icon keeps a comfortable area to tap.
      hitSlop={
        bordered ? undefined : Math.max(0, (controlHeights.md - size) / 2)
      }
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {({ pressed }) => (
        <SymbolView
          name={icon}
          tintColor={getColors(pressed).icon}
          size={iconSize}
        />
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(() =>
  StyleSheet.create({
    box: {
      width: controlHeights.md,
      height: controlHeights.md,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: radii.xs,
    },
    bare: {
      borderColor: "transparent",
    },
  }),
);
