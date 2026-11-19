import { parseDateKey, toDateKey } from "@/utils/date";

export const BIRTH_YEAR_MIN = 1920;
export const DEFAULT_BIRTH_AGE_YEARS = 30;

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toBirthDateKey(
  year: number,
  month: number,
  day: number,
): string {
  const maxDay = daysInMonth(year, month);
  return `${year}-${pad(month)}-${pad(Math.min(day, maxDay))}`;
}

export function createBirthYearOptions(
  currentYear = new Date().getFullYear(),
): number[] {
  const options: number[] = [];
  for (let year = currentYear; year >= BIRTH_YEAR_MIN; year -= 1) {
    options.push(year);
  }
  return options;
}

export function createBirthDayOptions(year: number, month: number): number[] {
  return Array.from(
    { length: daysInMonth(year, month) },
    (_, index) => index + 1,
  );
}

export function resolveInitialBirthDate(birthDate: string | null): string {
  if (birthDate) return birthDate;

  const fallback = new Date();
  fallback.setFullYear(fallback.getFullYear() - DEFAULT_BIRTH_AGE_YEARS);
  return toDateKey(fallback);
}

export function splitBirthDate(dateKey: string): {
  year: number;
  month: number;
  day: number;
} {
  const date = parseDateKey(dateKey);
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
  };
}
