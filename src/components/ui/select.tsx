import * as React from "react"

import { cn } from "@/lib/utils"

// A plain <select> styled to match Input's border/shadow treatment, rather
// than Radix Select — this app only ever needs a handful of static options.
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      data-slot="select"
      className={cn(
        "h-11 w-full min-w-0 rounded-[var(--radius-btn)] border-[3px] border-border bg-input px-3 py-1 font-sans text-sm text-foreground outline-none transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    >
      {children}
    </select>
  )
}

export { Select }
