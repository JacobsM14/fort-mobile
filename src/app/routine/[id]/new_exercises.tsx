import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/back-header";
import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { NoContentBox } from "@/components/ui/no-content-box";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SearchInput } from "@/components/ui/search-input";
import { spacing } from "@/constants/theme";
import {
  getExerciseDetail,
  getExerciseInfo,
  getExerciseText,
  MUSCLE_IDS,
  type ExerciseInfo,
  type MuscleId,
} from "@/features/exercises/catalog";
import {
  useExerciseList,
  type ExerciseSummary,
} from "@/features/exercises/queries";
import { useRoutineDraft } from "@/hooks/use-routine-draft";
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { normalizeForSearch } from "@/utils/text";

const PAGE_SIZE = 10;

type ExerciseItem = ExerciseSummary & {
  label: string;
  detail: string;
  searchText: string;
};

export default function NewExercisesScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { exercises, loaded } = useExerciseList();
  const { routineId, exerciseIds, setExerciseIds } = useRoutineDraft();
  const [query, setQuery] = useState("");
  const [muscleFilter, setMuscleFilter] = useState<MuscleId[]>([]);

  const [selectedIds, setSelectedIds] = useState<string[]>(exerciseIds);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  const listRef = useRef<FlatList<ExerciseItem>>(null);

  function resetPaging() {
    setVisibleCount(PAGE_SIZE);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function changeQuery(text: string) {
    setQuery(text);
    resetPaging();
  }

  function toggleMuscle(id: MuscleId) {
    setMuscleFilter((current) =>
      current.includes(id)
        ? current.filter((muscle) => muscle !== id)
        : [...current, id],
    );
    resetPaging();
  }

  function showAllMuscles() {
    setMuscleFilter([]);
    resetPaging();
  }

  function toggleExercise(id: string) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((exerciseId) => exerciseId !== id)
        : [...current, id],
    );
  }

  function confirmSelection() {
    setExerciseIds(selectedIds);
    router.back();
  }

  const collator = new Intl.Collator(language);
  const items = exercises
    .map((exercise): ExerciseItem => {
      const label = getExerciseText(exercise, t).name;
      return {
        ...exercise,
        label,
        detail: getExerciseDetail(exercise, t),
        searchText: normalizeForSearch(label),
      };
    })
    .sort((a, b) => collator.compare(a.label, b.label));

  const filterMuscles = MUSCLE_IDS.filter((id) =>
    exercises.some((exercise) => exercise.primaryMuscles.includes(id)),
  );

  const search = normalizeForSearch(query);
  const visibleItems = items.filter(
    (item) =>
      (muscleFilter.length === 0 ||
        item.primaryMuscles.some((muscle) => muscleFilter.includes(muscle))) &&
      item.searchText.includes(search),
  );
  const pagedItems = visibleItems.slice(0, visibleCount);

  function loadMore() {
    if (visibleCount < visibleItems.length) {
      setVisibleCount((count) => count + PAGE_SIZE);
    }
  }

  return (
    <SafeAreaView
      style={[globalStyles.screen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={
          routineId === null
            ? t.new_exercises.bread_crumb
            : t.new_exercises.bread_crumb_edit
        }
        title={t.new_exercises.title}
      />
      <SearchInput
        value={query}
        onChangeText={changeQuery}
        placeholder={t.new_exercises.searchPlaceholder}
        clearLabel={t.new_exercises.clearSearch}
      />
      <ScrollView
        horizontal
        style={styles.chipScroll}
        contentContainerStyle={styles.chips}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <FilterChip
          label={t.new_exercises.allMuscles}
          selected={muscleFilter.length === 0}
          onPress={showAllMuscles}
        />
        {filterMuscles.map((id) => (
          <FilterChip
            key={id}
            label={t.muscles[id]}
            selected={muscleFilter.includes(id)}
            onPress={() => toggleMuscle(id)}
          />
        ))}
      </ScrollView>
      <FlatList
        ref={listRef}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={pagedItems}
        extraData={selectedIds}
        onEndReached={loadMore}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExerciseRow
            name={item.label}
            detail={item.detail}
            trackingType={item.trackingType}
            selected={selectedIds.includes(item.id)}
            onToggle={() => toggleExercise(item.id)}
            infoLabel={t.exercises.showInfo}
            onInfo={() => setInfo(getExerciseInfo(item, t))}
          />
        )}
        ListEmptyComponent={
          loaded ? <NoContentBox label={t.new_exercises.noResults} /> : null
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <PrimaryButton
        label={t.new_exercises.done(selectedIds.length)}
        onPress={confirmSelection}
      />
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
    </SafeAreaView>
  );
}

type FilterChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

function FilterChip({ label, selected, onPress }: FilterChipProps) {
  const { globalStyles } = useTheme();

  return (
    <Pressable
      style={
        selected ? globalStyles.pressedButton : globalStyles.notPressedButton
      }
      onPress={onPress}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Text
        style={
          selected
            ? globalStyles.pressedButtonText
            : globalStyles.notPressedButtonText
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: spacing.md,
  },
  chipScroll: {
    flexGrow: 0,
  },
  chips: {
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
  },
});
