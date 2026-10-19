import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { iconSizes } from "@/constants/theme";

export const DELETE_SET_WIDTH = 28;

type DeleteSetButtonProps = {
  number: number;
  onPress: () => void;
};

// Borderless and gray, so it doesn't read as a second check box next to the
// one that marks the set.
export function DeleteSetButton({ number, onPress }: DeleteSetButtonProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();

  return (
    <Pressable
      style={styles.button}
      onPress={onPress}
      hitSlop={{ top: 0, bottom: 0, left: 0, right: 8 }}
      accessibilityRole="button"
      accessibilityLabel={t.workout.deleteSet(number)}
    >
      {({ pressed }) => (
        <SymbolView
          name={{ ios: "xmark", android: "close", web: "close" }}
          tintColor={pressed ? colors.danger : colors.disabled}
          size={iconSizes.sm}
        />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: DELETE_SET_WIDTH,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
