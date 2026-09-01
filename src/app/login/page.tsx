import { Suspense } from "react";
import { LoginForm } from "@/features/auth/login-form/login-form";
import styles from "@/features/auth/auth-form.module.scss";

export default function LoginPage() {
  return (
    <div className={styles.page}>
      <Suspense>
        <LoginForm />
      </Suspense>
    </div>
  );
}
