import { SymbolView } from "expo-symbols";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { makeStyles, useTheme } from "@/hooks/use-theme";

import { fontsInstrument, fontSizes, iconSizes } from "@/constants/theme";

type NavCardProps = {
  title: string;
  detail: string;
  onPress: () => void;
};

export function NavCard({ title, detail, onPress }: NavCardProps) {
  const { colors, globalStyles } = useTheme();
  const styles = useStyles();
  const handlePress = useFocusedPress(onPress);

  return (
    <Pressable
      style={({ pressed }) => [
        globalStyles.card,
        pressed && globalStyles.cardPressed,
      ]}
      onPress={handlePress}
      accessibilityRole="button"
    >
      {({ pressed }) => (
        <>
          <View style={styles.text}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
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
            size={iconSizes.sm}
          />
        </>
      )}
    </Pressable>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    text: {
      flex: 1,
    },
    title: {
      fontSize: fontSizes.body,
      fontFamily: fontsInstrument.semiBold,
      color: colors.text,
    },
    detail: {
      fontSize: fontSizes.detail,
      fontFamily: fontsInstrument.medium,
      color: colors.disabled,
    },
  }),
);
