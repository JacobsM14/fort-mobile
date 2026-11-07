import type { Translations } from "@/i18n/es";

import { formatDuration } from "@/utils/duration";

// What a set asks before it changes, the same in the workout and in the
// history editor: deleting a set already done, and dropping the time its
// stopwatch has run. Each screen shows the dialog and runs the change.
export type SetConfirmation =
  | { kind: "deleteSet"; setId: string; number: number }
  | { kind: "resetTimer"; setId: string; seconds: number };

export function setConfirmationTexts(action: SetConfirmation, t: Translations) {
  switch (action.kind) {
    case "deleteSet":
      return {
        title: t.workout.deleteSetTitle(action.number),
        message: t.workout.deleteSetMessage,
        confirmLabel: t.workout.deleteSetConfirm,
      };
    case "resetTimer":
      return {
        title: t.workout.resetTitle,
        message: t.workout.resetMessage(formatDuration(action.seconds)),
        confirmLabel: t.workout.resetConfirm,
      };
  }
}
