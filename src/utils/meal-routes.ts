import type { Href } from "expo-router";

export function calorieDayHref(date: string): Href {
  return {
    pathname: "/calories/day",
    params: { date },
  } as unknown as Href;
}

export function addMealHref(date: string): Href {
  return {
    pathname: "/calories/add-meal",
    params: { date },
  } as unknown as Href;
}

export function editMealHref(id: string): Href {
  return {
    pathname: "/calories/edit-meal",
    params: { id },
  } as unknown as Href;
}

export const caloriesTabHref = "/calories" as Href;
