import { Tabs } from "expo-router/js-tabs";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import type { ColorValue } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { colors, fontsInstrument } from "@/constants/theme";
import { useTranslation } from "@/i18n";

const TAB_BAR_HEIGHT = 70;

function tabIcon(name: SymbolViewProps["name"]) {
  return function TabIcon({
    color,
    size,
  }: {
    color: ColorValue;
    size: number;
  }) {
    return <SymbolView name={name} tintColor={color} size={size} />;
  };
}

export default function TabsLayout() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopWidth: 0,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: 10,
        },
        // tabBarItemStyle: {
        //   flexDirection: "row",
        //   alignItems: "center",
        // },
        tabBarLabelStyle: {
          fontFamily: fontsInstrument.medium,
        },
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.disabled,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t.tabs.today,
          tabBarIcon: tabIcon({
            ios: "calendar",
            android: "today",
            web: "today",
          }),
        }}
      />
      <Tabs.Screen
        name="routines"
        options={{
          title: t.tabs.routines,
          tabBarIcon: tabIcon({
            ios: "dumbbell.fill",
            android: "fitness_center",
            web: "fitness_center",
          }),
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t.tabs.progress,
          tabBarIcon: tabIcon({
            ios: "chart.line.uptrend.xyaxis",
            android: "trending_up",
            web: "trending_up",
          }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.tabs.profile,
          tabBarIcon: tabIcon({
            ios: "person.fill",
            android: "person",
            web: "person",
          }),
        }}
      />
    </Tabs>
  );
}
