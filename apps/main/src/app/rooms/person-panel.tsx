"use client";

import Image from "next/image";
import { useState } from "react";
import AddPersonModal from "./add-person-modal";
import { PersonaResponse } from "@/lib/persona-api";

interface PersonPanelProps {
  people: PersonaResponse[];
  onSelect?: (person: PersonaResponse) => void;
  onPersonAdded?: () => void; // 추가 성공 시 목록 새로고침
}

// uid 기반으로 일관된 그라데이션을 골라 아바타마다 색이 달라지되, 같은 uid는 항상 같은 색
const GRADIENTS = [
  "from-violet-400 to-indigo-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
];

function gradientOf(uid: string) {
  let hash = 0;
  for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) | 0;
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

export default function PersonPanel({ people, onSelect, onPersonAdded }: PersonPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <aside className="flex h-full w-24 shrink-0 flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/80 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-center gap-1 border-b border-zinc-100 px-2 py-3">
          <span className="text-xs font-semibold tracking-wide text-zinc-600">사람들</span>
          <span className="text-[10px] text-zinc-400">{people.length}</span>
          <button
            onClick={() => setModalOpen(true)}
            className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-100 text-indigo-500 transition hover:bg-indigo-500 hover:text-white"
            aria-label="사람 추가"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <ul className="scrollbar-hide flex-1 space-y-1 overflow-y-auto px-2 py-3">
          {people.length === 0 && (
            <li className="py-6 text-center text-[11px] leading-relaxed text-zinc-400">
              아직 아는
              <br />
              사람이 없어요
            </li>
          )}
          {people.map((person) => (
            <li key={person.uid}>
              <button
                type="button"
                onClick={() => onSelect?.(person)}
                className="group flex w-full flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition-colors hover:bg-indigo-50/80 active:bg-indigo-100"
              >
                <div className="relative transition-transform duration-150 group-hover:scale-105">
                  <PersonAvatar person={person} />
                  {/* 온라인 표시 자리 — 접속 상태 연동 시 조건부 렌더 */}
                  {/* <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-emerald-400" /> */}
                </div>
                <span className="w-full truncate text-center text-[11px] font-medium text-zinc-700 group-hover:text-indigo-600">
                  {person.username}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </aside>

      <AddPersonModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdded={onPersonAdded}
      />
    </>
  );
}

function PersonAvatar({ person }: { person: Person }) {
  if (person.imgUrl) {
    return (
      <Image
        src={person.imgUrl}
        alt={person.username}
        width={48}
        height={48}
        className="h-12 w-12 rounded-full object-cover ring-2 ring-white shadow-sm"
      />
    );
  }
  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradientOf(
        person.uid
      )} text-sm font-bold text-white shadow-sm ring-2 ring-white`}
    >
      {person.username.charAt(0)}
    </div>
  );
}