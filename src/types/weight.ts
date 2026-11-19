import { Database } from "./database";

export type Weight = Database["public"]["Tables"]["weight_entries"]["Row"];

export type WeightInsert =
  Database["public"]["Tables"]["weight_entries"]["Insert"];

export type WeightStats = {
  latest: Weight | null;
  previous: Weight | null;
  changeKg: number | null;
  averageKg: number | null;
  minKg: number | null;
  maxKg: number | null;
  count: number;
};

export type ChartPoint = {
  value: number;
  label: string;
  date: string;
};
