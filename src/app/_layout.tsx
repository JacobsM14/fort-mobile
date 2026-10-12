import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useDatabase } from "@/db/use-database";

export default function RootLayout() {
  const { ready, error } = useDatabase();

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error al preparar la base de datos: {error.message}</Text>
      </View>
    );
  }

  if (!ready) {
    return null;
  }

  return <Stack />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
