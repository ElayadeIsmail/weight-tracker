import { addDays, format, isToday as isTodayDate, parseISO } from "date-fns";

export const toDateKey = (date: Date = new Date()): string =>
  format(date, "yyyy-MM-dd");

export const parseDateKey = (dateKey: string): Date => parseISO(dateKey);

export const formatDisplayDate = (dateKey: string): string =>
  format(parseDateKey(dateKey), "EEE, MMM d");

export const formatChartLabel = (dateKey: string): string =>
  format(parseDateKey(dateKey), "MMM d");

export const formatLongDate = (dateKey: string): string =>
  format(parseDateKey(dateKey), "EEEE, MMMM d, yyyy");

export const shiftDateKey = (dateKey: string, days: number): string =>
  toDateKey(addDays(parseDateKey(dateKey), days));

export const isToday = (dateKey: string): boolean =>
  isTodayDate(parseDateKey(dateKey));
