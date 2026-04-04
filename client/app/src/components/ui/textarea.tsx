import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-25 rounded-md border-2 border-border bg-transparent px-3 py-2 text-base shadow-xs outline-none transition-all duration-200 placeholder:text-muted-foreground md:text-sm",

        "focus:border-transparent focus:border-b-primary focus:border-b-2 focus:ring-0 focus:rounded-none",

        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",

        className
      )}
      {...props}
    />
  )
}

export { Textarea }
