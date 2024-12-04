/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const errorMessage = (arg: any) => {
  try {
    return typeof arg?.response?.data?.message === "object"
      ? arg?.response?.data?.message?.join(", ")
      : arg?.response?.data?.message;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  } catch (error: any) {
    return "Internal server error";
  }
};
