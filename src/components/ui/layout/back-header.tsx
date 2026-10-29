import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { iconSizes, spacing } from "@/constants/theme";
import { useFocusedPress } from "@/hooks/use-focused-press";
import { useTheme } from "@/hooks/use-theme";

type BackHeaderProps = {
  backLabel: string;
  // One string per line, for titles split like "Nueva / Rutina".
  title: string | readonly string[];
  // Shown on the right of the title, e.g. an IconButton.
  action?: ReactNode;
};

// The way back. Apart from the title so a long screen can pin it above the
// scroll and let the title scroll away, which BackHeader doesn't.
export function BackBreadcrumb({ label }: { label: string }) {
  const { colors, globalStyles } = useTheme();
  const goBack = useFocusedPress(() => router.back());

  return (
    <Pressable
      style={globalStyles.breadCrumbPress}
      onPress={goBack}
      hitSlop={spacing.sm}
      accessibilityRole="button"
    >
      <SymbolView
        name={{
          ios: "chevron.left",
          android: "chevron_left",
          web: "chevron_left",
        }}
        tintColor={colors.primary}
        size={iconSizes.lg}
      />
      <Text style={globalStyles.breadCrumbText}>{label}</Text>
    </Pressable>
  );
}

export function HeaderTitle({
  title,
  action,
}: Pick<BackHeaderProps, "title" | "action">) {
  const { globalStyles } = useTheme();
  const lines = typeof title === "string" ? [title] : title;

  return (
    <View style={globalStyles.dualheader}>
      <View style={styles.title}>
        {lines.map((line) => (
          <Text key={line} style={globalStyles.title}>
            {line}
          </Text>
        ))}
      </View>
      {action}
    </View>
  );
}

export function BackHeader({ backLabel, title, action }: BackHeaderProps) {
  return (
    <View>
      <BackBreadcrumb label={backLabel} />
      <HeaderTitle title={title} action={action} />
    </View>
  );
}

const styles = StyleSheet.create({
  // Long titles wrap instead of pushing the action off screen.
  title: {
    flexShrink: 1,
  },
});
