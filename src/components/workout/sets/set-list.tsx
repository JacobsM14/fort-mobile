import { Fragment } from "react";
import { Alert, StyleSheet } from "react-native";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";

import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { RestChoice } from "@/components/workout/sets/rest-choice";
import { RestDivider } from "@/components/workout/sets/rest-divider";
import { SetHeader, SetRow } from "@/components/workout/sets/set-row";

import { useTranslation } from "@/i18n";

import {
  addSet,
  chooseRest,
  completeSet,
  deleteSet,
  endRest,
  updateSetValues,
} from "@/features/workouts/queries";
import {
  isSetDone,
  isSetUnlocked,
  needsRestChoice,
} from "@/features/workouts/sets";

import type {
  SetValues,
  WorkoutExercise,
  WorkoutSet,
} from "@/features/workouts/queries";
import type { RepsTrackingType } from "@/features/workouts/sets";

import { spacing } from "@/constants/theme";

type SetListProps = {
  exercise: WorkoutExercise;
  trackingType: RepsTrackingType;
  // What was done the last time, matched to the sets here by number.
  previousSets: readonly SetValues[];
  // The screen asks for confirmation; its dialog has to cover the whole
  // screen, not just this list.
  onDeleteSet: (setId: string, number: number) => void;
  // "edit" corrects a finished workout: rests are shown as saved but no
  // longer chosen or timed.
  mode?: "live" | "edit";
};

export function SetList({
  exercise,
  trackingType,
  previousSets,
  onDeleteSet,
  mode = "live",
}: SetListProps) {
  const { t } = useTranslation();
  const showPrevious = previousSets.length > 0;

  function run(action: () => void) {
    try {
      action();
    } catch {
      Alert.alert(t.workout.saveError);
    }
  }

  // Only a done set asks first; one not done yet holds nothing to lose.
  function removeSet(set: WorkoutSet, number: number) {
    if (isSetDone(set)) {
      onDeleteSet(set.id, number);
    } else {
      run(() => deleteSet(set.id));
    }
  }

  // A rest skipped ("straight on") leaves the rows together.
  function renderRest(set: WorkoutSet) {
    if (mode === "live" && set.restStartedAt !== null && set.restS === null) {
      return (
        <RestDivider
          startedAt={set.restStartedAt}
          onStop={() => run(() => endRest(set.id))}
        />
      );
    }
    if (set.restS !== null && set.restS > 0) {
      return <RestDivider seconds={set.restS} />;
    }
    return null;
  }

  return (
    <Animated.View style={styles.list} layout={LinearTransition}>
      {exercise.sets.length > 0 && (
        <SetHeader trackingType={trackingType} showPrevious={showPrevious} />
      )}
      {exercise.sets.map((set, index) => {
        const rest = renderRest(set);
        return (
          <Fragment key={set.id}>
            <Animated.View entering={FadeIn} layout={LinearTransition}>
              <SetRow
                number={index + 1}
                set={set}
                trackingType={trackingType}
                previous={previousSets.at(index)}
                showPrevious={showPrevious}
                locked={!isSetUnlocked(exercise.sets, index)}
                onSave={(values) => run(() => updateSetValues(set.id, values))}
                onComplete={(values) => run(() => completeSet(set.id, values))}
                onDelete={() => removeSet(set, index + 1)}
              />
            </Animated.View>
            {rest !== null && (
              <Animated.View entering={FadeIn} layout={LinearTransition}>
                {rest}
              </Animated.View>
            )}
            {mode === "live" && needsRestChoice(exercise.sets, index) && (
              <Animated.View entering={FadeIn} layout={LinearTransition}>
                <RestChoice
                  onTimed={() => run(() => chooseRest(set.id, "timed"))}
                  onNone={() => run(() => chooseRest(set.id, "none"))}
                />
              </Animated.View>
            )}
          </Fragment>
        );
      })}
      <Animated.View layout={LinearTransition}>
        <DashedButton
          tone="muted"
          icon={{ ios: "plus", android: "add", web: "add" }}
          label={t.workout.addSet}
          onPress={() => run(() => addSet(exercise.id))}
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.sm,
  },
});
