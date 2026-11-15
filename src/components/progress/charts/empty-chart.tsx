import { StyleSheet, Text } from "react-native";

import { CornerFrame } from "@/components/ui/layout/corner-frame";

import { makeStyles } from "@/hooks/use-theme";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type EmptyChartProps = {
  label: string;
};

// What a chart with nothing to draw shows instead: its message in a frame.
export function EmptyChart({ label }: EmptyChartProps) {
  const styles = useStyles();

  return (
    <CornerFrame style={styles.frame}>
      <Text style={styles.text}>{label}</Text>
    </CornerFrame>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    frame: {
      alignItems: "center",
      paddingVertical: spacing.lg,
    },
    text: {
      textAlign: "center",
      fontSize: fontSizes.lead,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
  }),
);
