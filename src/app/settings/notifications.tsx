import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { NotificationFields } from "@/components/settings/notification-fields";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { spacing } from "@/constants/theme";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.notifications}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <NotificationFields />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
