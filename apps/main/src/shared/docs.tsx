"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface DocsProps {
    /** 문서 제목 (예: 이용약관, 개인정보처리방침) */
    title: string;
    /** 부제목 또는 간단한 설명 */
    subtitle?: string;
    /** 최종 수정/시행 일자 */
    updatedAt?: string;
    /** 문서 본문 내용 (HTML/JSX 형태) */
    content: React.ReactNode;
    /** 계약/동의 체크박스 및 동의 버튼 표시 여부 */
    isContract?: boolean;
    /** 체크박스 상태 변경 콜백 */
    onAgreeChange?: (agreed: boolean) => void;
    /** 동의 후 확인 버튼 클릭 콜백 */
    onSubmitContract?: () => void;
}

export function Docs({
    title,
    subtitle,
    updatedAt,
    content,
    isContract = false,
    onAgreeChange,
    onSubmitContract,
}: DocsProps) {
    const [isAgreed, setIsAgreed] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsAgreed(checked);
        onAgreeChange?.(checked);
    };

    return (
        <div className="flex min-h-[calc(100vh-140px)] w-full items-center justify-center px-4 py-8 sm:px-6">
            <div className="flex w-full max-w-3xl flex-col gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 md:p-10 shadow-xl shadow-stone-200/40">
                
                {/* 상단 헤더 */}
                <div className="flex flex-col gap-1 border-b border-stone-100 pb-4">
                    <div className="flex items-center justify-between gap-4">
                        <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
                            {title}
                        </h1>
                        {updatedAt && (
                            <span className="text-xs text-stone-400">
                                시행일: {updatedAt}
                            </span>
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs sm:text-sm text-stone-500">
                            {subtitle}
                        </p>
                    )}
                </div>

                {/* Readonly 약관 본문 영역 */}
                <div className="max-h-[50vh] overflow-y-auto rounded-2xl border border-stone-200/70 bg-stone-50/60 p-5 sm:p-6 text-xs sm:text-sm leading-relaxed text-stone-700 font-sans shadow-inner">
                    {content}
                </div>

                {/* 계약 동의 모드 (isContract = true) */}
                {isContract && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-4 border-t border-stone-100 pt-4"
                    >
                        <label className="group flex cursor-pointer select-none items-center gap-3">
                            <input
                                type="checkbox"
                                checked={isAgreed}
                                onChange={handleCheckboxChange}
                                className="h-4 w-4 cursor-pointer rounded border-stone-300 accent-autumn-rust focus:ring-autumn-rust/50"
                            />
                            <span className="text-xs sm:text-sm font-medium text-stone-800 transition group-hover:text-stone-900">
                                [필수] 위 약관 내용을 충분히 확인하였으며 이에 동의합니다.
                            </span>
                        </label>

                        {onSubmitContract && (
                            <button
                                disabled={!isAgreed}
                                onClick={onSubmitContract}
                                className={`w-full rounded-xl py-3 text-xs sm:text-sm font-semibold transition duration-200 ${
                                    isAgreed
                                        ? "bg-autumn-rust text-white hover:bg-autumn-rust/90 shadow-md shadow-autumn-rust/20 active:scale-[0.99]"
                                        : "bg-stone-200 text-stone-400 cursor-not-allowed"
                                }`}
                            >
                                동의하고 계속하기
                            </button>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
}