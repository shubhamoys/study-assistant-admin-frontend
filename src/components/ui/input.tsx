import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      // Password-manager/form-filler browser extensions tag scanned inputs
      // with a `fdprocessedid` attribute before React hydrates, which
      // otherwise trips a dev-only hydration-mismatch warning.
      suppressHydrationWarning
      className={cn(
        "h-11 w-full min-w-0 rounded-[var(--radius-btn)] border-[3px] border-border bg-input px-3 py-1 font-sans text-sm text-foreground outline-none transition-colors file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
