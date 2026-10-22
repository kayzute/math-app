let counter = 0;

/**
 * Generates a unique string identifier, optionally with a prefix.
 */
export function generateId(prefix: string = 'id'): string {
  counter += 1;
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${timestamp}_${counter}_${randomPart}`;
}
