"use client";

import { useQuery } from "@apollo/client/react";
import { ME_QUERY, type MeQueryData } from "@/features/auth/graphql";
import { setUser } from "@/features/auth/auth-slice";
import { useAppDispatch } from "@/lib/redux-hooks";
import { AvatarUploader } from "../avatar-uploader/avatar-uploader";
import { ChangePasswordForm } from "../change-password-form/change-password-form";
import { ProfileForm } from "../profile-form/profile-form";
import styles from "./account-view.module.scss";

// No email-verification banner here, unlike the main app's AccountView —
// admin accounts are never self-registered (see users.service.ts's
// createAdmin, which sets isEmailVerified: true unconditionally) or the
// seeder, both trusted sources, so there's nothing to verify.
export function AccountView() {
  const dispatch = useAppDispatch();

  const { data, loading, refetch } = useQuery<MeQueryData>(ME_QUERY);
  const user = data?.me;

  function handleProfileSaved(displayName: string) {
    if (user) {
      dispatch(setUser({ ...user, displayName }));
    }
  }

  function handleAvatarUploaded(avatarUrl: string) {
    if (user) {
      dispatch(setUser({ ...user, avatarUrl }));
    }
    void refetch();
  }

  return (
    <div className={styles.page}>
      {loading && !data && <p className={styles.status}>Loading…</p>}

      {user && (
        <>
          <section className={`${styles.section} index-card`}>
            <h2 className={styles.sectionTitle}>Profile</h2>
            <AvatarUploader
              avatarUrl={user.avatarUrl}
              displayName={user.displayName}
              email={user.email}
              onUploaded={handleAvatarUploaded}
            />
            <p className={styles.email}>{user.email}</p>
            <ProfileForm
              displayName={user.displayName}
              onSaved={handleProfileSaved}
            />
          </section>

          <ChangePasswordForm />
        </>
      )}
    </div>
  );
}
