import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

import { backupFileName } from "./backup";
import { readBackup } from "./queries";

export async function writeBackupFile(): Promise<File> {
  const file = new File(Paths.cache, backupFileName(new Date()));
  await file.write(JSON.stringify(readBackup()));
  return file;
}

// The file stays in the cache instead of being deleted once shared: the
// receiving app may read it after the share sheet has resolved. The next
// export overwrites it, and the system clears the cache on its own.
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
