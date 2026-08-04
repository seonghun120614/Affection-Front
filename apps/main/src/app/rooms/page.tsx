import type { Metadata } from "next";
import { RoomView } from "./room-view";

export const metadata: Metadata = {
  title: "채팅방",
  description: "지도 위에서 대화하세요.",
};

export default function RoomsPage() {
  return <RoomView />;
}