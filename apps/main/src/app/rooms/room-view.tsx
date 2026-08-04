"use client";

import dynamic from "next/dynamic";
import PersonPanel from "./person-panel";
import { ChatPanel } from "./chat-panel";
import { useEffect, useState, useCallback } from "react";
import { DirectRoomRequest, chatroom, } from "@/lib/chatroom-api";
import { relation, ConnectRequest, RelationshipResponse } from "@/lib/relation-api";

const MapView = dynamic(() => import("./map-view"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-zinc-100">
      <span className="text-sm text-zinc-500">지도를 불러오는 중…</span>
    </div>
  ),
});

// cid === null 이면 전체 채팅(global).
// 서버는 /api/chat 에 roomId 파라미터가 없으면 SessionRegistry.global 로 붙인다.
// 즉 global 은 DB 상의 방이 아니라 "roomId 없음" 상태 그 자체다.
export interface ActiveRoom {
  cid: number | null;
  title: string;
}

export const GLOBAL_ROOM: ActiveRoom = { cid: null, title: "전체 채팅" };

export function RoomView() {
  const [people, setPeople] = useState<RelationshipResponse[]>([]);
  const [activeRoom, setActiveRoom] = useState<ActiveRoom>(GLOBAL_ROOM);

  const fetchPeople = useCallback(async () => {
    try {
      const list = await relation.getRelationships();
      setPeople(list);
    } catch (e) {
      console.error("사람 목록 조회 실패:", e);
    }
  }, []);

  useEffect(() => {
    fetchPeople();
  }, [fetchPeople]);

  const openDirectChat = useCallback(async (person: RelationshipResponse) => {
    try {
      const req: DirectRoomRequest = {
        targetUid: person.uid
      }
      const room = await chatroom.getOrCreateDirect(req);
      setActiveRoom({ cid: room.cid, title: person.username });
    } catch (e) {
      console.error("채팅방 열기 실패:", e);
    }
  }, []);

  const backToGlobal = useCallback(() => setActiveRoom(GLOBAL_ROOM), []);

  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden">
      <div className="absolute inset-0 z-0">
        <MapView />
      </div>

      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 flex items-stretch gap-3 p-5">
        <div className="pointer-events-auto">
          <ChatPanel activeRoom={activeRoom} onBackToGlobal={backToGlobal} />
        </div>
        <div className="pointer-events-auto">
          <PersonPanel
            people={people}
            onSelect={openDirectChat}
            onPersonAdded={fetchPeople}
          />
        </div>
      </div>
    </div>
  );
}