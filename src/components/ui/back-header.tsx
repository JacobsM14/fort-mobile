import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";

import { spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type BackHeaderProps = {
  backLabel: string;
  title: string;
};

export function BackHeader({ backLabel, title }: BackHeaderProps) {
  const { colors, globalStyles } = useTheme();

  return (
    <View>
      <Pressable
        style={globalStyles.breadCrumbPress}
        onPress={() => router.back()}
        hitSlop={spacing.sm}
        accessibilityRole="link"
      >
        <SymbolView
          name={{
            ios: "chevron.left",
            android: "chevron_left",
            web: "chevron_left",
          }}
          tintColor={colors.primary}
          size={22}
        />
        <Text style={globalStyles.breadCrumbText}>{backLabel}</Text>
      </Pressable>
      <Text style={globalStyles.title}>{title}</Text>
    </View>
  );
}
