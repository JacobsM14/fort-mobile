import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { spacing } from "@/constants/theme";

type WorkoutFooterProps = {
  onCancel: () => void;
  onFinish: () => void;
};

// Fixed under the scrolling content, so finishing is always at hand.
export function WorkoutFooter({ onCancel, onFinish }: WorkoutFooterProps) {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.footer}>
      <Pressable
        style={({ pressed }) => [
          globalStyles.notPressedButton,
          styles.cancel,
          pressed && styles.cancelPressed,
        ]}
        onPress={onCancel}
        accessibilityRole="button"
      >
        <Text style={globalStyles.notPressedButtonText}>
          {t.workout.cancel}
        </Text>
      </Pressable>
      <View style={styles.finish}>
        <PrimaryButton label={t.workout.finish} onPress={onFinish} />
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    footer: {
      flexDirection: "row",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
    },
    cancel: {
      flex: 1,
      alignItems: "center",
    },
    cancelPressed: {
      borderColor: colors.primary,
    },
    finish: {
      flex: 2,
    },
  }),
);
