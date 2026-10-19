import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { CornerFrame } from "@/components/ui/layout/corner-frame";
import { Backdrop } from "@/components/ui/overlays/backdrop";
import {
  fontsInstrument,
  fontSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";
import { useCloseOnBack } from "@/hooks/use-close-on-back";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "primary" | "danger";
};

export function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  tone = "primary",
}: ConfirmDialogProps) {
  const { colors } = useTheme();
  const styles = useStyles();
  const accent = tone === "danger" ? colors.danger : colors.primary;
  const onAccent = tone === "danger" ? colors.onDanger : colors.onPrimary;
  const confirm = useFocusedPress(onConfirm);

  useCloseOnBack(visible, onCancel);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Backdrop onPress={onCancel} label={cancelLabel} />
      <Animated.View
        entering={FadeIn}
        exiting={FadeOut}
        style={styles.center}
        accessibilityViewIsModal
      >
        <View style={styles.panel}>
          <CornerFrame style={styles.content} color={accent}>
            <Text style={styles.title} accessibilityRole="header">
              {title}
            </Text>
            <Text style={styles.message}>{message}</Text>
            <View style={styles.actions}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  pressed && styles.cancelButtonPressed,
                ]}
                onPress={onCancel}
                accessibilityRole="button"
              >
                <Text style={[styles.buttonLabel, styles.cancelLabel]}>
                  {cancelLabel}
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { backgroundColor: accent, borderColor: accent },
                  pressed && styles.confirmButtonPressed,
                ]}
                onPress={confirm}
                accessibilityRole="button"
              >
                <Text style={[styles.buttonLabel, { color: onAccent }]}>
                  {confirmLabel}
                </Text>
              </Pressable>
            </View>
          </CornerFrame>
        </View>
      </Animated.View>
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    center: {
      position: "absolute",
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
      pointerEvents: "box-none",
    },
    panel: {
      width: "100%",
      maxWidth: 420,
      padding: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
    },
    content: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      gap: spacing.md,
    },
    title: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    message: {
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    button: {
      flex: 1,
      minHeight: 56,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderRadius: radii.sm,
    },
    cancelButton: {
      borderColor: colors.border,
    },
    cancelButtonPressed: {
      backgroundColor: colors.background,
    },
    confirmButtonPressed: {
      opacity: 0.85,
    },
    buttonLabel: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.bold,
    },
    cancelLabel: {
      color: colors.text,
    },
  }),
);
