"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client/react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  UPDATE_PROFILE_MUTATION,
  type UpdateProfileMutationData,
  type UpdateProfileMutationVars,
} from "@/features/auth/graphql";
import authFormStyles from "@/features/auth/auth-form.module.scss";
import styles from "../account-view/account-view.module.scss";

const profileSchema = z.object({
  displayName: z
    .string()
    .min(1, "Display name cannot be empty")
    .max(100, "Display name must be at most 100 characters long"),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
  displayName: string | null;
  onSaved: (displayName: string) => void;
}

/** Mirrors the main app's identical component — same UpdateProfile mutation, same backend. */
export function ProfileForm({ displayName, onSaved }: ProfileFormProps) {
  const [saved, setSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { displayName: displayName ?? "" },
  });

  const [updateProfileMutation, { error }] = useMutation<
    UpdateProfileMutationData,
    UpdateProfileMutationVars
  >(UPDATE_PROFILE_MUTATION);

  async function onSubmit(values: ProfileFormValues) {
    setSaved(false);
    const { data } = await updateProfileMutation({
      variables: { input: { displayName: values.displayName } },
    });
    if (data) {
      onSaved(data.updateProfile.displayName ?? values.displayName);
      setSaved(true);
      // Re-baseline isDirty against the just-saved value, otherwise it stays
      // true forever after the first edit and the "Saved." notice below
      // (which only shows while `!isDirty`) would never appear.
      reset(values);
    }
  }

  return (
    <form
      className={authFormStyles.fields}
      onSubmit={(event) => void handleSubmit(onSubmit)(event)}
      noValidate
    >
      {error && (
        <div className={authFormStyles.formError} role="alert">
          <span className={authFormStyles.formErrorBadge} aria-hidden="true">
            !
          </span>
          <span>Something went wrong. Please try again.</span>
        </div>
      )}

      {saved && !isDirty && (
        <div className={styles.successNotice} role="status">
          Saved.
        </div>
      )}

      <div className={authFormStyles.field}>
        <label className={authFormStyles.fieldLabel} htmlFor="displayName">
          Display name
        </label>
        <Input
          id="displayName"
          aria-invalid={Boolean(errors.displayName)}
          {...register("displayName")}
        />
        {errors.displayName && (
          <span className={authFormStyles.fieldError}>
            {errors.displayName.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className={styles.sectionButton}
      >
        {isSubmitting ? "Saving…" : "Save"}
      </Button>
    </form>
  );
}
