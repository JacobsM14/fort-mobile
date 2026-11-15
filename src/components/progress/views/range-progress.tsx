import { router } from "expo-router";
import { useRef, useState, type ReactNode, type RefObject } from "react";
import { StyleSheet, type HostInstance } from "react-native";
import { ScrollView } from "react-native-gesture-handler";

import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { BmiCard } from "@/components/progress/bmi/bmi-card";
import { BodyWeightCard } from "@/components/progress/body-weight/body-weight-card";
import { WeightEntrySection } from "@/components/progress/body-weight/weight-entry-section";
import { StrengthCard } from "@/components/progress/strength/strength-card";
import { measureMenuAnchor } from "@/components/ui/overlays/measure-anchor";
import { ExerciseSelectMenu } from "@/components/workout/header/exercise-select";

import { useFocusedPress } from "@/hooks/use-focused-press";
import { useUserProfile } from "@/hooks/use-user-profile";
import { useTranslation } from "@/i18n";

import { assessBmi } from "@/features/body/bmi";
import { useBodyWeights } from "@/features/body/queries";
import { getExerciseInfo, getExerciseText } from "@/features/exercises/catalog";
import { useTrainedExercises } from "@/features/progress/queries";

import type { MenuAnchor } from "@/components/workout/header/exercise-select";
import type { ExerciseInfo } from "@/features/exercises/catalog";
import type { ProgressRange } from "@/features/progress/ranges";

import { spacing } from "@/constants/theme";

type RangeProgressProps = {
  range: ProgressRange;
  filter: ReactNode;
  screenRef: RefObject<HostInstance | null>;
};

export function RangeProgress({
  range,
  filter,
  screenRef,
}: RangeProgressProps) {
  const { t } = useTranslation();
  const { profile } = useUserProfile();
  const { entries, loaded: weightsLoaded } = useBodyWeights();
  const { exercises, loaded: exercisesLoaded } = useTrainedExercises();

  const [selectedId, setSelectedId] = useState<string>();
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const [menuAnchor, setMenuAnchor] = useState<MenuAnchor>();
  const headerRef = useRef<HostInstance>(null);

  const openUserProfile = useFocusedPress(() => router.push("/settings/user"));

  const exercise =
    exercises.find((e) => e.id === selectedId) ?? exercises.at(0);

  function showInfo() {
    if (exercise !== undefined) {
      setInfo(getExerciseInfo(exercise, t));
    }
  }

  // As wide as the header, which scrolls with the content.
  function toggleMenu() {
    if (menuAnchor !== undefined) {
      setMenuAnchor(undefined);
      return;
    }
    measureMenuAnchor(
      screenRef.current,
      headerRef.current,
      ({ top, left, width }) => setMenuAnchor({ top, left, width }),
    );
  }

  function selectExercise(id: string) {
    setMenuAnchor(undefined);
    setSelectedId(id);
  }

  return (
    <>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {filter}
        <StrengthCard
          exercise={exercise}
          loaded={exercisesLoaded}
          range={range}
          headerRef={headerRef}
          menuOpen={menuAnchor !== undefined}
          onShowInfo={showInfo}
          onToggleMenu={toggleMenu}
        />
        <BodyWeightCard
          entries={entries}
          range={range}
          loaded={weightsLoaded}
        />
        <WeightEntrySection entries={entries} loaded={weightsLoaded} />
        {weightsLoaded && (
          <BmiCard
            assessment={assessBmi(profile, entries.at(-1))}
            onCompleteProfile={openUserProfile}
          />
        )}
      </ScrollView>
      {menuAnchor !== undefined && (
        <ExerciseSelectMenu
          items={exercises.map((item) => ({
            id: item.id,
            name: getExerciseText(item, t).name,
            trackingType: item.trackingType,
            done: false,
          }))}
          currentId={exercise?.id}
          anchor={menuAnchor}
          onSelect={selectExercise}
          onClose={() => setMenuAnchor(undefined)}
        />
      )}
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: spacing.lg,
    paddingBottom: spacing.lg,
  },
});
