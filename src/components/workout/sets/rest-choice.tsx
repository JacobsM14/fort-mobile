import { Pressable, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { spacing } from "@/constants/theme";

type RestChoiceProps = {
  onTimed: () => void;
  onNone: () => void;
};

export function RestChoice({ onTimed, onNone }: RestChoiceProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <View style={styles.row}>
      <Pressable
        style={({ pressed }) => [
          globalStyles.pressedButton,
          styles.button,
          pressed && styles.pressed,
        ]}
        onPress={onTimed}
        accessibilityRole="button"
      >
        <Text style={[globalStyles.pressedButtonText, styles.label]}>
          {t.workout.timeRest}
        </Text>
      </Pressable>
      <Pressable
        style={({ pressed }) => [
          globalStyles.notPressedButton,
          styles.button,
          pressed && styles.pressed,
        ]}
        onPress={onNone}
        accessibilityRole="button"
      >
        <Text style={[globalStyles.notPressedButtonText, styles.label]}>
          {t.workout.noRest}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    alignItems: "center",
  },
  pressed: {
    opacity: 0.7,
  },
  label: {
    textAlign: "center",
  },
});
