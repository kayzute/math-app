/**
 * Returns a pseudo-random integer between min and max (inclusive).
 */
export function getRandomInt(min: number, max: number): number {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  if (minCeiled > maxFloored) {
    throw new Error(`min (${min}) cannot be greater than max (${max})`);
  }
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1)) + minCeiled;
}

/**
 * Clamps a number within the inclusive bounds [min, max].
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}
