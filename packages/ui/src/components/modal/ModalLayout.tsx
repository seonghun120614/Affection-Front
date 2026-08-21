"use client";

import React, { useEffect } from "react";

export interface ModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
}

export function ModalLayout({ isOpen, onClose, title, children }: ModalLayoutProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        /* fixed -> absolute 로 변경하여 Header/Footer 제외 중앙 메인 영역에만 반투명 커버 적용 */
        <div 
            onClick={onClose}
            className="absolute inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex w-full max-w-md flex-col gap-4 rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
            >
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    {title ? (
                        <h3 className="text-base font-bold text-stone-900">{title}</h3>
                    ) : <div />}
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition"
                    >
                        ✕
                    </button>
                </div>

                <div>{children}</div>
            </div>
        </div>
    );
}