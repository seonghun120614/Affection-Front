"use client";

import { useState } from "react";
import { relation, ConnectRequest } from "@/lib/relation-api";

interface AddPersonModalProps {
  open: boolean;
  onClose: () => void;
  onAdded?: () => void;
}

const RELATIONS: {
  value: string;
  label: string;
  desc: string
}[] = [
  { value: "acquaintance", label: "지인", desc: "얼굴만 아는 사이" },
  { value: "casual", label: "가까운 사람", desc: "종종 연락하는 사이" },
  { value: "friend", label: "친구", desc: "가까운 친구" },
];

export default function AddPersonModal({ open, onClose, onAdded }: AddPersonModalProps) {
  const [relationType, setRelationType] = useState<string>("acquaintance");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => { setValue(""); setError(null); setLoading(false); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!value.trim()) {
      setError("전화번호 또는 이름을 입력해주세요");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const req: ConnectRequest = {
        type: relationType,
        other: value.trim()
      };
      await relation.connect(req);
      onAdded?.();
      handleClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "추가에 실패했어요");
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
          <h2 className="text-base font-semibold text-zinc-800">사람 추가</h2>
          <button
            onClick={handleClose}
            className="rounded-full p-1 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-600"
            aria-label="닫기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* 관계 선택 */}
        <div className="mb-4 space-y-2">
          <p className="text-xs font-medium text-zinc-500">관계</p>
          <div className="grid grid-cols-3 gap-2">
            {RELATIONS.map((r) => (
              <button
                key={r.value}
                onClick={() => setRelationType(r.value)}
                className={`flex flex-col items-center gap-0.5 rounded-xl border px-2 py-2.5 text-center transition ${
                  relationType === r.value
                    ? "border-indigo-400 bg-indigo-50 text-indigo-600"
                    : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
                }`}
              >
                <span className="text-xs font-semibold">{r.label}</span>
                <span className="text-[9px] leading-tight text-zinc-400">{r.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 전화번호 또는 이름 입력 */}
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="전화번호 또는 이름"
          autoFocus
          className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
        />

        {error && <p className="mt-2 text-xs text-rose-500">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 w-full rounded-lg bg-indigo-500 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-50"
        >
          {loading ? "추가 중…" : "추가하기"}
        </button>
      </div>
    </div>
  );
}