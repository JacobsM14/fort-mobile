import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseFiltersSheet } from "@/components/exercises/exercise-filters-sheet";
import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { FilterButton } from "@/components/ui/buttons/filter-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { SearchInput } from "@/components/ui/inputs/search-input";
import { BackHeader } from "@/components/ui/layout/back-header";
import type { TrackingType } from "@/constants/enums";
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
import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";
import { toggleItem } from "@/utils/array";
import { normalizeForSearch } from "@/utils/text";

const PAGE_SIZE = 10;

type ExerciseItem = ExerciseSummary & {
  label: string;
  detail: string;
  searchText: string;
};

type ExercisePickerScreenProps = {
  backLabel: string;
  initialSelectedIds?: readonly string[];
  // Left out of the list, e.g. the exercises already in a workout.
  excludeIds?: readonly string[];
  doneLabel: (count: number) => string;
  onDone: (selectedIds: string[]) => void;
  // A routine can be left with no exercises picked; adding to a workout
  // needs at least one.
  allowEmpty?: boolean;
  // Creating a custom exercise from the picker (only routines for now). The
  // new exercise comes back through subscribeExerciseCreated.
  onCreateCustom?: () => void;
  subscribeExerciseCreated?: (
    listener: (exerciseId: string) => void,
  ) => () => void;
};

export function ExercisePickerScreen({
  backLabel,
  initialSelectedIds = [],
  excludeIds = [],
  doneLabel,
  onDone,
  allowEmpty = true,
  onCreateCustom,
  subscribeExerciseCreated,
}: ExercisePickerScreenProps) {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { exercises, loaded } = useExerciseList();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TrackingType[]>([]);
  const [muscleFilter, setMuscleFilter] = useState<MuscleId[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>(() => [
    ...initialSelectedIds,
  ]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  // Exercises created from this picker, newest first. They're pinned to the
  // top so they're visible when coming back, instead of somewhere down the
  // alphabetical, paged list.
  const [createdIds, setCreatedIds] = useState<string[]>([]);
  const listRef = useRef<FlatList<ExerciseItem>>(null);

  useEffect(() => {
    if (subscribeExerciseCreated === undefined) {
      return;
    }
    return subscribeExerciseCreated((exerciseId) => {
      setSelectedIds((current) => [...current, exerciseId]);
      setCreatedIds((current) => [exerciseId, ...current]);
      listRef.current?.scrollToOffset({ offset: 0, animated: false });
    });
  }, [subscribeExerciseCreated]);

  function pinRank(exerciseId: string) {
    const index = createdIds.indexOf(exerciseId);
    return index === -1 ? createdIds.length : index;
  }

  function resetPaging() {
    setVisibleCount(PAGE_SIZE);
    listRef.current?.scrollToOffset({ offset: 0, animated: false });
  }

  function changeQuery(text: string) {
    setQuery(text);
    resetPaging();
  }

  function toggleType(type: TrackingType) {
    setTypeFilter((current) => toggleItem(current, type));
    resetPaging();
  }

  function toggleMuscle(id: MuscleId) {
    setMuscleFilter((current) => toggleItem(current, id));
    resetPaging();
  }

  function clearFilters() {
    setTypeFilter([]);
    setMuscleFilter([]);
    resetPaging();
  }

  function toggleExercise(id: string) {
    setSelectedIds((current) => toggleItem(current, id));
  }

  const collator = new Intl.Collator(language);
  const items = exercises
    .filter((exercise) => !excludeIds.includes(exercise.id))
    .map((exercise): ExerciseItem => {
      const label = getExerciseText(exercise, t).name;
      return {
        ...exercise,
        label,
        detail: getExerciseDetail(exercise, t),
        searchText: normalizeForSearch(label),
      };
    })
    .sort(
      (a, b) =>
        pinRank(a.id) - pinRank(b.id) || collator.compare(a.label, b.label),
    );

  const filterMuscles = MUSCLE_IDS.filter((id) =>
    items.some((item) => item.primaryMuscles.includes(id)),
  );

  const search = normalizeForSearch(query);
  const visibleItems = items.filter(
    (item) =>
      (typeFilter.length === 0 || typeFilter.includes(item.trackingType)) &&
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
      style={[globalStyles.modalScreen, styles.screen]}
      edges={["top", "bottom"]}
    >
      <BackHeader
        backLabel={backLabel}
        title={t.newExercises.title}
        action={
          onCreateCustom !== undefined && (
            <IconButton
              icon={{ ios: "plus", android: "add", web: "add" }}
              accessibilityLabel={t.newExercises.createCustom}
              onPress={onCreateCustom}
            />
          )
        }
      />
      <View style={styles.searchRow}>
        <View style={styles.search}>
          <SearchInput
            value={query}
            onChangeText={changeQuery}
            placeholder={t.newExercises.searchPlaceholder}
            clearLabel={t.newExercises.clearSearch}
          />
        </View>
        <FilterButton
          label={t.newExercises.filters}
          activeCount={typeFilter.length + muscleFilter.length}
          onPress={() => setFiltersOpen(true)}
        />
      </View>
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
          loaded ? <NoContentBox label={t.newExercises.noResults} /> : null
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      />
      <PrimaryButton
        label={doneLabel(selectedIds.length)}
        onPress={() => onDone(selectedIds)}
        disabled={!allowEmpty && selectedIds.length === 0}
      />
      <ExerciseInfoSheet exercise={info} onClose={() => setInfo(null)} />
      <ExerciseFiltersSheet
        visible={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        typeFilter={typeFilter}
        muscleFilter={muscleFilter}
        muscles={filterMuscles}
        resultCount={visibleItems.length}
        onToggleType={toggleType}
        onToggleMuscle={toggleMuscle}
        onClear={clearFilters}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    paddingBottom: spacing.md,
  },
  searchRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  search: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
  },
});
