import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";

import { spacing } from "@/constants/theme";
import { makeStyles } from "@/hooks/use-theme";

type ImagePlaceholderProps = {
  aspectRatio: number;
  style?: StyleProp<ViewStyle>;
};

export function ImagePlaceholder({
  aspectRatio,
  style,
}: ImagePlaceholderProps) {
  const styles = useStyles();
  // With a fixed aspect ratio, the diagonal's length and angle are proportional
  // to the width, so the track spans corner to corner without measuring the
  // box. Its padding keeps the line short of the corners.
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
        <View style={styles.line} />
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
      top: "50%",
      paddingHorizontal: spacing.sm,
    },
    line: {
      height: 1,
      backgroundColor: colors.border,
    },
  }),
);
