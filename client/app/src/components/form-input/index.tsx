import * as React from "react"
import { cn } from "@/lib/utils"

export interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> { }

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                ref={ref}
                autoComplete='off'
                className={cn(
      
                    "w-full rounded-md border-2 border-border bg-transparent px-3 py-1.5 outline-none transition-all duration-200",

                    "focus:border-transparent focus:border-b-primary focus:border-b-2 focus:ring-0 focus:rounded-none",

                    "disabled:cursor-not-allowed disabled:opacity-50",

                    className
                )}
                {...props}
            />
        )
    }
)

FormInput.displayName = "FormInput"

export { FormInput }
