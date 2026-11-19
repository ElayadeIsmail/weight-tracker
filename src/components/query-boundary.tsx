import type { ReactNode } from "react";

import { EmptyState, ErrorState, LoadingState } from "./ui";

type QueryBoundaryProps<T> = Readonly<{
  query: {
    isPending: boolean;
    isError: boolean;
    error: Error | null;
    data: T | undefined;
    refetch?: () => unknown;
  };
  children: (data: T) => ReactNode;
  loading?: ReactNode;
  error?: (error: Error) => ReactNode;
  empty?: ReactNode;
  isEmpty?: (data: T) => boolean;
}>;

export function QueryBoundary<T>({
  query,
  children,
  loading,
  error,
  empty,
  isEmpty,
}: QueryBoundaryProps<T>) {
  if (query.isPending) {
    return loading ?? <LoadingState />;
  }

  if (query.isError) {
    return (
      error?.(query.error!) ?? (
        <ErrorState error={query.error} onRetry={query.refetch} />
      )
    );
  }

  if (query.data == null || isEmpty?.(query.data)) {
    return empty ?? <EmptyState />;
  }

  return <>{children(query.data)}</>;
}
