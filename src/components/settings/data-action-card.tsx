import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

type DataActionCardProps = {
  icon: SymbolViewProps["name"];
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  disabled?: boolean;
  // How the last attempt went, shown above the button.
  message?: string;
  error?: string;
};

// One action of the data screen (export, import): what it does and a button
// to run it. The screen frames the actions together.
export function DataActionCard({
  icon,
  title,
  description,
  buttonLabel,
  onPress,
  disabled = false,
  message,
  error,
}: DataActionCardProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <SymbolView
          name={icon}
          tintColor={colors.primary}
          size={iconSizes.hero}
        />
        <View style={styles.texts}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      {message !== undefined && <Text style={styles.message}>{message}</Text>}
      {error !== undefined && (
        <Text style={styles.error} accessibilityRole="alert">
          {error}
        </Text>
      )}
      <PrimaryButton
        label={buttonLabel}
        onPress={onPress}
        disabled={disabled}
      />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: {
      gap: spacing.md,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    texts: {
      flex: 1,
      gap: spacing.xs,
    },
    title: {
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    description: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.regular,
      color: colors.disabled,
    },
    message: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.semiBold,
      color: colors.primary,
    },
    error: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.semiBold,
      color: colors.danger,
    },
  }),
);
