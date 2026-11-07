import { useEffect, useEffectEvent } from "react";

// A field saves when it is left, but one that goes away while it still has
// the keyboard is never left: switching exercise from the workout's footer,
// or closing the screen, unmounts it first, and the blur that follows finds
// no component to tell. This saves it on the way out instead. The save has
// to be safe to run again: it compares with what is stored first.
export function useSaveOnUnmount(save: () => void) {
  const saveNow = useEffectEvent(save);

  useEffect(() => () => saveNow(), []);
}
