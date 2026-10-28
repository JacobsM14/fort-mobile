import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";

import { makeStyles } from "@/hooks/use-theme";

import {
  fontsInstrument,
  fontSizes,
  lineHeights,
  radii,
  spacing,
} from "@/constants/theme";

type EmptyStateCardProps = {
  title: string;
  message: string;
  // Without them the card only explains: the way out isn't a button.
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyStateCard({
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateCardProps) {
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {actionLabel !== undefined && onAction !== undefined && (
        <PrimaryButton label={actionLabel} onPress={onAction} />
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: {
      gap: spacing.md,
      padding: spacing.lg,
      borderWidth: 1,
      borderStyle: "dashed",
      borderColor: colors.border,
      borderRadius: radii.sm,
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
  }),
);
