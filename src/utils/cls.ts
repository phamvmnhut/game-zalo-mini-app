import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const clsV2 = (...args: Array<string>) =>
  args
    .join(" ")
    .trim();

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
