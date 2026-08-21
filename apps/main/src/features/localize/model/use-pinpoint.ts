"use client";

import { useState, useCallback } from "react";

export interface Pinpoint {
    latitude: number;
    longitude: number;
    address?: string;
}

export function usePinpoint() {
    const [pinpoint, setPinpoint] = useState<Pinpoint | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // 좌표를 직접 설정하는 함수 (우클릭 등)
    const setCoordinates = useCallback((lat: number, lng: number, address?: string) => {
        setPinpoint({ latitude: lat, longitude: lng, address });
    }, []);

    // 주소 텍스트로 위도/경도 검색 (OpenStreetMap Nominatim 사용)
    const searchByAddress = useCallback(async (keyword: string) => {
        if (!keyword.trim()) return null;
        
        setIsSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}`
            );
            const data = await res.json();

            if (data && data.length > 0) {
                const lat = parseFloat(data[0].lat);
                const lng = parseFloat(data[0].lon);
                const displayName = data[0].display_name;

                const result = { latitude: lat, longitude: lng, address: displayName };
                setPinpoint(result);
                return result;
            } else {
                alert("해당 주소를 찾을 수 없습니다.");
                return null;
            }
        } catch (error) {
            console.error("주소 검색 오류:", error);
            alert("주소 검색 중 오류가 발생했습니다.");
            return null;
        } finally {
            setIsSearching(false);
        }
    }, []);

    const resetPinpoint = useCallback(() => {
        setPinpoint(null);
    }, []);

    return {
        pinpoint,
        isSearching,
        setCoordinates,
        searchByAddress,
        resetPinpoint,
    };
}