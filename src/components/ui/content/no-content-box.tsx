import { StyleSheet, Text, View } from "react-native";

import { makeStyles } from "@/hooks/use-theme";

import { fontsInstrument, radii, spacing } from "@/constants/theme";

type NoContentBoxProps = {
  label: string;
};

export function NoContentBox({ label }: NoContentBoxProps) {
  const styles = useStyles();

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <View style={styles.row}>
        <View style={styles.lineHorizontal} />
        <Text style={styles.label}>{label}</Text>
        <View style={styles.lineHorizontal} />
      </View>
      <View style={styles.line} />
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      height: 300,
      backgroundColor: colors.background,
      borderRadius: radii.md,
      alignItems: "center",
      gap: spacing.sm,
    },
    line: {
      flex: 1,
      width: 1,
      backgroundColor: colors.border,
    },
    row: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    lineHorizontal: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    label: {
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
  }),
);
