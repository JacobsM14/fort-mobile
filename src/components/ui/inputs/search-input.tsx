import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { makeStyles, useTheme } from "@/hooks/use-theme";

import {
  controlHeights,
  fontsInstrument,
  fontSizes,
  iconSizes,
  radii,
  spacing,
} from "@/constants/theme";

type SearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  clearLabel: string;
};

export function SearchInput({
  value,
  onChangeText,
  placeholder,
  clearLabel,
}: SearchInputProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <View style={styles.box}>
      <SymbolView
        name={{ ios: "magnifyingglass", android: "search", web: "search" }}
        tintColor={colors.disabled}
        size={iconSizes.sm}
      />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.disabled}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        accessibilityRole="search"
      />
      {value !== "" && (
        <Pressable
          onPress={() => onChangeText("")}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={clearLabel}
        >
          <SymbolView
            name={{
              ios: "xmark.circle.fill",
              android: "cancel",
              web: "cancel",
            }}
            tintColor={colors.disabled}
            size={iconSizes.sm}
          />
        </Pressable>
      )}
    </View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    box: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      height: controlHeights.lg,
      paddingHorizontal: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: radii.xs,
    },
    input: {
      flex: 1,
      height: "100%",
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.medium,
      color: colors.text,
    },
  }),
);
