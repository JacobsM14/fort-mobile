import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { NavCard } from "@/components/ui/content/nav-card";
import { NoContentBox } from "@/components/ui/content/no-content-box";

import { NEW_ROUTINE_ID } from "@/hooks/use-routine-draft";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { getRoutineDetail } from "@/features/routines/detail";
import { useRoutineList } from "@/features/routines/queries";

import { spacing } from "@/constants/theme";

export default function RoutinesScreen() {
  const { t } = useTranslation();
  const { globalStyles } = useTheme();
  const { routines, loaded } = useRoutineList();

  return (
    <SafeAreaView style={[globalStyles.screen, styles.screen]} edges={["top"]}>
      <View>
        <Text style={globalStyles.title}>{t.routines.title}</Text>
        <Text style={globalStyles.subtitle}>{t.routines.subtitle}</Text>
      </View>
      <ScrollView
        style={styles.list}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {loaded && routines.length === 0 ? (
          <NoContentBox label={t.routines.noContent} />
        ) : (
          routines.map((routine) => (
            <NavCard
              key={routine.id}
              title={routine.name}
              detail={getRoutineDetail(routine, t)}
              onPress={() =>
                router.push({
                  pathname: "/routine/[id]",
                  params: { id: routine.id },
                })
              }
            />
          ))
        )}
      </ScrollView>
      <DashedButton
        icon={{ ios: "plus", android: "add", web: "add" }}
        label={t.routines.add}
        onPress={() =>
          router.push({
            pathname: "/routine/[id]",
            params: { id: NEW_ROUTINE_ID },
          })
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: spacing.md,
  },
  list: {
    flex: 1,
  },
  content: {
    gap: spacing.sm,
  },
});
