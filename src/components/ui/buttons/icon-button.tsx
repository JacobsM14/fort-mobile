import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { iconSizes, radii } from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type IconButtonProps = {
  icon: SymbolViewProps["name"];
  accessibilityLabel: string;
  onPress: () => void;
  // "muted" is a gray outline that turns to the accent when pressed, for
  // secondary actions such as showing an exercise's info.
  tone?: "primary" | "danger" | "muted";
};

export function IconButton({
  icon,
  accessibilityLabel,
  onPress,
  tone = "primary",
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
        return [styles.box, { borderColor: border, backgroundColor: fill }];
      }}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {({ pressed }) => (
        <SymbolView
          name={icon}
          tintColor={getColors(pressed).icon}
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
