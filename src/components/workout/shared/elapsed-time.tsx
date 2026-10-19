import { Text, type StyleProp, type TextStyle } from "react-native";

import { elapsedSeconds } from "@/features/workouts/sets";
import { useNow } from "@/hooks/use-now";
import { formatDuration } from "@/utils/duration";

type ElapsedTimeProps = {
  since: Date;
  style?: StyleProp<TextStyle>;
};

// A running stopwatch. It ticks on its own, so only this text re-renders
// every second, not the screen around it.
export function ElapsedTime({ since, style }: ElapsedTimeProps) {
  const now = useNow();

  return (
    <Text style={style}>{formatDuration(elapsedSeconds(since, now))}</Text>
  );
}
