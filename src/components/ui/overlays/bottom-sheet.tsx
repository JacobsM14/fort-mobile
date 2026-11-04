import {
  PanResponder,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  SlideInDown,
  SlideOutDown,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

import { Backdrop } from "@/components/ui/overlays/backdrop";

import { useCloseOnBack } from "@/hooks/use-close-on-back";
import { makeStyles } from "@/hooks/use-theme";

import type { ReactNode } from "react";

import { radii, spacing } from "@/constants/theme";

const CLOSE_DISTANCE = 100;
const CLOSE_VELOCITY = 1;
const CLOSE_DURATION_MS = 200;
const SETTLE_SPRING = { damping: 20, stiffness: 300 };

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  closeLabel: string;
  // Shown under the grabber; the sheet can be dragged down from both.
  header?: ReactNode;
  children: ReactNode;
};

export function BottomSheet({
  visible,
  onClose,
  closeLabel,
  header,
  children,
}: BottomSheetProps) {
  const styles = useStyles();

  useCloseOnBack(visible, onClose);

  if (!visible) {
    return null;
  }

  return (
    <>
      <Backdrop onPress={onClose} label={closeLabel} />
      <Animated.View
        entering={SlideInDown}
        exiting={SlideOutDown}
        style={styles.container}
        accessibilityViewIsModal
      >
        <DraggablePanel onClose={onClose} header={header}>
          {children}
        </DraggablePanel>
      </Animated.View>
    </>
  );
}

type DraggablePanelProps = {
  onClose: () => void;
  header?: ReactNode;
  children: ReactNode;
};

// The drag moves this inner panel, not the container that runs the slide
// in/out animations: a sheet dragged away is already off screen when it
// unmounts, so the exit animation can't bring it back into view. It also
// mounts on every open, so the drag offset always starts at 0.
function DraggablePanel({ onClose, header, children }: DraggablePanelProps) {
  const styles = useStyles();
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);

  const panResponder = PanResponder.create({
    // Only claims clear downward drags, so taps on buttons in the header
    // still work.
    onMoveShouldSetPanResponder: (_event, gesture) =>
      gesture.dy > 4 && Math.abs(gesture.dy) > Math.abs(gesture.dx),
    onPanResponderMove: (_event, gesture) => {
      translateY.set(Math.max(0, gesture.dy));
    },
    onPanResponderRelease: (_event, gesture) => {
      if (gesture.dy > CLOSE_DISTANCE || gesture.vy > CLOSE_VELOCITY) {
        translateY.set(
          withTiming(height, { duration: CLOSE_DURATION_MS }, (finished) => {
            "worklet";
            if (finished) {
              scheduleOnRN(onClose);
            }
          }),
        );
      } else {
        translateY.set(withSpring(0, SETTLE_SPRING));
      }
    },
    onPanResponderTerminate: () => {
      translateY.set(withSpring(0, SETTLE_SPRING));
    },
  });

  const dragStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.get() }],
  }));

  return (
    <Animated.View
      style={[
        styles.panel,
        { paddingBottom: insets.bottom + spacing.lg },
        dragStyle,
      ]}
      onAccessibilityEscape={onClose}
    >
      <View style={styles.dragZone} {...panResponder.panHandlers}>
        <View style={styles.grabberArea}>
          <View style={styles.grabber} />
        </View>
        {header}
      </View>
      {children}
    </Animated.View>
  );
}

const useStyles = makeStyles(({ colors }) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      maxHeight: "85%",
    },
    panel: {
      flexShrink: 1,
      gap: spacing.md,
      paddingTop: spacing.md,
      paddingHorizontal: spacing.lg,
      backgroundColor: colors.backgroundSecondary,
      borderTopRightRadius: radii.lg,
      borderTopLeftRadius: radii.lg,
    },
    dragZone: {
      gap: spacing.sm,
    },
    grabberArea: {
      alignItems: "center",
      paddingVertical: spacing.xs,
    },
    grabber: {
      width: 36,
      height: 4,
      borderRadius: radii.xs,
      backgroundColor: colors.border,
    },
  }),
);
