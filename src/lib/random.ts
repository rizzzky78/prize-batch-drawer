import { fisherYatesShuffle } from "./utils";

/**
 * Fetch unique random indices from Random.org via our API route.
 * Returns an array of `count` unique random integers in [0, max - 1].
 */
async function fetchRandomIndices(
  count: number,
  max: number
): Promise<number[]> {
  const response = await fetch("/api/random", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ count, max }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      `Random.org API error: ${response.status} - ${errorBody?.error || "Unknown error"}`
    );
  }

  const { data } = (await response.json()) as { data: number[] };
  return data;
}

/**
 * Shuffle an array using Random.org for true randomness.
 *
 * Requests `array.length` unique random indices from Random.org,
 * then uses them to produce a permutation of the array.
 *
 * Falls back to local `fisherYatesShuffle` (crypto.getRandomValues)
 * if the Random.org call fails.
 */
export async function shuffleWithRandomOrg<T>(array: T[]): Promise<T[]> {
  if (array.length <= 1) return [...array];

  try {
    // Get a random permutation of indices [0, array.length - 1]
    const randomIndices = await fetchRandomIndices(array.length, array.length);
    // Map each random index to the corresponding element
    return randomIndices.map((i) => array[i]);
  } catch (error) {
    console.warn(
      "[Random.org] Failed, falling back to local shuffle:",
      error
    );
    return fisherYatesShuffle(array);
  }
}
