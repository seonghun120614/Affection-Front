"use client";

import { useState } from "react";
import { borrow } from "@/lib/borrow-api";

interface BorrowModalProps {
    open: boolean;
    onClose: () => void;
}

/**
 * 빌려주세요 (대여 등록) — POST /register
 * 백엔드 RegisterRequest: gid(양수)
 */
export default function BorrowModal({ open, onClose }: BorrowModalProps) {
    const [gid, setGid] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!open) return null;

    const reset = () => {
        setGid("");
        setError(null);
        setLoading(false);
    };
    const handleClose = () => {
        reset();
        onClose();
    };

    const handleSubmit = async () => {
        // 백엔드 검증(@NotNull, 양수)과 동일한 규칙. 빈 값이거나 0 이하면 호출하지 않는다.
        const gidNum = Number(gid);
        if (!gid.trim() || !Number.isInteger(gidNum) || gidNum <= 0) {
            setError("대상 ID는 양의 정수여야 해요");
            return;
        }

        setLoading(true);
        setError(null);
        try {
            await borrow.borrow(gidNum);
            handleClose();
        } catch (e) {
            setError(e instanceof Error ? e.message : "등록에 실패했어요");
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="w-[360px] rounded-2xl bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-zinc-800">
                        빌려주세요
                    </h2>
                    <button
                        onClick={handleClose}
                        className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
                        aria-label="닫기"
                    >
                        <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                d="M18 6 6 18M6 6l12 12"
                                strokeLinecap="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                        <label
                            htmlFor="borrow-gid"
                            className="text-xs font-medium text-zinc-500"
                        >
                            대상 ID
                        </label>
                        <input
                            id="borrow-gid"
                            type="number"
                            min={1}
                            value={gid}
                            onChange={(e) => setGid(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && handleSubmit()
                            }
                            placeholder="빌릴 물건의 ID"
                            autoFocus
                            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="mt-4 w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
                >
                    {loading ? "등록 중…" : "등록하기"}
                </button>
            </div>
        </div>
    );
}
