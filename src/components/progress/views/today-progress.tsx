import { type ReactNode } from "react";
import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { spacing } from "@/constants/theme";

type TodayProgressProps = {
  filter: ReactNode;
};

// The day's summary. Its boxes are still to come.
export function TodayProgress({ filter }: TodayProgressProps) {
  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {filter}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
