"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
    Circle,
    useMap,
} from "react-leaflet";
import { useLocationSync } from "@/lib/use-location-sync";
import { useEffect, useRef } from "react";
import { SEOUL, useGeolocation } from "@/lib/use-geolocation";

const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// center prop은 초기값일 뿐이라, 위치가 갱신되면 명령형으로 이동시킨다.
function Recenter({
    position,
    active,
}: {
    position: [number, number];
    active: boolean;
}) {
    const map = useMap();
    const donefirstFly = useRef(false);

    useEffect(() => {
        if (!active) return;
        if (donefirstFly.current) {
            map.panTo(position); // 이후 갱신은 부드럽게 따라가기만
        } else {
            map.flyTo(position, 16);
            donefirstFly.current = true;
        }
    }, [map, position, active]);

    return null;
}

export default function MapView() {
    const { position, loading, error } = useGeolocation();
    const hasFix = !loading && !error;

    useLocationSync(true);

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={SEOUL}
                zoom={17}
                scrollWheelZoom
                zoomControl={false}
                className="h-full w-full"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Recenter position={position} active={hasFix} />

                {hasFix && (
                    <>
                        <Circle
                            center={position}
                            radius={40}
                            pathOptions={{
                                color: "#6366f1",
                                fillColor: "#6366f1",
                                fillOpacity: 0.15,
                                weight: 1,
                            }}
                        />
                        <Marker position={position} icon={icon}>
                            <Popup>현재 위치</Popup>
                        </Marker>
                    </>
                )}
            </MapContainer>

            {(loading || error) && (
                <div className="pointer-events-none absolute left-1/2 top-5 z-[1000] -translate-x-1/2 rounded-full bg-white/85 px-4 py-1.5 text-xs text-zinc-700 shadow backdrop-blur">
                    {loading ? "위치를 확인하는 중…" : error}
                </div>
            )}
        </div>
    );
}
