import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { Pressable, StyleSheet, Text } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useCloseOnBack } from "@/hooks/use-close-on-back";
import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const ANIMATION_MS = 150;
const MENU_WIDTH = 240;

export type ActionMenuItem = {
  id: string;
  label: string;
  icon: SymbolViewProps["name"];
  // "danger" for what deletes.
  tone?: "default" | "danger";
};

// Where the menu goes within the screen: just below the button that opened
// it, with their right edges lined up.
export type ActionMenuAnchor = {
  top: number;
  right: number;
};

type ActionMenuProps = {
  items: readonly ActionMenuItem[];
  anchor: ActionMenuAnchor;
  closeLabel: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

// A small dropdown of actions over the content, without a backdrop: the screen
// stays as it is, and a tap anywhere outside the menu closes it.
export function ActionMenu({
  items,
  anchor,
  closeLabel,
  onSelect,
  onClose,
}: ActionMenuProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  useCloseOnBack(true, onClose);

  return (
    <>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
      />
      <Animated.View
        entering={FadeIn.duration(ANIMATION_MS)}
        exiting={FadeOut.duration(ANIMATION_MS)}
        style={[styles.menu, anchor]}
      >
        {items.map((item) => {
          const color = item.tone === "danger" ? colors.danger : colors.text;
          return (
            <Pressable
              key={item.id}
              style={({ pressed }) => [
                styles.item,
                pressed && styles.itemPressed,
              ]}
              onPress={() => onSelect(item.id)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
            >
              <SymbolView
                name={item.icon}
                tintColor={color}
                size={iconSizes.md}
              />
              <Text style={[styles.label, { color }]} numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>
    </>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    menu: {
      position: "absolute",
      width: MENU_WIDTH,
      paddingVertical: spacing.xs,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.sm,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: controlHeights.lg,
      paddingHorizontal: spacing.sm,
    },
    itemPressed: {
      backgroundColor: colors.background,
    },
    label: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
    },
  }),
);
