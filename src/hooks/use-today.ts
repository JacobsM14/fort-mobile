import { useEffect, useState } from "react";
import { AppState } from "react-native";

import { msUntilNextDay, startOfDay } from "@/utils/date";

// Midnight of today. A date read while rendering would stay on yesterday with
// the app left open overnight, so this moves on at midnight, and again when
// the app comes back to the foreground: timers don't run in the background.
export function useToday(): Date {
  const [today, setToday] = useState(() => startOfDay(new Date()));

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;

    function refresh() {
      const now = new Date();
      const day = startOfDay(now);
      setToday((current) =>
        current.getTime() === day.getTime() ? current : day,
      );
      clearTimeout(timer);
      timer = setTimeout(refresh, msUntilNextDay(now));
    }

    refresh();
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        refresh();
      }
    });
    return () => {
      clearTimeout(timer);
      subscription.remove();
    };
  }, []);

  return today;
}
