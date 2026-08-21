"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LocalizeMapProps {
    centerLat: number;
    centerLng: number;
    onCenterChange: (lat: number, lng: number) => void;
}

export default function LocalizeMap({ centerLat, centerLng, onCenterChange }: LocalizeMapProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);

    // 1. 지도 인스턴스 안전 생성 및 cleanup
    useEffect(() => {
        if (!mapContainerRef.current || mapInstanceRef.current) return;

        // Leaflet 지도 생성
        const map = L.map(mapContainerRef.current, {
            center: [centerLat, centerLng],
            zoom: 15,
            zoomControl: false,
        });

        // 타일 레이어 추가
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

        // 드래그 종료 시 중심 좌표 전달
        map.on("moveend", () => {
            const center = map.getCenter();
            onCenterChange(center.lat, center.lng);
        });

        mapInstanceRef.current = map;

        // 언마운트 시 인스턴스 파괴 (중복 생성 에러 방지)
        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []);

    // 2. 검색 등으로 좌표 변경 시 지도 이동 (flyTo)
    useEffect(() => {
        if (mapInstanceRef.current) {
            const currentCenter = mapInstanceRef.current.getCenter();
            if (currentCenter.lat !== centerLat || currentCenter.lng !== centerLng) {
                mapInstanceRef.current.flyTo([centerLat, centerLng], 15, { animate: true });
            }
        }
    }, [centerLat, centerLng]);

    return <div ref={mapContainerRef} className="h-full w-full" />;
}