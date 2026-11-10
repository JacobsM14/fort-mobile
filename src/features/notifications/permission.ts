import Storage from "expo-sqlite/kv-store";
import { PermissionsAndroid, Platform } from "react-native";

const KEY = "notification_permission_asked";

export function hasAskedNotificationPermission(): boolean {
  return Storage.getItemSync(KEY) !== null;
}

function markNotificationPermissionAsked() {
  Storage.setItemSync(KEY, "1");
}

// Android 13 added the permission; before it, notifications are allowed
// unless turned off in the system settings, which the native side checks.
const NOTIFICATION_PERMISSION_API = 33;

const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;

let pending: Promise<boolean> | null = null;

function needsPermission(): boolean {
  return (
    Platform.OS === "android" &&
    Number(Platform.Version) >= NOTIFICATION_PERMISSION_API
  );
}

async function requestPermission(): Promise<boolean> {
  try {
    if (await PermissionsAndroid.check(permission)) {
      return true;
    }
    const result = await PermissionsAndroid.request(permission);
    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

// Whether notifications are allowed, without asking.
export async function hasNotificationPermission(): Promise<boolean> {
  if (!needsPermission()) {
    return true;
  }
  try {
    return await PermissionsAndroid.check(permission);
  } catch {
    return false;
  }
}

// Resolves to whether notifications are allowed. Calls made while the dialog
// is open share it, so it is never shown twice at once.
export function ensureNotificationPermission(): Promise<boolean> {
  if (!needsPermission()) {
    return Promise.resolve(true);
  }
  pending ??= requestPermission().finally(() => {
    markNotificationPermissionAsked();
    pending = null;
  });
  return pending;
}
