import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  mealRepository,
  type MealUpdateInput,
} from "@/repositories/meal.repository";
import { estimateMealCalories } from "@/services/calories.service";
import { useAuthStore } from "@/store/auth.store";
import type { MealInsert } from "@/types/meal";
import { toDateKey } from "@/utils/date";
import { toDaySummary } from "@/utils/meal";

function invalidateMealQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  entryDate?: string,
) {
  queryClient.invalidateQueries({ queryKey: queryKeys.mealHistory });
  if (entryDate) {
    queryClient.invalidateQueries({
      queryKey: queryKeys.mealsByDate(entryDate),
    });
  } else {
    queryClient.invalidateQueries({ queryKey: ["meal_entries"] });
  }
}

export function useMealHistory() {
  const session = useAuthStore((s) => s.session);

  return useInfiniteQuery({
    queryKey: queryKeys.mealHistory,
    queryFn: ({ pageParam }) =>
      mealRepository.getHistoryPage(
        pageParam ? { beforeDate: pageParam } : undefined,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!session,
    select: (data) => data.pages.flatMap((page) => page.days),
  });
}

export function useMealsForDate(entryDate: string = toDateKey()) {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: queryKeys.mealsByDate(entryDate),
    queryFn: async () => {
      const meals = await mealRepository.getByDate(entryDate);
      return toDaySummary(entryDate, meals);
    },
    enabled: !!session && !!entryDate,
  });
}

export function useMeal(id: string | undefined) {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: queryKeys.mealById(id ?? ""),
    queryFn: () => mealRepository.getById(id!),
    enabled: !!session && !!id,
  });
}

export function useEstimateMealCalories() {
  return useMutation({
    mutationFn: estimateMealCalories,
  });
}

export function useSaveMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      input: Omit<MealInsert, "id" | "user_id" | "created_at" | "updated_at">,
    ) => mealRepository.save(input),
    onSuccess(meal) {
      invalidateMealQueries(queryClient, meal.entry_date);
    },
  });
}

export function useUpdateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: MealUpdateInput }) =>
      mealRepository.update(id, input),
    onSuccess(meal) {
      // Broad invalidation covers day moves (old + new entry dates).
      invalidateMealQueries(queryClient);
      queryClient.setQueryData(queryKeys.mealById(meal.id), meal);
    },
  });
}

export function useDeleteMeal(entryDate?: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mealRepository.remove,
    onSuccess() {
      invalidateMealQueries(queryClient, entryDate);
    },
  });
}
