import { getCalorieProgress } from "@/utils/calories";

export type MacroTargets = {
  proteinG: number;
  carbohydratesG: number;
  fatG: number;
};

export type MacroProgressItem = {
  key: "protein" | "carbs" | "fat";
  label: string;
  eatenG: number;
  targetG: number;
  progress: number;
  percent: number;
  over: boolean;
};

/**
 * Protein/fat from body weight; carbs fill remaining calorie budget.
 */
export function resolveMacroTargets(
  targetKcal: number,
  weightKg: number,
): MacroTargets {
  const proteinG = Math.round(weightKg * 1.8);
  const fatG = Math.round(weightKg * 0.8);
  const remainingKcal = Math.max(targetKcal - proteinG * 4 - fatG * 9, 0);
  const carbohydratesG = Math.round(remainingKcal / 4);

  return {
    proteinG: Math.max(proteinG, 0),
    carbohydratesG: Math.max(carbohydratesG, 0),
    fatG: Math.max(fatG, 0),
  };
}

export function getMacroProgressItems(
  eaten: {
    proteinG: number;
    carbohydratesG: number;
    fatG: number;
  },
  targets: MacroTargets,
): MacroProgressItem[] {
  const rows = [
    {
      key: "protein" as const,
      label: "Protein",
      eatenG: eaten.proteinG,
      targetG: targets.proteinG,
    },
    {
      key: "carbs" as const,
      label: "Carbs",
      eatenG: eaten.carbohydratesG,
      targetG: targets.carbohydratesG,
    },
    {
      key: "fat" as const,
      label: "Fat",
      eatenG: eaten.fatG,
      targetG: targets.fatG,
    },
  ];

  return rows.map((row) => {
    const { progress, percent, over } = getCalorieProgress(
      row.eatenG,
      row.targetG,
    );
    return { ...row, progress, percent, over };
  });
}
