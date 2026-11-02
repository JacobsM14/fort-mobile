import * as Linking from "expo-linking";
import { useEffect } from "react";

import { useTranslation } from "@/i18n";

import { bodyWeightOnDay, useBodyWeights } from "@/features/body/queries";

import { cancel, schedule } from "@/modules/weight-reminder";

import type { Translations } from "@/i18n/es";

import { toDateKey } from "@/utils/date";

import { nextWeightReminder } from "./next-weight-reminder";
import { loadNotificationPreferences } from "./preferences";
import { loadWeightReminder, type WeightReminder } from "./weight-reminder";

type WeightReminderTexts = Translations["notifications"]["weightReminder"];

// Null when the reminder, or every notification, is turned off.
function activeWeightReminder(): WeightReminder | null {
  const { enabled, weightReminder } = loadNotificationPreferences();
  return enabled && weightReminder ? loadWeightReminder() : null;
}

// Sets the alarm for the next reminder, replacing the one before, or removes
// it when the reminder is off. It reads the settings as they are saved now.
function scheduleWeightReminder(
  weighedToday: boolean,
  texts: WeightReminderTexts,
) {
  const next = nextWeightReminder(
    activeWeightReminder(),
    new Date(),
    weighedToday,
  );
  if (next === null) {
    cancel();
    return;
  }
  schedule({
    atMs: next.getTime(),
    title: texts.title,
    text: texts.text,
    url: Linking.createURL("progress"),
    channelName: texts.channel,
  });
}

type TodayWeighIn = {
  todayKey: string;
  // Undefined until the weigh-ins have loaded, so nothing is scheduled from an
  // empty list.
  weighedToday: boolean | undefined;
};

function useWeighedInToday(): TodayWeighIn {
  const { entries, loaded } = useBodyWeights();
  const todayKey = toDateKey(new Date());
  return {
    todayKey,
    weighedToday: loaded
      ? bodyWeightOnDay(entries, todayKey) !== undefined
      : undefined,
  };
}

// Schedules again when the app opens, so the alarm carries the current
// language, and when the user weighs in: a weigh-in on the chosen day, before
// its time, moves the reminder to the next week.
export function useWeightReminderSchedule() {
  const { t } = useTranslation();
  const texts = t.notifications.weightReminder;
  const { todayKey, weighedToday } = useWeighedInToday();

  // The day is a dependency too: with the app kept open from one day to the
  // next, a weigh-in each day leaves weighedToday true, yet today's reminder
  // still has to move.
  useEffect(() => {
    if (weighedToday === undefined) {
      return;
    }
    scheduleWeightReminder(weighedToday, texts);
  }, [todayKey, weighedToday, texts]);
}

// For the settings screen, to apply a change as soon as it is saved. Should
// the weigh-ins not have loaded yet, today counts as not weighed in: at worst
// the reminder still comes today, and the next app open puts it right.
export function useRescheduleWeightReminder(): () => void {
  const { t } = useTranslation();
  const texts = t.notifications.weightReminder;
  const { weighedToday } = useWeighedInToday();

  return () => scheduleWeightReminder(weighedToday ?? false, texts);
}
