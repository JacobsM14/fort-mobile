import { Directory, File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { BackupError, backupFileName } from "./backup";
import { readBackup } from "./queries";

// A backup of years of workouts is a few megabytes: a file far bigger is not
// one, and reading it into memory would only freeze the app.
const MAX_BACKUP_BYTES = 50 * 1024 * 1024;

// A backup holds all the user's data, profile included, so only the last one
// stays on the device: exports go to a folder of their own, emptied first.
async function writeBackupFile(): Promise<File> {
  const directory = new Directory(Paths.cache, "backup");
  if (directory.exists) {
    directory.delete();
  }
  directory.create();
  const file = new File(directory, backupFileName(new Date()));
  await file.write(JSON.stringify(readBackup()));
  return file;
}

// The file isn't deleted once shared: the receiving app may read it after the
// share sheet has resolved. The next export removes it.
export async function shareBackupFile() {
  if (!(await Sharing.isAvailableAsync())) {
    throw new Error("Sharing is not available on this device");
  }
  const file = await writeBackupFile();
  await Sharing.shareAsync(file.uri, {
    mimeType: "application/json",
    UTI: "public.json",
  });
}

// The text of the file the user picks, or null if they cancel. Every type of
// file can be picked: some providers (Drive, for one) report a .json file as
// plain text or as a generic one, and parseBackupFile is what checks it.
export async function pickBackupText(): Promise<string | null> {
  const picked = await File.pickFileAsync();
  if (picked.canceled) {
    return null;
  }
  if (picked.result.size > MAX_BACKUP_BYTES) {
    throw new BackupError("not_a_backup");
  }
  return picked.result.text();
}
