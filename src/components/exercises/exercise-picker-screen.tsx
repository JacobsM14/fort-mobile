import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ExerciseFiltersSheet } from "@/components/exercises/exercise-filters-sheet";
import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { DashedButton } from "@/components/ui/buttons/dashed-button";
import { FilterButton } from "@/components/ui/buttons/filter-button";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { SearchInput } from "@/components/ui/inputs/search-input";
import { BackHeader } from "@/components/ui/layout/back-header";

import { useTheme } from "@/hooks/use-theme";
import { useTranslation } from "@/i18n";

import {
  getExerciseDetail,
  getExerciseInfo,
  getExerciseText,
  MUSCLE_IDS,
  type ExerciseInfo,
  type MuscleId,
} from "@/features/exercises/catalog";
import {
  activeFilterCount,
  availableMuscleGroups,
  EMPTY_MUSCLE_FILTER,
  filterMuscleIds,
  toggleFilterMuscle,
  toggleMuscleGroup,
  visibleFilterMuscles,
  type MuscleFilter,
} from "@/features/exercises/muscle-filter";
import {
  useExerciseList,
  type ExerciseSummary,
} from "@/features/exercises/queries";

import type { MuscleGroup, TrackingType } from "@/constants/enums";

import { toggleItem } from "@/utils/array";
import { normalizeForSearch } from "@/utils/text";

import { spacing } from "@/constants/theme";

const PAGE_SIZE = 10;

type ExerciseItem = ExerciseSummary & {
  label: string;
  detail: string;
  searchText: string;
};

type ExercisePickerScreenProps = {
  backLabel: string;
  initialSelectedIds?: readonly string[];
  excludeIds?: readonly string[];
  doneLabel: (count: number) => string;
  onDone: (selectedIds: string[]) => void;
  allowEmpty?: boolean;
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
  const [muscleFilter, setMuscleFilter] =
    useState<MuscleFilter>(EMPTY_MUSCLE_FILTER);

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
    setMuscleFilter((current) => toggleFilterMuscle(current, id));
    resetPaging();
  }

  function toggleGroup(group: MuscleGroup) {
    setMuscleFilter((current) =>
      toggleMuscleGroup(current, group, filterMuscles),
    );
    resetPaging();
  }

  function clearFilters() {
    setTypeFilter([]);
    setMuscleFilter(EMPTY_MUSCLE_FILTER);
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
  const matchingMuscles = filterMuscleIds(muscleFilter);

  const search = normalizeForSearch(query);
  const visibleItems = items.filter(
    (item) =>
      (typeFilter.length === 0 || typeFilter.includes(item.trackingType)) &&
      (matchingMuscles.length === 0 ||
        item.primaryMuscles.some((muscle) =>
          matchingMuscles.includes(muscle),
        )) &&
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
      <BackHeader backLabel={backLabel} title={t.newExercises.title} />
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
          activeCount={typeFilter.length + activeFilterCount(muscleFilter)}
          onPress={() => setFiltersOpen(true)}
        />
      </View>
      <View style={styles.results}>
        {onCreateCustom !== undefined && (
          <DashedButton
            icon={{ ios: "plus", android: "add", web: "add" }}
            label={t.newExercises.createCustom}
            tone="muted"
            compact
            onPress={onCreateCustom}
          />
        )}
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
            loaded ? (
              <NoContentBox
                label={t.newExercises.noResults}
                onPress={onCreateCustom}
              />
            ) : undefined
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}
        />
      </View>
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
        groupFilter={muscleFilter.groups}
        muscleFilter={muscleFilter.muscles}
        groups={availableMuscleGroups(filterMuscles)}
        muscles={visibleFilterMuscles(muscleFilter, filterMuscles)}
        resultCount={visibleItems.length}
        onToggleType={toggleType}
        onToggleGroup={toggleGroup}
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
  results: {
    flex: 1,
    gap: spacing.sm,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: spacing.xs,
  },
});
