import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DataActionCard } from "@/components/settings/data-action-card";
import {
  BackBreadcrumb,
  HeaderTitle,
} from "@/components/ui/layout/back-header";
import { CornerFrame } from "@/components/ui/layout/corner-frame";
import { ConfirmDialog } from "@/components/ui/overlays/confirm-dialog";

import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useBackup } from "@/features/data/use-backup";

import { spacing } from "@/constants/theme";

export default function DataScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const styles = useStyles();
  const backup = useBackup();
  const texts = t.settings.data;

  const importMessage =
    backup.imported === null
      ? undefined
      : [
          texts.import.done(backup.imported),
          backup.imported.skippedExercises > 0
            ? texts.import.skipped(backup.imported.skippedExercises)
            : null,
        ]
          .filter((part) => part !== null)
          .join(" ");

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <BackBreadcrumb label={t.settings.title} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <HeaderTitle title={t.settings.sections.data} />

        <CornerFrame style={styles.frame}>
          <DataActionCard
            icon={{
              ios: "square.and.arrow.up",
              android: "upload",
              web: "upload",
            }}
            title={texts.export.title}
            description={texts.export.description}
            buttonLabel={texts.export.button}
            onPress={backup.exportData}
            disabled={backup.working}
            error={backup.exportFailed ? texts.export.error : undefined}
          />
          <View style={styles.divider} />
          <DataActionCard
            icon={{
              ios: "square.and.arrow.down",
              android: "download",
              web: "download",
            }}
            title={texts.import.title}
            description={texts.import.description}
            buttonLabel={texts.import.button}
            onPress={backup.chooseFile}
            disabled={backup.working}
            message={importMessage}
            error={
              backup.importFailure === null
                ? undefined
                : texts.import.errors[backup.importFailure]
            }
          />
        </CornerFrame>
      </ScrollView>
      {backup.pendingSummary !== null && (
        <ConfirmDialog
          visible
          title={texts.import.confirmTitle}
          message={texts.import.confirmMessage(backup.pendingSummary)}
          confirmLabel={texts.import.confirm}
          cancelLabel={texts.import.cancel}
          onConfirm={backup.confirmImport}
          onCancel={backup.cancelImport}
        />
      )}
    </SafeAreaView>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    content: {
      paddingBottom: spacing.lg,
    },
    // The margin keeps the floating corners inside the ScrollView, which
    // clips anything drawn outside its bounds.
    frame: {
      gap: spacing.lg,
      margin: spacing.sm,
      padding: spacing.md,
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
  }),
);
