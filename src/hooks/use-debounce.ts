import { useEffect, useState } from "react";

/** Returns `value`, but only updates after it's stopped changing for `delayMs` — for live search-as-you-type inputs so every keystroke doesn't fire a query. */
export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(timeout);
  }, [value, delayMs]);

  return debounced;
}
