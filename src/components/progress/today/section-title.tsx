import { StyleSheet, Text } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import { spacing } from "@/constants/theme";

type SectionTitleProps = {
  label: string;
};

export function SectionTitle({ label }: SectionTitleProps) {
  const { globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <Text
      style={[globalStyles.inputLabel, styles.title]}
      accessibilityRole="header"
    >
      {label}
    </Text>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    title: {
      paddingBottom: spacing.xs,
      marginBottom: spacing.sm,
      borderBottomColor: colors.border,
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  }),
);
