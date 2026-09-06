import { resolveAssetUrl } from "@/lib/asset-url";
import styles from "./avatar.module.scss";

interface AvatarProps {
  avatarUrl: string | null;
  /** Used for the fallback initial when there's no photo — display name or email. */
  label: string;
  size?: "sm" | "lg";
}

/** A user's photo, or their first initial in a circle when there isn't one. Mirrors the main app's identical component. */
export function Avatar({ avatarUrl, label, size = "lg" }: AvatarProps) {
  const resolved = resolveAssetUrl(avatarUrl);
  const initial = label.charAt(0).toUpperCase();

  return (
    <span className={`${styles.avatar} ${styles[size]}`}>
      {resolved ? (
        // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable dev-origin URL; not worth Next/Image's remotePatterns config for a small avatar.
        <img src={resolved} alt="" className={styles.image} />
      ) : (
        <span className={styles.initial} aria-hidden="true">
          {initial}
        </span>
      )}
    </span>
  );
}
