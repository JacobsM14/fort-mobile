import { colors, globalStyles, spacing } from "@/constants/theme";
import { useTranslation } from "@/i18n";
import { router } from "expo-router";
import { SymbolView } from "expo-symbols";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewExercisesScreen() {
  const { t } = useTranslation();

  return (
    <SafeAreaView style={globalStyles.screen} edges={["top"]}>
      <View style={styles.header}>
        <Pressable
          style={globalStyles.breadCrumbPress}
          onPress={() => router.back()}
          hitSlop={spacing.sm}
          accessibilityRole="link"
        >
          <SymbolView
            name={{
              ios: "chevron.left",
              android: "chevron_left",
              web: "chevron_left",
            }}
            tintColor={colors.primary}
            size={22}
          />
          <Text style={globalStyles.breadCrumbText}>
            {t.new_exercises.bread_crumb}
          </Text>
        </Pressable>
        <Text style={globalStyles.title}>{t.new_exercises.title}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = {
  header: {
    padding: 16,
  },
};
