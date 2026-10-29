import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type ExercisePickerButtonProps = {
  name: string;
  open: boolean;
  onPress: () => void;
};

// The exercise being charted, opening the list to pick another. The button
// takes the room it is given whatever the name, which is cut short when it
// doesn't fit, and the arrow stays at the right end.
export function ExercisePickerButton({
  name,
  open,
  onPress,
}: ExercisePickerButtonProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        (open || pressed) && styles.buttonActive,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t.progress.chooseExercise(name)}
      accessibilityState={{ expanded: open }}
    >
      {({ pressed }) => {
        const color = open || pressed ? colors.primary : colors.text;
        return (
          <>
            <Text
              style={[styles.name, { color }]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {name}
            </Text>
            <SymbolView
              name={
                open
                  ? {
                      ios: "chevron.up",
                      android: "expand_less",
                      web: "expand_less",
                    }
                  : {
                      ios: "chevron.down",
                      android: "expand_more",
                      web: "expand_more",
                    }
              }
              tintColor={color}
              size={iconSizes.sm}
            />
          </>
        );
      }}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      flex: 1,
      // Lets the row shrink the button below its text's width.
      minWidth: 0,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.xs,
      height: controlHeights.md,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.sm,
    },
    buttonActive: {
      borderColor: colors.primary,
    },
    name: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
    },
  }),
);
