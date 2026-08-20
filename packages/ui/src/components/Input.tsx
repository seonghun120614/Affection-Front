"use client";

import { InputHTMLAttributes } from "react";

type InputStatus = 'default' | 'error' | 'disabled';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    children?: string;
    status?: InputStatus;
    disabled?: boolean;
    className?: string;
    message?: string;
    validation?: (data: string) => boolean;
}

const inputStyles: Record<InputStatus, string> = {
  default: "border-border-subtle focus:border-autumn-rust hover:border-autumn-ochre focus:bg-white",
  error: "border-red-400 focus:border-red-400 focus:bg-white",
  disabled: "border-stone-200 bg-stone-100 placeholder:text-stone-300 cursor-not-allowed focus:bg-white",
};

const textStyles: Record<InputStatus, string> = {
    default: "",
    error: "text-red-400",
    disabled: "text-stone-400"
}

export function Input({
    children = "",
    status = "default",
    disabled = false,
    className = "",
    ...props
}: InputProps) {
    const isDisabled = disabled || status === "disabled";
    const currentStatus = isDisabled ? "disabled" : status;

    return (
        <div className='h-full w-full'>
            <input
                type="text"
                disabled={isDisabled}
                className={`w-full rounded-md border px-3 py-2 outline-none transition-colors ${inputStyles[currentStatus]} ${textStyles[currentStatus]} ${className}`}
                {...props}
            />
        </div>
    )
}