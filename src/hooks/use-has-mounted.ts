import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after client hydration. Prefer this over `useEffect(() =>
 * setMounted(true), [])` — that pattern trips the react-hooks/set-state-in-effect
 * rule (setState directly in an effect body); useSyncExternalStore reports the
 * client/server snapshot difference without an extra render-triggering effect.
 */
export function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
