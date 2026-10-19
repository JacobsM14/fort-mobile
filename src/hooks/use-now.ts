import { useEffect, useState } from "react";

// The current time, refreshed every second while the component is mounted.
// Used by running stopwatches, which show now minus a start time saved in the
// database, so they stay right after the app has been in the background.
export function useNow() {
  const [now, setNow] = useState(Date.now);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  return now;
}
