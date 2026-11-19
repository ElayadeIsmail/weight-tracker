import { useMemo } from "react";

import { useProfile } from "@/hooks/use-profile";
import { useWeightEntries } from "@/hooks/use-weight";
import { resolveDailyCalorieTarget } from "@/utils/calories";
import { resolveMacroTargets } from "@/utils/macros";
import { getWeightStats } from "@/utils/weight";

export function useDailyCalorieTarget() {
  const { data: profile, isPending: profilePending } = useProfile();
  const { data: weights, isPending: weightsPending } = useWeightEntries();

  const { target, macros, weightKg } = useMemo(() => {
    const latestKg = getWeightStats(weights).latest?.weight_kg ?? null;
    const resolved = resolveDailyCalorieTarget({
      profile,
      weightKg: latestKg,
    });
    const macroTargets =
      resolved != null && latestKg != null
        ? resolveMacroTargets(resolved.targetKcal, latestKg)
        : null;

    return {
      target: resolved,
      macros: macroTargets,
      weightKg: latestKg,
    };
  }, [profile, weights]);

  return {
    target,
    macros,
    weightKg,
    isPending: profilePending || weightsPending,
  };
}
