import { TrendChart } from "@/components/ui/trend-chart";
import type { ChartPoint } from "@/types/weight";

type CaloriesChartProps = Readonly<{
  points: ChartPoint[];
}>;

export function CaloriesChart({ points }: CaloriesChartProps) {
  return (
    <TrendChart
      points={points}
      title="Calories trend"
      emptyDescription="Log meals for a few days to see your calorie graph."
      unitLabel="kcal"
    />
  );
}
