"use client";

import { useState } from "react";
import { finding, CreateFindingRequest, CreateFoundingRequest } from "@/lib/finding-api";

interface FindingModalProps {
  open: boolean;
  onClose: () => void;
}

type Mode = "find" | "found";

/**
 * 분실/습득 신고 모달.
 * 라디오 선택에 따라 찾아주세요 → POST /api/findings/find,
 * 찾았어요 → POST /api/findings/found 로 분기한다.
 */
export default function FindingModal({ open, onClose }: FindingModalProps) {
  const [mode, setMode] = useState<Mode>("find");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [affection, setAffection] = useState(50);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const reset = () => {
    setMode("find");
    setTitle("");
    setDesc("");
    setAffection(50);
    setImg("");
    setError(null);
    setLoading(false);
  };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError("제목을 입력해주세요");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      if (mode === "find") {
        const req: CreateFindingRequest = { 
          title: title.trim(), 
          desc: desc.trim(), 
          affection: affection
        };
        await finding.createFinding(req);
      } else {
        const req: CreateFoundingRequest = {
          title: title.trim(),
          img: img.trim(),
          desc: desc.trim()
        }
        await finding.createFounding(req);
      }
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
          <h2 className="text-base font-semibold text-zinc-800">분실물 신고</h2>
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

        {/* 신고 종류 (라디오) */}
        <fieldset className="mb-4">
          <legend className="mb-2 text-xs font-medium text-zinc-500">신고 종류</legend>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="radio"
                name="mode"
                value="find"
                checked={mode === "find"}
                onChange={() => setMode("find")}
                className="accent-indigo-500"
              />
              찾아주세요 (분실)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="radio"
                name="mode"
                value="found"
                checked={mode === "found"}
                onChange={() => setMode("found")}
                className="accent-indigo-500"
              />
              찾았어요 (습득)
            </label>
          </div>
        </fieldset>

        <div className="space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={mode === "find" ? "무엇을 잃어버렸나요?" : "무엇을 찾았나요?"}
            autoFocus
            className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {mode === "found" && (
            <input
              type="text"
              value={img}
              onChange={(e) => setImg(e.target.value)}
              placeholder="이미지 URL"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
            />
          )}
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder={mode === "find" ? "설명 (잃어버린 장소, 생김새 등)" : "설명 (발견한 장소 등)"}
            rows={3}
            className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
          />
          {mode === "find" && (
            <div>
              <div className="mb-1 flex items-center justify-between">
                <p className="text-xs font-medium text-zinc-500">애정도</p>
                <span className="text-xs font-semibold text-indigo-600">{affection}</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={affection}
                onChange={(e) => setAffection(Number(e.target.value))}
                className="w-full accent-indigo-500"
              />
            </div>
          )}
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
