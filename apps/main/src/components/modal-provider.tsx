"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import FindingModal from "@/components/finding-modal";
import BorrowModal from "@/components/borrow-modal";

type ModalKind = "finding" | "borrow";

/**
 * 전역 모달(분실물 신고, 대여 등록)의 열림 상태를 트리거(헤더)와 분리해 관리한다.
 *
 * 헤더는 backdrop-filter 때문에 fixed 요소의 기준(containing block)이 되어버려서,
 * 모달을 헤더 안에서 렌더링하면 화면 중앙이 아닌 헤더 기준으로 배치된다.
 * 그래서 Portal로 <body> 바로 아래에 렌더링해 뷰포트 정중앙을 보장한다.
 */
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
