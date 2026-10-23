import * as Haptics from "expo-haptics";
import {
  BottomTabBar,
  Tabs,
  type BottomTabBarProps,
} from "expo-router/js-tabs";
import { SymbolView, type SymbolViewProps } from "expo-symbols";
import { useEffect } from "react";
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type ColorValue,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { fontsInstrument, spacing } from "@/constants/theme";
import { makeStyles, useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import { useDismissEndedWorkoutNotification } from "@/features/workouts/notification";

const TAB_BAR_HEIGHT = 70;
const INDICATOR_WIDTH = 24;
const INDICATOR_SPRING = { damping: 18, stiffness: 200, mass: 1 };

function TabBar(props: BottomTabBarProps) {
  const styles = useStyles();
  const { width } = useWindowDimensions();
  const tabWidth = width / props.state.routes.length;
  const x = props.state.index * tabWidth + (tabWidth - INDICATOR_WIDTH) / 2;
  const translateX = useSharedValue(x);

  useEffect(() => {
    translateX.set(withSpring(x, INDICATOR_SPRING));
  }, [x, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.get() }],
  }));

  return (
    <View>
      <BottomTabBar {...props} />
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </View>
  );
}

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
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  // Here because the tabs stay mounted under every modal, and only once the
  // database is ready.
  useDismissEndedWorkoutNotification();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenListeners={{
        tabPress: () => {
          Haptics.selectionAsync();
        },
      }}
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.backgroundSecondary,
          borderTopWidth: 0,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingTop: spacing.sm,
        },
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

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    indicator: {
      position: "absolute",
      top: 0,
      left: 0,
      width: INDICATOR_WIDTH,
      height: 2,
      backgroundColor: colors.primary,
    },
  }),
);
