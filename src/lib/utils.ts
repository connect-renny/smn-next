export { cn } from "cn";

/** `Object.entries` that keeps the key type. */
export function entries<K extends string, V>(record: Record<K, V>) {
  return Object.entries(record) as [K, V][];
}
