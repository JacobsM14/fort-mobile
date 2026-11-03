import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { BottomSheet } from "@/components/ui/overlays/bottom-sheet";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  spacing,
} from "@/constants/theme";

export type SelectOption<T extends string> = {
  value: T;
  label: string;
};

type OptionsSheetProps<T extends string> = {
  visible: boolean;
  title: string;
  closeLabel: string;
  options: readonly SelectOption<T>[];
  value: T;
  onSelect: (value: T) => void;
  onClose: () => void;
};

// The list a SelectField opens, in a sheet from the bottom so it can hold as
// many options as there are and scroll. Put it outside any scroll view: the
// sheet is positioned against the screen.
export function OptionsSheet<T extends string>({
  visible,
  title,
  closeLabel,
  options,
  value,
  onSelect,
  onClose,
}: OptionsSheetProps<T>) {
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();

  return (
    <BottomSheet
      visible={visible}
      onClose={onClose}
      closeLabel={closeLabel}
      header={
        <View style={[globalStyles.dualheader, styles.header]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      }
    >
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        accessibilityRole="radiogroup"
      >
        {options.map((option) => {
          const selected = option.value === value;
          return (
            <Pressable
              key={option.value}
              style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
              ]}
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
            >
              <Text
                style={[styles.label, selected && styles.labelSelected]}
                numberOfLines={1}
              >
                {option.label}
              </Text>
              {selected && (
                <SymbolView
                  name={{
                    ios: "checkmark",
                    android: "check",
                    web: "check",
                  }}
                  tintColor={colors.primary}
                  size={iconSizes.md}
                />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </BottomSheet>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    header: {
      borderBottomWidth: 1,
      borderBottomColor: colors.primary,
    },
    title: {
      fontSize: fontSizes.heading,
      fontFamily: fontsInstrument.bold,
      color: colors.text,
    },
    // Lets the options scroll when the sheet reaches its max height, keeping
    // the header in view.
    scroll: {
      flexShrink: 1,
    },
    option: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      minHeight: controlHeights.lg,
    },
    optionPressed: {
      opacity: 0.6,
    },
    label: {
      flex: 1,
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    labelSelected: {
      color: colors.primary,
    },
  }),
);
