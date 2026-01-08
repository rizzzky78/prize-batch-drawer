import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function fisherYatesShuffle<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    // Generate a random index j such that 0 <= j <= i
    // using rejection sampling to avoid modulo bias.
    const limit = i + 1;
    const maxValid = 4294967296 - (4294967296 % limit); // Largest multiple of limit <= 2^32

    let randomValue: number;
    const buffer = new Uint32Array(1);

    do {
      crypto.getRandomValues(buffer);
      randomValue = buffer[0];
    } while (randomValue >= maxValid);

    const j = randomValue % limit;
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}
