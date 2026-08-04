// src/lib/use-location-sync.ts
"use client";

import { useEffect, useRef } from "react";
import { useGeolocation } from "./use-geolocation";

const LOCATION_SYNC_INTERVAL_MS = 60_000;

interface UpdateLocalRequest {
  longitude: number;
  latitude: number;
}

async function sendLocation({ longitude, latitude }: UpdateLocalRequest): Promise<void> {
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

  // interval 콜백이 최신 position을 참조하도록 ref로 관리 (stale closure 방지)
  const positionRef = useRef(position);
  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (!enabled) return;

    const syncOnce = async () => {
      // 아직 위치를 못 받았거나 에러 상태면 스킵 (SEOUL 폴백값이 잘못 전송되는 것 방지)
      if (loading || error) return;

      const [latitude, longitude] = positionRef.current;

      try {
        await sendLocation({ longitude, latitude });
      } catch (err) {
        console.error("Location sync error:", err);
      }
    };

    // 최초 위치 확보 시 1회 즉시 전송 + 이후 60초 주기
    syncOnce();
    const intervalId = setInterval(syncOnce, LOCATION_SYNC_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [enabled, loading, error]);
}