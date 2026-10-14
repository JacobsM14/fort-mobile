import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, globalStyles, spacing } from "@/constants/theme";
import { useTranslation } from "@/i18n";

export default function RoutinesScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <View>
        <Text style={globalStyles.title}>{t.routines.title}</Text>
        <Text style={globalStyles.subtitle}>{t.routines.subtitle}</Text>
      </View>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* SI HAY RUTINAS PONERLAS */}
        <Pressable
          style={[styles.addButton]}
          onPress={() => router.push("/routines/new_routine")}
        >
          <SymbolView
            name={{ ios: "plus", android: "add", web: "add" }}
            tintColor={colors.primary}
            size={20}
          />
          <Text style={styles.addButtonText}>{t.routines.add}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.sm,
  },
  addButton: {
    ...globalStyles.submitButtom,
    flexDirection: "row",
    borderColor: colors.primary,
  },
  addButtonText: {
    ...globalStyles.submitButtonText,
    color: colors.primary,
  },
});
