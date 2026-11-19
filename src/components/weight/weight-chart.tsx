import { TrendChart } from "@/components/ui/trend-chart";
import type { ChartPoint } from "@/types/weight";

type WeightChartProps = Readonly<{
  points: ChartPoint[];
}>;

export function WeightChart({ points }: WeightChartProps) {
  return (
    <TrendChart
      points={points}
      title="Weight trend"
      emptyDescription="Log a few days to see your weight graph."
      unitLabel="kg"
    />
  );
}
