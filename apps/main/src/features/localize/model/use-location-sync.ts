"use client";

import { useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { useGeolocation } from "./use-geolocation";

const LOCATION_SYNC_INTERVAL_MS = 60_000;

interface UpdateLocalRequest {
    longitude: number;
    latitude: number;
}

// 1. 위치 전송 API 함수
async function sendLocation({
    longitude,
    latitude,
}: UpdateLocalRequest): Promise<void> {
    const res = await fetch("/api/localize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ longitude, latitude }),
    });

    if (!res.ok) {
        throw new Error(`Location sync failed: ${res.status}`);
    }
}

export function useLocationSync(enabled: boolean) {
    const { position, loading, error } = useGeolocation();

    // 2. TanStack Query Mutation 정의
    const { mutate: syncLocation, isPending: isSyncing } = useMutation({
        mutationFn: sendLocation,
        onError: (err) => {
            console.error("Location sync error:", err);
        },
    });

    // Stale Closure 방지용 Ref
    const positionRef = useRef(position);
    useEffect(() => {
        positionRef.current = position;
    }, [position]);

    // 3. 주기적 동기화 트리거
    useEffect(() => {
        if (!enabled) return;

        const handleSync = () => {
            // 위치 정보를 아직 얻지 못했거나 지오로케이션 에러 시 스킵
            if (loading || error) return;

            const [latitude, longitude] = positionRef.current;
            syncLocation({ longitude, latitude });
        };

        // 최초 실행 + 주기적 전송
        handleSync();
        const intervalId = setInterval(handleSync, LOCATION_SYNC_INTERVAL_MS);

        return () => clearInterval(intervalId);
    }, [enabled, loading, error, syncLocation]);

    return { isSyncing };
}