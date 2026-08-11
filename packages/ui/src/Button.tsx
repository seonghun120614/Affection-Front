import React, { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    isLoading?: boolean;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    children: ReactNode;
}

export function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    leftIcon,
    rightIcon,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-flex items-center justify-center font-medium transition-all duration-200 ease-in-out rounded-lg focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    
    // CSS 변수 기반 기본 Variant 스타일 정의 (필요시 className으로 덮어쓰기 가능)
    const variants = {
        primary: "bg-[var(--chocolate)] text-white hover:bg-[var(--chocolate-hover)] active:scale-[0.98] shadow-sm",
        secondary: "bg-[var(--chocolate-light)] text-[var(--text-main)] hover:bg-[var(--border-subtle)] active:scale-[0.98]",
        outline: "border border-[var(--border-subtle)] text-[var(--text-main)] hover:bg-[var(--chocolate-light)] active:scale-[0.98]",
        ghost: "text-[var(--text-main)] hover:bg-[var(--chocolate-light)] active:scale-[0.98]",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-xs gap-1.5",
        md: "px-4 py-2.5 text-sm gap-2",
        lg: "px-5 py-3 text-base gap-2.5",
    };

    return (
        <button
            /* className을 맨 뒤에 배치하여 외부에서 전달한 커스텀 스타일이 기본 스타일을 유연하게 덮어쓸 수 있도록 수정 */
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
            ) : (
                leftIcon && <span className="shrink-0">{leftIcon}</span>
            )}
            
            <span>{children}</span>
            
            {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </button>
    );
}