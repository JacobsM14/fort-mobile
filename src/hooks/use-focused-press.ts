import { useNavigation } from "expo-router";

// Prevents double taps from firing before navigation finishes.
export function useFocusedPress<Args extends unknown[]>(
  onPress?: (...args: Args) => void,
): (...args: Args) => void {
  const navigation = useNavigation();

  // If navigation is not focused, ignore the press.
  return (...args) => {
    if (onPress !== undefined && navigation.isFocused()) {
      onPress(...args);
    }
  };
}
