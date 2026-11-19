export type GoalProgressResult = {
  progress: number;
  percent: number;
  remainingKg: number;
  reached: boolean;
  direction: "lose" | "gain" | "maintain";
};

/**
 * Progress from the user's starting weight toward their goal.
 * 0% at the start weight, 100% at the goal (clamped).
 */
export function getGoalProgress(
  startKg: number,
  currentKg: number,
  goalKg: number,
): GoalProgressResult {
  const remainingKg = currentKg - goalKg;
  const reached = Math.abs(remainingKg) < 0.05;
  const totalDelta = startKg - goalKg;

  if (Math.abs(totalDelta) < 0.05) {
    return {
      progress: reached ? 1 : 0,
      percent: reached ? 100 : 0,
      remainingKg,
      reached,
      direction: "maintain",
    };
  }

  const direction: GoalProgressResult["direction"] =
    totalDelta > 0 ? "lose" : "gain";

  // How far we've moved from start toward goal (can be negative if going the wrong way).
  const moved = startKg - currentKg;
  const raw = moved / totalDelta;
  const progress = Math.min(Math.max(raw, 0), 1);

  return {
    progress: reached ? 1 : progress,
    percent: reached ? 100 : Math.round(progress * 100),
    remainingKg,
    reached,
    direction,
  };
}
