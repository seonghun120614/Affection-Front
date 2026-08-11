import React, { InputHTMLAttributes, ReactNode } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    rightElement?: ReactNode;
    containerClassName?: string;
}

export function InputField({
    label,
    error,
    rightElement,
    id,
    className,
    containerClassName = "",
    ...props
}: InputFieldProps) {
    const inputId = id || label;

    // Button 컴포넌트처럼 상태별 스타일(variants)을 객체로 분리하여 관리
    const inputVariants = {
        default: "border-[var(--color-border-subtle)] hover:border-[var(--color-golden-honey)] focus:border-[var(--color-mustard-gold)] focus:bg-white focus:ring-4 focus:ring-[var(--color-mustard-gold)]/15",
        error: "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-500/10",
    };

    const currentVariant = error ? inputVariants.error : inputVariants.default;

    return (
        <div className={`flex w-full flex-col gap-1.5 text-left animate-expand ${containerClassName}`}>
            {/* 레이블 */}
            <label
                htmlFor={inputId}
                className="text-xs font-semibold tracking-wide text-[var(--color-text-muted)] transition-colors"
            >
                {label}
            </label>

            {/* 인풋 및 우측 요소 래퍼 */}
            <div className="relative flex items-center gap-2">
                <input
                    id={inputId}
                    className={`w-full rounded-xl border bg-stone-50/40 px-4 py-3 text-sm text-[var(--color-text-main)] placeholder:text-stone-400 outline-none transition-all duration-300 ease-in-out ${currentVariant} ${className || ""}`}
                    {...props}
                />

                {rightElement && (
                    <div className="shrink-0 flex items-center h-full">
                        {rightElement}
                    </div>
                )}
            </div>

            {/* 에러 메시지 */}
            {error && (
                <p className="text-xs font-medium text-red-600 animate-fadeIn transition-all duration-200">
                    {error}
                </p>
            )}
        </div>
    );
}