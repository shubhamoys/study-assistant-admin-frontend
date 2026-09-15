"use client";

import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import styles from "./password-input.module.scss";

type PasswordInputProps = Omit<React.ComponentProps<"input">, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrap}>
      <Input
        type={visible ? "text" : "password"}
        className={cn(styles.input, className)}
        {...props}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((current) => !current)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        suppressHydrationWarning
      >
        {visible ? (
          <EyeSlash size={18} weight="bold" />
        ) : (
          <Eye size={18} weight="bold" />
        )}
      </button>
    </div>
  );
}
