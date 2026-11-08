import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { makeStyles } from "@/hooks/use-theme";

import { fontsInstrument, fontSizes, spacing } from "@/constants/theme";

type ImagePlaceholderProps = {
  aspectRatio: number;
  label: string;
  style?: StyleProp<ViewStyle>;
};

export function ImagePlaceholder({
  aspectRatio,
  label,
  style,
}: ImagePlaceholderProps) {
  const styles = useStyles();

  const length = Math.hypot(1, 1 / aspectRatio);
  const angle = Math.atan2(1, aspectRatio);

  return (
    <View style={[styles.box, { aspectRatio }, style]}>
      <View
        style={[
          styles.track,
          {
            left: `${((1 - length) / 2) * 100}%`,
            width: `${length * 100}%`,
            transform: [{ rotate: `${-angle}rad` }],
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.line} />
          <Text style={styles.label} numberOfLines={1}>
            {label}
          </Text>
          <View style={styles.line} />
        </View>
      </View>
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      width: "100%",
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    track: {
      position: "absolute",
      top: 0,
      bottom: 0,
      justifyContent: "center",
      paddingHorizontal: spacing.sm,
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: colors.border,
    },
    label: {
      fontSize: fontSizes.caption,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
