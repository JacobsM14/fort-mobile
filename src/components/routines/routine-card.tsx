import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { fontsInstrument, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";

type RoutineCardProps = {
  name: string;
  detail: string;
  onPress: () => void;
};

export function RoutineCard({ name, detail, onPress }: RoutineCardProps) {
  const { colors } = useTheme();
  const styles = useStyles();

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      onPress={onPress}
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <>
          <View style={styles.text}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <Text style={styles.detail} numberOfLines={1}>
              {detail}
            </Text>
          </View>
          <SymbolView
            name={{
              ios: "chevron.right",
              android: "chevron_right",
              web: "chevron_right",
            }}
            tintColor={pressed ? colors.primary : colors.disabled}
            size={18}
          />
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      minHeight: 56,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      backgroundColor: colors.backgroundSecondary,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 2,
    },
    cardPressed: {
      borderColor: colors.primary,
    },
    text: {
      flex: 1,
    },
    name: {
      fontSize: 16,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: 14,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
