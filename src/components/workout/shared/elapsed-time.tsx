import { Text, type TextProps } from "react-native";

import { elapsedSeconds } from "@/features/workouts/sets";
import { useNow } from "@/hooks/use-now";
import { formatDuration } from "@/utils/duration";

type ElapsedTimeProps = Omit<TextProps, "children"> & {
  since: Date;
  // Time already run before since, e.g. before a pause.
  offsetSeconds?: number;
};

// A running stopwatch. It ticks on its own, so only this text re-renders
// every second, not the screen around it.
export function ElapsedTime({
  since,
  offsetSeconds = 0,
  ...textProps
}: ElapsedTimeProps) {
  const now = useNow();

  return (
    <Text {...textProps}>
      {formatDuration(offsetSeconds + elapsedSeconds(since, now))}
    </Text>
  );
}
