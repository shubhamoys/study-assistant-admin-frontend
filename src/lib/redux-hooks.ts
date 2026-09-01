import { useDispatch, useSelector, useStore } from "react-redux";
import type { AppDispatch, AppStore, RootState } from "./store";

// Typed wrappers per Redux Toolkit's recommended pattern — use these instead
// of the plain `useDispatch`/`useSelector` throughout the app.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
