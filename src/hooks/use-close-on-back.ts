import { useEffect } from "react";
import { BackHandler, Keyboard } from "react-native";

// For overlays drawn inside a screen: while one is open, Android's back button
// closes it instead of leaving the screen, and the keyboard gets out of the way.
export function useCloseOnBack(active: boolean, onBack: () => void) {
  useEffect(() => {
    if (!active) {
      return;
    }
    Keyboard.dismiss();
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        onBack();
        return true;
      },
    );
    return () => subscription.remove();
  }, [active, onBack]);
}
