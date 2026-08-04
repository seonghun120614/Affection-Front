"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  type: "CHAT" | "SYSTEM";
  senderId: string | null;
  sender: string | null;
  content: string;
  sentAt: string;
}

export type Status = "connecting" | "open" | "closed";

const WS_URL =
  process.env.NEXT_PUBLIC_WS_URL ?? "ws://localhost:8080/api/chat";

const MAX_RETRY_DELAY = 15000;

function detachAndClose(socket: WebSocket | null) {
  if (!socket) return;
  socket.onopen = null;
  socket.onclose = null;
  socket.onerror = null;
  socket.onmessage = null;
  socket.close();
}

export function useChatSocket(cid: number | null, enabled = true) {
  const socketRef = useRef<WebSocket | null>(null);
  const retryRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<Status>(enabled ? "connecting" : "closed");

  useEffect(() => {
    // 이전 방의 소켓/타이머는 이 effect의 cleanup이 이미 정리했다.
    retryRef.current = 0;
    setMessages([]);

    if (!enabled) {
      setStatus("closed");
      return;
    }

    let disposed = false;

    const connect = () => {
      if (disposed) return;

      setStatus("connecting");
      const url = cid == null ? WS_URL : `${WS_URL}?cid=${cid}`;
      const socket = new WebSocket(url);
      socketRef.current = socket;

      socket.onopen = () => {
        retryRef.current = 0;
        setStatus("open");
      };

      socket.onclose = () => {
        if (disposed) return;
        setStatus("closed");
        // 지수 백오프 재연결
        const delay = Math.min(1000 * 2 ** retryRef.current, MAX_RETRY_DELAY);
        retryRef.current += 1;
        timerRef.current = setTimeout(connect, delay);
      };

      socket.onerror = () => {
        // onclose가 뒤따라 발화하므로 여기서 재연결을 걸지 않는다
      };

      socket.onmessage = (event) => {
        try {
          const p = JSON.parse(event.data);
          setMessages((prev) => [
            ...prev,
            {
              id: p.id != null ? `live-${p.id}` : `live-${crypto.randomUUID()}`,
              type: p.type,
              senderId: p.senderId ?? null,
              sender: p.sender ?? null,
              content: p.content,
              sentAt: p.sentAt,
            },
          ]);
        } catch {
          console.warn("파싱 불가한 웹소켓 메시지:", event.data);
        }
      };
    };

    connect();

    return () => {
      disposed = true;
      if (timerRef.current) clearTimeout(timerRef.current);
      detachAndClose(socketRef.current);
      socketRef.current = null;
    };
  }, [cid, enabled]);

  const send = useCallback((content: string) => {
    const socket = socketRef.current;
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("웹소켓이 연결되지 않아 메시지를 전송할 수 없습니다.");
      return false;
    }
    socket.send(JSON.stringify({ content }));
    return true;
  }, []);

  return { messages, status, send };
}