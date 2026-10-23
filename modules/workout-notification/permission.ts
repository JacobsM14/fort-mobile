import { PermissionsAndroid, Platform } from "react-native";

// Android 13 added the permission; before it, notifications are allowed
// unless turned off in the system settings, which the native side checks.
const NOTIFICATION_PERMISSION_API = 33;

let pending: Promise<boolean> | null = null;

async function requestPermission(): Promise<boolean> {
  const permission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
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

// Resolves to whether notifications are allowed. Calls made while the dialog
// is open share it, so it is never shown twice at once.
export function ensureNotificationPermission(): Promise<boolean> {
  if (
    Platform.OS !== "android" ||
    Number(Platform.Version) < NOTIFICATION_PERMISSION_API
  ) {
    return Promise.resolve(true);
  }
  pending ??= requestPermission().finally(() => {
    pending = null;
  });
  return pending;
}
