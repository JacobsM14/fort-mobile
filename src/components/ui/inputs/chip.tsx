import { SymbolView, type SymbolViewProps } from "expo-symbols";
import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useTheme } from "@/hooks/use-theme";

import { iconSizes, spacing } from "@/constants/theme";

type ChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  // "radio" for groups where only one chip can be on.
  role?: "checkbox" | "radio";
  icon?: SymbolViewProps["name"];
  style?: StyleProp<ViewStyle>;
  // For a label too short to be read aloud on its own, like a day's initial.
  accessibilityLabel?: string;
};

export function Chip({
  label,
  selected,
  onPress,
  role = "checkbox",
  icon,
  style,
  accessibilityLabel,
}: ChipProps) {
  const { colors, globalStyles } = useTheme();

  return (
    <Pressable
      style={[
        selected ? globalStyles.pressedButton : globalStyles.notPressedButton,
        icon !== undefined && styles.withIcon,
        style,
      ]}
      onPress={onPress}
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={accessibilityLabel}
    >
      {icon !== undefined && (
        <SymbolView
          name={icon}
          tintColor={selected ? colors.onPrimary : colors.disabled}
          size={iconSizes.sm}
        />
      )}
      <Text
        style={
          selected
            ? globalStyles.pressedButtonText
            : globalStyles.notPressedButtonText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  withIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
});
