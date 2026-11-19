import type { BmiCategory, BmiResult } from "@/types/profile";

const BMI_SCALE = [
  {
    category: "underweight" as const,
    max: 18.5,
    label: "Underweight",
    description: "Below the healthy range.",
  },
  {
    category: "normal" as const,
    max: 25,
    label: "Healthy",
    description: "Within the healthy BMI range.",
  },
  {
    category: "overweight" as const,
    max: 30,
    label: "Overweight",
    description: "Above the healthy range.",
  },
  {
    category: "obese" as const,
    max: Number.POSITIVE_INFINITY,
    label: "Obese",
    description: "Well above the healthy range.",
  },
];

export function calculateBmi(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (weightKg <= 0 || heightM <= 0) return 0;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

export function getBmiCategory(bmi: number): BmiCategory {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
}

export function getBmiResult(weightKg: number, heightCm: number): BmiResult {
  const value = calculateBmi(weightKg, heightCm);
  const category = getBmiCategory(value);
  const meta = BMI_SCALE.find((item) => item.category === category)!;

  return {
    value,
    category,
    label: meta.label,
    description: meta.description,
  };
}

export function getBmiScalePosition(bmi: number): number {
  const min = 15;
  const max = 40;
  return Math.min(Math.max((bmi - min) / (max - min), 0), 1);
}

export function parseHeightInput(value: string): number | null {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;

  const parsed = Number(normalized);
  if (!Number.isFinite(parsed) || parsed < 100 || parsed > 250) {
    return null;
  }

  return Math.round(parsed);
}

export const BMI_SEGMENTS = [
  {
    category: "underweight" as const,
    label: "Under",
    flex: 3.5,
    colorLight: "#5B8DEF",
    colorDark: "#7AA7F5",
  },
  {
    category: "normal" as const,
    label: "Healthy",
    flex: 6.5,
    colorLight: "#1F8A5B",
    colorDark: "#3DBF7F",
  },
  {
    category: "overweight" as const,
    label: "Over",
    flex: 5,
    colorLight: "#C99214",
    colorDark: "#E6B84D",
  },
  {
    category: "obese" as const,
    label: "Obese",
    flex: 10,
    colorLight: "#E5673F",
    colorDark: "#F08A66",
  },
] as const;
