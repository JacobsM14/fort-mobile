import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DataActionCard } from "@/components/settings/data-action-card";
import { BackHeader } from "@/components/ui/layout/back-header";
import { shareBackupFile } from "@/features/data/files";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { spacing } from "@/constants/theme";

export default function DataScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const [exporting, setExporting] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);

  async function exportData() {
    setExporting(true);
    setExportFailed(false);
    try {
      await shareBackupFile();
    } catch {
      setExportFailed(true);
    } finally {
      setExporting(false);
    }
  }

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackHeader
        backLabel={t.settings.title}
        title={t.settings.sections.data}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <DataActionCard
          icon={{
            ios: "square.and.arrow.up",
            android: "upload",
            web: "upload",
          }}
          title={t.settings.data.export.title}
          description={t.settings.data.export.description}
          buttonLabel={t.settings.data.export.button}
          onPress={exportData}
          disabled={exporting}
          error={exportFailed ? t.settings.data.export.error : undefined}
        />
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
