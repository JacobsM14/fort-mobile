import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from "react-native";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles } from "@/hooks/use-theme";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  radii,
} from "@/constants/theme";

type SecondaryButtonProps = {
  label: string;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
};

// The outlined button that goes next to a PrimaryButton, with its size.
export function SecondaryButton({
  label,
  onPress,
  style,
}: SecondaryButtonProps) {
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
        style,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      justifyContent: "center",
      width: "100%",
      minHeight: controlHeights.xl,
      borderWidth: 1,
      borderColor: colors.disabled,
      borderRadius: radii.xs,
    },
    buttonPressed: {
      opacity: 0.6,
    },
    label: {
      fontSize: fontSizes.button,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
  }),
);
