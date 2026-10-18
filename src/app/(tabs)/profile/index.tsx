import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { iconSizes, spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.profile}</Text>
        <Pressable
          onPress={() => router.push("/settings")}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.settings.title}
        >
          <SymbolView
            name={{
              ios: "gearshape",
              android: "settings",
              web: "settings",
            }}
            tintColor={colors.text}
            size={iconSizes.xl}
          />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
