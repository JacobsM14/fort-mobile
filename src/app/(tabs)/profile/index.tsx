import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { iconSizes, spacing } from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const openSettings = useFocusedPress(() => router.push("/settings"));

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.profile}</Text>
        <Pressable
          onPress={openSettings}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.settings.title}
        >
          {({ pressed }) => (
            <SymbolView
              name={{
                ios: "gearshape",
                android: "settings",
                web: "settings",
              }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.xl}
            />
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
