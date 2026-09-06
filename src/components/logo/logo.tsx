import styles from "./logo.module.scss";

// The source SVGs' fixed viewBox ratio (280:68) — used to derive whichever
// of height/width wasn't given.
const ASPECT_RATIO = 280 / 68;

interface LogoProps {
  className?: string;
  /** Height in pixels — width follows automatically. Ignored if `width` is given. */
  height?: number;
  /** Width in pixels — height follows automatically. Use this instead of `height` when the layout's constraint is horizontal space (e.g. a sidebar), not vertical. */
  width?: number;
}

/**
 * The StudyLoop wordmark+icon lockup, swapped between the light/dark SVG
 * variants purely via CSS (`:global(.dark)` toggling which `<img>` is
 * visible) — no theme-detection JS or mount guard needed, since next-themes
 * already stamps the `.dark` class on `<html>` before first paint. Both
 * images are always in the DOM; only one is ever visible. Mirrors the main
 * app's identical component — see its doc comment for the full reasoning.
 */
export function Logo({ className, height, width }: LogoProps) {
  const resolvedHeight = height ?? (width ? width / ASPECT_RATIO : 28);
  const resolvedWidth = width ?? resolvedHeight * ASPECT_RATIO;

  return (
    <span
      className={`${styles.logo} ${className ?? ""}`}
      style={{ height: resolvedHeight, width: resolvedWidth }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static local SVG, swapped by theme via CSS; next/image adds no value here */}
      <img
        src="/studyloop-logo-light.svg"
        alt="StudyLoop"
        className={styles.light}
      />
      {/* eslint-disable-next-line @next/next/no-img-element -- see above */}
      <img
        src="/studyloop-logo-dark.svg"
        alt="StudyLoop"
        className={styles.dark}
      />
    </span>
  );
}
