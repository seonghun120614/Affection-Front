"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";

type ModalKind = "finding" | "borrow";

const ModalContext = createContext<{
    openFindingModal: () => void;
    openBorrowModal: () => void;
}>({
    openFindingModal: () => {},
    openBorrowModal: () => {},
});

/** 트리거 쪽(헤더 버튼 등)에서 모달을 열 때 사용 */
export function useModal() {
    return useContext(ModalContext);
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
    const [modal, setModal] = useState<ModalKind | null>(null);
    const value = useMemo(
        () => ({
            openFindingModal: () => setModal("finding"),
            openBorrowModal: () => setModal("borrow"),
        }),
        [],
    );
    const close = () => setModal(null);

    return (
        <ModalContext.Provider value={value}>
            {children}
            {/* modal은 클라이언트 상호작용으로만 설정되므로 document 접근이 안전하다 */}
            {modal &&
                createPortal(
                    modal === "finding" ? (
                        <FindingModal open onClose={close} />
                    ) : (
                        <BorrowModal open onClose={close} />
                    ),
                    document.body,
                )}
        </ModalContext.Provider>
    );
}
