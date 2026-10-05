import { FilterState } from "./types";

export const defaultFilterState: FilterState = {
  scope: "municipio",
  startYear: 2014,
  endYear: 2024,
  ageGroup: "ALL",
  gender: "ALL",
  symptoms: [],
};

export const DRAWER_WIDTH = 260;

export const parseBool = (value: string | null): boolean => {
  if (value === null) return false;
  return value.toLowerCase() === "true";
};
