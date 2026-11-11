import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type HostInstance,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ProgressViewFilter } from "@/components/progress/views/progress-view-filter";
import { RangeProgress } from "@/components/progress/views/range-progress";
import { TodayProgress } from "@/components/progress/views/today-progress";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import type { ProgressView } from "@/features/progress/views";

import { iconSizes, spacing } from "@/constants/theme";

export default function ProgressScreen() {
  const { t } = useTranslation();
  const { globalStyles, colors } = useTheme();
  const [view, setView] = useState<ProgressView>("3m");
  const screenRef = useRef<HostInstance>(null);

  const openHistory = useFocusedPress(() => router.push("/history"));

  const filter = <ProgressViewFilter value={view} onChange={setView} />;

  return (
    <SafeAreaView
      ref={screenRef}
      style={[globalStyles.screen, styles.screen]}
      edges={["top"]}
    >
      <View style={globalStyles.dualheader}>
        <Text style={globalStyles.title}>{t.tabs.progress}</Text>
        <Pressable
          onPress={openHistory}
          hitSlop={spacing.sm}
          accessibilityRole="button"
          accessibilityLabel={t.history.title}
        >
          {({ pressed }) => (
            <SymbolView
              name={{
                ios: "calendar",
                android: "calendar_check",
                web: "calendar_check",
              }}
              tintColor={pressed ? colors.primary : colors.disabled}
              size={iconSizes.xl}
            />
          )}
        </Pressable>
      </View>
      {view === "today" ? (
        <TodayProgress filter={filter} />
      ) : (
        <RangeProgress range={view} filter={filter} screenRef={screenRef} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: 0,
  },
});
