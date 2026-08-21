"use client";

import { useState, useCallback, ReactNode } from "react";
import { ModalContext } from "./use-modal";

export function ModalProvider({ children }: { children: ReactNode }) {
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);

    const openModal = useCallback((content: ReactNode) => {
        setModalContent(content);
    }, []);

    const closeModal = useCallback(() => {
        setModalContent(null);
    }, []);

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            {/* 전역 오버레이 레이아웃 */}
            {modalContent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
                    <div 
                        className="relative w-full max-w-md rounded-3xl border border-stone-200/80 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {modalContent}
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}