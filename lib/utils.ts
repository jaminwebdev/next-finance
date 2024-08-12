import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertAmountToMiliUnits = (amount: number) => {
  return Math.round(amount * 1000);
}

export const convertAmountFromMiliunits = (amount: number) => {
  return Math.round(amount / 1000);
}