"use client";

import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { message } from "@/lib/message-api";
import { useChatSocket, type ChatMessage } from "@/lib/use-chat-socket";
import type { ActiveRoom } from "../../../main/src/app/rooms/room-view";

const timeFormatter = new Intl.DateTimeFormat("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
});

const STATUS_LABEL = {
    connecting: { text: "연결 중", dot: "bg-amber-500" },
    open: { text: "연결됨", dot: "bg-emerald-500" },
    closed: { text: "연결 끊김", dot: "bg-red-500" },
} as const;

function formatTime(iso: string) {
    return timeFormatter.format(new Date(iso));
}

interface ChatPanelProps {
    activeRoom: ActiveRoom;
    onBackToGlobal?: () => void;
}

export function ChatPanel({ activeRoom, onBackToGlobal }: ChatPanelProps) {
    const cid = activeRoom.cid;
    const isGlobal = cid == null;

    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [draft, setDraft] = useState("");

    const scrollRef = useRef<HTMLDivElement>(null);
    const forceScrollRef = useRef(false);
    const [me, setMe] = useState<string | null>(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        setMe(sessionStorage.getItem("uid"));
        setReady(true);
    }, []);

    const {
        messages: liveMessages,
        status,
        send,
    } = useChatSocket(cid, ready && me != null);

    // 이전 메시지 로드.
    // global 채팅은 서버가 DB에 저장하지 않으므로(cid가 없어 save 호출 자체를 건너뜀)
    // 불러올 이력이 없다.
    useEffect(() => {
        if (cid == null) {
            setHistory([]);
            return;
        }
        let cancelled = false;
        message
            .getMessages(cid)
            .then((msgs) => {
                if (cancelled) return;
                const normalized: ChatMessage[] = msgs
                    .slice()
                    .reverse() // 최신순 응답 → 오래된 순으로
                    .map((m) => ({
                        id: `hist-${m.mid}`,
                        type: "CHAT" as const,
                        senderId: m.uid,
                        sender: m.username,
                        content: m.message,
                        sentAt: m.createdAt,
                    }));
                setHistory(normalized);
            })
            .catch((e) => console.error("이전 메시지 로드 실패:", e));
        return () => {
            cancelled = true;
        };
    }, [cid]);

    const allMessages: ChatMessage[] = [...history, ...liveMessages];

    const isFirstRender = useRef(true);

    useEffect(() => {
        isFirstRender.current = true;
    }, [cid]);

    useLayoutEffect(() => {
        const el = scrollRef.current;
        if (!el) return;

        const distanceFromBottom =
            el.scrollHeight - el.scrollTop - el.clientHeight;
        const shouldStick =
            isFirstRender.current ||
            forceScrollRef.current ||
            distanceFromBottom < 120;

        if (shouldStick) {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: isFirstRender.current ? "auto" : "smooth",
            });
        }
        isFirstRender.current = false;
        forceScrollRef.current = false;
    }, [allMessages.length]);

    function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault();
        const trimmed = draft.trim();
        if (!trimmed) return;
        if (send(trimmed)) {
            setDraft("");
            forceScrollRef.current = true; // 내가 보냈으니 무조건 내려가기
        }
    }

    const label = STATUS_LABEL[status];

    return (
        <aside className="pointer-events-auto flex h-full w-96 flex-col overflow-hidden rounded-2xl border border-white/40 bg-white/70 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl">
            <header className="flex items-center justify-between border-b border-white/50 px-5 py-4">
                <div className="flex min-w-0 items-center gap-2">
                    {!isGlobal && onBackToGlobal && (
                        <button
                            type="button"
                            onClick={onBackToGlobal}
                            className="shrink-0 rounded px-1 text-sm text-zinc-500 transition hover:text-zinc-900"
                            aria-label="전체 채팅으로"
                        >
                            ←
                        </button>
                    )}
                    <h2 className="truncate text-sm font-semibold tracking-tight text-zinc-900">
                        {activeRoom.title}
                    </h2>
                </div>
                <span className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-600">
                    <span className={`size-1.5 rounded-full ${label.dot}`} />
                    {label.text}
                </span>
            </header>

            <div
                ref={scrollRef}
                className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden px-5 py-4"
            >
                <div className="mt-auto space-y-3">
                    {allMessages.length === 0 && (
                        <p className="pt-8 text-center text-sm text-zinc-500">
                            {status === "open"
                                ? isGlobal
                                    ? "전체 채팅에 입장했어요. 첫 메시지를 남겨보세요."
                                    : "아직 메시지가 없어요."
                                : status === "connecting"
                                  ? "연결하는 중…"
                                  : "연결이 끊겼어요. 새로고침해주세요."}
                        </p>
                    )}

                    {allMessages.map((m) => {
                        if (m.type === "SYSTEM") {
                            return (
                                <p
                                    key={m.id}
                                    className="py-1.5 text-center text-xs text-zinc-500"
                                >
                                    {m.content}
                                </p>
                            );
                        }

                        const isMine = m.senderId != null && m.senderId === me;

                        return (
                            <div
                                key={m.id}
                                className={`flex min-w-0 flex-col gap-1 ${isMine ? "items-end" : "items-start"}`}
                            >
                                {!isMine && (
                                    <span className="px-1 text-xs font-medium text-zinc-500">
                                        {m.sender}
                                    </span>
                                )}
                                <div
                                    className={`flex max-w-[85%] items-end gap-1.5 ${
                                        isMine ? "flex-row-reverse" : "flex-row"
                                    }`}
                                >
                                    <p
                                        className={`min-w-0 break-words rounded-2xl px-3 py-2 text-sm leading-relaxed shadow-sm ${
                                            isMine
                                                ? "rounded-br-sm bg-indigo-600 text-white"
                                                : "rounded-bl-sm bg-white/85 text-zinc-800"
                                        }`}
                                    >
                                        {m.content}
                                    </p>
                                    <time
                                        dateTime={m.sentAt}
                                        className="shrink-0 pb-0.5 text-[10px] tabular-nums text-zinc-500"
                                    >
                                        {formatTime(m.sentAt)}
                                    </time>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 border-t border-white/50 px-4 py-3"
            >
                <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder={
                        status === "open"
                            ? "메시지 입력…"
                            : "연결을 기다리는 중…"
                    }
                    disabled={status !== "open"}
                    className="min-w-0 flex-1 rounded-lg border border-zinc-300/70 bg-white/80 px-3 py-2 text-sm text-zinc-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60"
                />
                <button
                    type="submit"
                    disabled={status !== "open" || !draft.trim()}
                    className="shrink-0 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    전송
                </button>
            </form>
        </aside>
    );
}
