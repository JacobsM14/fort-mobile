import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BackHeader } from "@/components/ui/layout/back-header";
import { ExerciseFiltersSheet } from "@/components/exercises/exercise-filters-sheet";
import { ExerciseInfoSheet } from "@/components/exercises/exercise-info-sheet";
import { ExerciseRow } from "@/components/exercises/exercise-row";
import { FilterButton } from "@/components/ui/buttons/filter-button";
import { IconButton } from "@/components/ui/buttons/icon-button";
import { NoContentBox } from "@/components/ui/content/no-content-box";
import { PrimaryButton } from "@/components/ui/buttons/primary-button";
import { SearchInput } from "@/components/ui/inputs/search-input";
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
import { NEW_ROUTINE_ID, useRoutineDraft } from "@/hooks/use-routine-draft";
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

export default function NewExercisesScreen() {
  const { t, language } = useTranslation();
  const { globalStyles } = useTheme();
  const { exercises, loaded } = useExerciseList();
  const { routineId, exerciseIds, setExerciseIds, subscribeExerciseCreated } =
    useRoutineDraft();
  const [query, setQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<TrackingType[]>([]);
  const [muscleFilter, setMuscleFilter] = useState<MuscleId[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>(exerciseIds);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [info, setInfo] = useState<ExerciseInfo | null>(null);
  // Exercises created from this picker, newest first. They're pinned to the
  // top so they're visible when coming back, instead of somewhere down the
  // alphabetical, paged list.
  const [createdIds, setCreatedIds] = useState<string[]>([]);
  const listRef = useRef<FlatList<ExerciseItem>>(null);

  useEffect(
    () =>
      subscribeExerciseCreated((exerciseId) => {
        setSelectedIds((current) => [...current, exerciseId]);
        setCreatedIds((current) => [exerciseId, ...current]);
        listRef.current?.scrollToOffset({ offset: 0, animated: false });
      }),
    [subscribeExerciseCreated],
  );

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
    .sort(
      (a, b) =>
        pinRank(a.id) - pinRank(b.id) || collator.compare(a.label, b.label),
    );

  const filterMuscles = MUSCLE_IDS.filter((id) =>
    exercises.some((exercise) => exercise.primaryMuscles.includes(id)),
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
        backLabel={
          routineId === null
            ? t.newExercises.breadCrumb
            : t.newExercises.breadCrumbEdit
        }
        title={t.newExercises.title}
        action={
          <IconButton
            icon={{ ios: "plus", android: "add", web: "add" }}
            accessibilityLabel={t.newExercises.createCustom}
            onPress={() =>
              router.push({
                pathname: "/routine/[id]/new_custom_exercise",
                params: { id: routineId ?? NEW_ROUTINE_ID },
              })
            }
          />
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
        label={t.newExercises.done(selectedIds.length)}
        onPress={confirmSelection}
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
