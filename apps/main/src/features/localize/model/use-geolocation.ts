"use client";

import { useEffect, useState } from "react";

export const SEOUL: [number, number] = [37.5665, 126.978];

type State = {
    position: [number, number];
    loading: boolean;
    error: string | null;
};

export function useGeolocation() {
    const [state, setState] = useState<State>({
        position: SEOUL, // 권한 거부/실패 시 폴백
        loading: true,
        error: null,
    });

    useEffect(() => {
        if (!("geolocation" in navigator)) {
            setState((s) => ({
                ...s,
                loading: false,
                error: "위치 정보를 지원하지 않는 브라우저예요.",
            }));
            return;
        }

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setState({
                    position: [pos.coords.latitude, pos.coords.longitude],
                    loading: false,
                    error: null,
                });
            },
            (err) => {
                const message =
                    err.code === err.PERMISSION_DENIED
                        ? "위치 권한이 거부되었어요."
                        : err.code === err.TIMEOUT
                          ? "위치를 가져오는 데 시간이 너무 걸렸어요."
                          : "위치를 가져오지 못했어요.";
                setState((s) => ({ ...s, loading: false, error: message }));
            },
            {
                enableHighAccuracy: false,
                timeout: 10_000,
                maximumAge: 0,
            },
        );

        return () => navigator.geolocation.clearWatch(watchId);
    }, []);

    return state;
}
