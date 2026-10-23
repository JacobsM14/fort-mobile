import Storage from "expo-sqlite/kv-store";

const KEY = "notification_permission_asked";

export function hasAskedNotificationPermission(): boolean {
  return Storage.getItemSync(KEY) !== null;
}

export function markNotificationPermissionAsked() {
  Storage.setItemSync(KEY, "1");
}
