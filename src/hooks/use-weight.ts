import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { weightRepository } from "@/repositories/weight.repository";
import { useAuthStore } from "@/store/auth.store";

export function useWeightEntries() {
  const session = useAuthStore((s) => s.session);

  return useQuery({
    queryKey: queryKeys.weightEntries,
    queryFn: weightRepository.getAll,
    enabled: !!session,
  });
}

export function useWeightHistory() {
  const session = useAuthStore((s) => s.session);

  return useInfiniteQuery({
    queryKey: queryKeys.weightHistory,
    queryFn: ({ pageParam }) =>
      weightRepository.getHistoryPage(
        pageParam ? { beforeDate: pageParam } : undefined,
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: !!session,
    select: (data) => data.pages.flatMap((page) => page.entries),
  });
}

export function useSaveWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightRepository.save,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.weightEntries,
      });
    },
  });
}

export function useDeleteWeight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: weightRepository.remove,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: queryKeys.weightEntries,
      });
    },
  });
}
