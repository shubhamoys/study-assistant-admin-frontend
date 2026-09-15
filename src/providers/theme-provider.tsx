"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

/**
 * attribute="class" toggles the shadcn-standard `.dark` class on <html>,
 * which is what src/app/globals.css's `.dark` block and every shadcn
 * primitive's `dark:` variants expect. `enableSystem` makes next-themes
 * itself watch `prefers-color-scheme` and inject a no-flash boot script.
 */
export function ThemeProvider({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
