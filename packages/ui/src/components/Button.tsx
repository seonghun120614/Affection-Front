"use client";

import { ButtonHTMLAttributes, ReactNode, useEffect, useState } from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { useCooldown } from "@affection/hooks";

type ButtonStatus = "default" | "error" | "loading" | "coolingdown" | "disabled";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    status?: ButtonStatus;
    children?: ReactNode;
    cooldownTime?: number;
    text?: string;
    setStatus?: (status: ButtonStatus) => void;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onCooldownEnd?: (data: boolean) => void;
}

const variants: Record<ButtonStatus, string> = {
    default: "bg-autumn-rust text-white shadow-sm hover:bg-autumn-terracotta hover:shadow-md focus:ring-2 focus:ring-autumn-ochre focus:ring-offset-2 active:scale-[0.98]",
    error: "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300 focus:ring-2 focus:ring-red-400 focus:ring-offset-2 active:scale-[0.98]",
    loading: "bg-autumn-ochre text-autumn-night font-medium shadow-inner opacity-90 cursor-wait",
    coolingdown: "bg-autumn-slate/10 text-autumn-slate border border-autumn-slate border-dashed cursor-wait opacity-80",
    disabled: "bg-stone-100 text-stone-400 border border-stone-200 cursor-not-allowed",
};

export function Button({
    status = "default",
    children,
    text,
    cooldownTime = 60,
    setStatus,
    className = "",
    disabled,
    onClick,
    onCooldownEnd,
    ...props
}: ButtonProps) {
    const { cooldown, start, isActive } = useCooldown();
    const [hasStartedCooldown, setHasStartedCooldown] = useState(false);

    // 쿨다운 시작
    useEffect(() => {
        if (status === "coolingdown" && !isActive && !hasStartedCooldown) {
            start(cooldownTime);
            setHasStartedCooldown(true);
        }
    }, [status, isActive, hasStartedCooldown, start, cooldownTime]);

    // 쿨다운 종료 시 처리
    useEffect(() => {
        if (status === "coolingdown" && hasStartedCooldown && cooldown === 0 && !isActive) {
            setHasStartedCooldown(false);
            onCooldownEnd?.(true); // ✅ 2. 타이머 끝난 후 부모(Form)에 콜백 전달
            if (setStatus) {
                setStatus("default");
            }
        }
    }, [cooldown, status, hasStartedCooldown, setStatus, onCooldownEnd, isActive]);

    // ✅ 3. status가 'coolingdown'이 아니게 되었을 때(인증 완료 등) 플래그 리셋
    useEffect(() => {
        if (status !== "coolingdown" && hasStartedCooldown) {
            setHasStartedCooldown(false);
        }
    }, [status, hasStartedCooldown]);

    const isInteractiveDisabled = disabled || status === "disabled" || status === "loading" || status === "coolingdown";

    return (
        <div className="h-full w-full">
            <button
                type="button"
                disabled={isInteractiveDisabled}
                onClick={onClick}
                className={`inline-flex h-full w-full whitespace-nowrap items-center justify-center rounded-md px-4 text-sm font-medium transition-all duration-200 outline-none ${variants[status]} ${className}`}
                {...props}
            >
                {status === "loading" && (
                    <LoadingSpinner size={18} color="text-autumn-night" />
                )}
                {status === "coolingdown" ? (
                    <span>{cooldown}s</span>
                ) : (
                    <span>{children || text}</span>
                )}
            </button>
        </div>
    );
}