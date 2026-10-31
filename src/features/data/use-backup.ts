import { useState } from "react";

import { useUserProfile } from "@/hooks/use-user-profile";

import {
  BackupError,
  parseBackupFile,
  summarizeBackup,
  type BackupErrorCode,
  type BackupFile,
} from "./backup";
import { pickBackupText, shareBackupFile } from "./files";
import { profileBlanksFilledFrom } from "./profile";
import { importBackup, type ImportResult } from "./queries";

// Why an import ended without importing: the file is not a good backup, or
// something else went wrong (reading it, writing the database).
export type ImportFailure = BackupErrorCode | "failed";

// The export and import of the data screen: what each one is doing and how it
// ended. An import goes in two steps, so the user sees what a file brings
// before it is merged: chooseFile reads and checks it, confirmImport writes it.
export function useBackup() {
  const { profile, updateProfile } = useUserProfile();
  const [working, setWorking] = useState(false);
  const [exportFailed, setExportFailed] = useState(false);
  const [pending, setPending] = useState<BackupFile | null>(null);
  const [importFailure, setImportFailure] = useState<ImportFailure | null>(
    null,
  );
  const [imported, setImported] = useState<ImportResult | null>(null);

  async function exportData() {
    setWorking(true);
    setExportFailed(false);
    try {
      await shareBackupFile();
    } catch {
      setExportFailed(true);
    } finally {
      setWorking(false);
    }
  }

  async function chooseFile() {
    setWorking(true);
    setImportFailure(null);
    setImported(null);
    try {
      const text = await pickBackupText();
      if (text !== null) {
        setPending(parseBackupFile(text));
      }
    } catch (error) {
      setImportFailure(error instanceof BackupError ? error.code : "failed");
    } finally {
      setWorking(false);
    }
  }

  function confirmImport() {
    if (pending === null) {
      return;
    }
    try {
      const result = importBackup(pending);
      // The profile lives in React state, not only in storage: it goes through
      // the provider so the screens that show it notice.
      const changes = profileBlanksFilledFrom(profile, pending.profile);
      if (Object.keys(changes).length > 0) {
        updateProfile(changes);
      }
      setImported(result);
    } catch {
      setImportFailure("failed");
    }
    setPending(null);
  }

  return {
    working,
    exportData,
    exportFailed,
    chooseFile,
    // What the chosen file brings, while the user decides whether to import it.
    pendingSummary: pending === null ? null : summarizeBackup(pending),
    confirmImport,
    cancelImport: () => setPending(null),
    importFailure,
    imported,
  };
}
