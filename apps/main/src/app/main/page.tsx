"use client";

import { MapView } from "@/features";

export default function MainPage() {
    return (
        /* 화면 전체를 채우는 메인 컨테이너 */
        <div className="relative h-[calc(100vh-64px)] w-full overflow-hidden bg-stone-100">
            {/* 맨 하단 메인 레이어 (w-full, h-full) */}
            <div className="h-full w-full bg-stone-50 p-5">
                <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-stone-300 text-stone-400">
                    <MapView />
                </div>
            </div>
        </div>
    );
}