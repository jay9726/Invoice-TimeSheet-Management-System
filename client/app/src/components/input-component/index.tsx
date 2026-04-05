import React, { useState } from 'react'
import Icon from '../icon'
import { EyeIcon, EyeOff } from 'lucide-react'
import { cn } from '@/lib/utils'

interface inputComponentProps {
    type?: string,
    placeholder?: string,
    wrapperclassName?: string,
    error?: string,
    leftIcon?: React.ReactNode,
    rightIcon?: React.ReactNode,
    togglePassword?: boolean,
    value: string,
    onChange: (value: string) => void
    disable?: boolean
}

const InputComponent = React.forwardRef<HTMLInputElement, inputComponentProps>(
    ({
        type = 'text',
        placeholder,
        wrapperclassName,
        leftIcon,
        rightIcon,
        error,
        togglePassword = false,
        value,
        onChange,
        disable = false,
        ...props
    }, ref
    ) => {

        const [showPassword, setShowPassword] = useState(true)

        const isPasswordType = type === 'password' && togglePassword

        return (
            <div className='flex flex-col gap-1'>
                <div
                    className={cn(

                        "w-full flex items-center gap-2 bg-transparent px-3 py-2 transition-all duration-200",

                        "border-2 border-border rounded-md",

                        "focus-within:border-transparent focus-within:border-b-primary focus-within:border-b-2 focus-within:ring-0 focus-within:rounded-none",

                        disable && "opacity-50 cursor-not-allowed",

                        wrapperclassName
                    )}
                >
                    {leftIcon && (
                        <span className="flex justify-center items-center shrink-0 text-primary">
                            {leftIcon}
                        </span>
                    )}

                    <input
                        ref={ref}
                        type={showPassword && isPasswordType ? 'password' : 'text'}
                        placeholder={placeholder}
                        autoComplete='off'
                        className="
        w-full text-sm bg-transparent outline-none
        placeholder:text-slate-400
      "
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={disable}
                        {...props}
                    />

                    {isPasswordType ? (
                        <button
                            type="button"
                            onClick={() => setShowPassword((pre) => !pre)}
                            className="shrink-0 flex items-center justify-center"
                            aria-label={showPassword ? "Show password" : "Hide password"}
                        >
                            {showPassword ? (
                                <EyeIcon className="h-4 w-4 text-primary" />
                            ) : (
                                <EyeOff className="h-4 w-4 text-primary" />
                            )}
                        </button>
                    ) : (
                        rightIcon && (
                            <span className="flex justify-center items-center shrink-0 text-primary">
                                {rightIcon}
                            </span>
                        )
                    )}
                </div>

                <div className="h-3 flex gap-1 items-center pl-2">
                    {error && <Icon name="X" width={12} height={12} stroke="red" />}
                    <small className={`text-red-500 ${error ? 'opacity-100' : 'opacity-0'}`}>
                        {error}
                    </small>
                </div>
            </div>
        )
    }
)

export default InputComponent