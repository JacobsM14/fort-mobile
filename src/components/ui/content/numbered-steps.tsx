import { StyleSheet, Text, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  fontsInstrument,
  fontsJetBrainsMono,
  fontSizes,
  lineHeights,
  spacing,
} from "@/constants/theme";

type NumberedStepsProps = {
  title: string;
  steps: readonly string[];
};

export function NumberedSteps({ title, steps }: NumberedStepsProps) {
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.list}>
      <Text style={globalStyles.inputLabel}>{title}</Text>
      {steps.map((step, index) => (
        <View key={step} style={styles.step}>
          <Text style={styles.number}>
            {String(index + 1).padStart(2, "0")}
          </Text>
          <Text style={styles.text}>{step}</Text>
        </View>
      ))}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    list: {
      gap: spacing.xs,
    },
    step: {
      flexDirection: "row",
      alignItems: "baseline",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.xs,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    number: {
      fontSize: fontSizes.caption,
      fontFamily: fontsJetBrainsMono.medium,
      color: colors.primary,
    },
    text: {
      flex: 1,
      fontSize: fontSizes.body,
      lineHeight: lineHeights.body,
      fontFamily: fontsInstrument.regular,
      color: colors.text,
    },
  }),
);
