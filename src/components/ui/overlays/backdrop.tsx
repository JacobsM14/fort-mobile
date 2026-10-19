import { Pressable, StyleSheet } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { makeStyles } from "@/hooks/use-theme";

type BackdropProps = {
  onPress: () => void;
  // Screen readers announce the backdrop as a button that closes the overlay.
  label: string;
};

export function Backdrop({ onPress, label }: BackdropProps) {
  const styles = useStyles();

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={[StyleSheet.absoluteFill, styles.backdrop]}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={label}
      />
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    backdrop: {
      backgroundColor: colors.scrim,
    },
  }),
);
