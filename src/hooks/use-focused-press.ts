import { useNavigation } from "expo-router";

// A quick double tap fires a button twice before the navigation it starts has
// finished animating: a push opens the screen twice, and a save or a back runs
// again. The navigation state changes as soon as the first press navigates, so
// presses are ignored once their screen is no longer the focused one.
export function useFocusedPress(onPress?: () => void): () => void {
  const navigation = useNavigation();

  return () => {
    if (onPress !== undefined && navigation.isFocused()) {
      onPress();
    }
  };
}
