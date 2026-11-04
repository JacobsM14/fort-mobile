import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { DashedButton } from "@/components/ui/buttons/dashed-button";

import { useCloseOnBack } from "@/hooks/use-close-on-back";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { TRACKING_TYPE_ICONS } from "@/constants/tracking-type-icons";

import type { TrackingType } from "@/constants/enums";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  fontsJetBrainsMono,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

const ANIMATION_MS = 150;

type ExerciseSelectButtonProps = {
  position: number;
  total: number;
  open: boolean;
  onPress: () => void;
};

export function ExerciseSelectButton({
  position,
  total,
  open,
  onPress,
}: ExerciseSelectButtonProps) {
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
      accessibilityLabel={t.workout.chooseExercise(position, total)}
      accessibilityState={{ expanded: open }}
    >
      {({ pressed }) => {
        const color = open || pressed ? colors.primary : colors.text;
        return (
          <>
            <Text style={[styles.position, { color }]}>
              {position}/{total}
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

export type ExerciseSelectItem = {
  id: string;
  name: string;
  trackingType: TrackingType;
  done: boolean;
};

export type MenuAnchor = {
  top: number;
  left: number;
  width: number;
};

type ExerciseSelectMenuProps = {
  items: readonly ExerciseSelectItem[];
  currentId: string | undefined;
  // Where the menu goes within the screen: just below the header that holds
  // the button, as wide as it.
  anchor: MenuAnchor;
  onSelect: (id: string) => void;
  // Without it, the menu only picks among the items (no "extra exercise").
  onAddExercise?: () => void;
  onClose: () => void;
};

// A dropdown over the content, without a backdrop: the screen stays as it is,
// and a tap anywhere outside the menu closes it.
export function ExerciseSelectMenu({
  items,
  currentId,
  anchor,
  onSelect,
  onAddExercise,
  onClose,
}: ExerciseSelectMenuProps) {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const styles = useStyles();

  useCloseOnBack(true, onClose);

  return (
    <>
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel={t.workout.closeExercises}
      />
      <Animated.View
        entering={FadeIn.duration(ANIMATION_MS)}
        exiting={FadeOut.duration(ANIMATION_MS)}
        style={[styles.menu, anchor]}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          {items.map((item) => {
            const current = item.id === currentId;
            return (
              <Pressable
                key={item.id}
                style={({ pressed }) => [
                  styles.item,
                  pressed && styles.itemPressed,
                ]}
                onPress={() => onSelect(item.id)}
                accessibilityRole="button"
                accessibilityLabel={
                  item.done ? t.workout.exerciseDone(item.name) : item.name
                }
                accessibilityState={{ selected: current }}
              >
                <View
                  style={[
                    styles.box,
                    item.done ? styles.doneBox : styles.typeBox,
                  ]}
                >
                  <SymbolView
                    name={
                      item.done
                        ? { ios: "checkmark", android: "check", web: "check" }
                        : TRACKING_TYPE_ICONS[item.trackingType]
                    }
                    tintColor={item.done ? colors.onPrimary : colors.disabled}
                    size={iconSizes.sm}
                  />
                </View>
                <Text
                  style={[styles.name, current && styles.nameCurrent]}
                  numberOfLines={2}
                >
                  {item.name}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
        {onAddExercise !== undefined && (
          <View style={styles.footer}>
            <DashedButton
              icon={{ ios: "plus", android: "add", web: "add" }}
              label={t.workout.extraExercise}
              onPress={onAddExercise}
            />
          </View>
        )}
      </Animated.View>
    </>
  );
}

const BOX_SIZE = 32;

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    button: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      height: controlHeights.md,
      paddingHorizontal: spacing.sm,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.xs,
    },
    buttonActive: {
      borderColor: colors.primary,
    },
    footer: {
      paddingHorizontal: spacing.sm,
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
    },
    position: {
      fontSize: fontSizes.label,
      fontFamily: fontsJetBrainsMono.medium,
    },
    menu: {
      position: "absolute",
      maxHeight: "55%",
      paddingVertical: spacing.xs,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.primary,
      borderRadius: radii.xs,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: controlHeights.lg,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    itemPressed: {
      backgroundColor: colors.background,
    },
    box: {
      width: BOX_SIZE,
      height: BOX_SIZE,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderRadius: radii.xs,
    },
    typeBox: {
      borderColor: colors.border,
    },
    doneBox: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    name: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    nameCurrent: {
      color: colors.primary,
    },
  }),
);
