import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AthleteTypeCard } from "@/components/profile/athlete-type-card";
import { EmptyStateCard } from "@/components/ui/content/empty-state-card";

import { useFirstWeekday } from "@/hooks/use-first-weekday";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useAthleteType } from "@/features/profile/queries";

import { iconSizes, spacing } from "@/constants/theme";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { colors, globalStyles } = useTheme();
  const openSettings = useFocusedPress(() => router.push("/settings"));
  const { athleteType, loaded } = useAthleteType(useFirstWeekday());

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
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
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loaded &&
          (athleteType === null ? (
            <EmptyStateCard
              title={t.profile.athleteType.title}
              message={t.profile.athleteType.empty}
            />
          ) : (
            <AthleteTypeCard athleteType={athleteType} />
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
