"use client";

import { useGeolocation } from "../model/use-geolocation";
import { useLocationSync } from "../model/use-location-sync";
import { usePinpoint } from "../model/use-pinpoint";
import { LocalizeModal } from "./LocalizeModal";
import { useModalStore } from "@affection/hooks";

export function MapView() {
    // 1. 위치 및 핀포인트 상태
    const { position, loading, error } = useGeolocation();
    const { pinpoint, isSearching, searchByAddress, resetPinpoint, setCoordinates } = usePinpoint();
    const {
        isModalOpen: isLocalizeModalOpen,
        openModal: openLocalizeModal,
        closeModal: closeLocalizeModal
    } = useModalStore();

    useLocationSync(!error);

    const [latitude, longitude] = position;

    // 2. 핀포인트가 설정되어 있으면 해당 위치, 없으면 내 위치를 중심점으로 사용
    const mapCenterLat = pinpoint ? pinpoint.latitude : latitude;
    const mapCenterLng = pinpoint ? pinpoint.longitude : longitude;

    // 3. 우클릭 시 위치 지정 모달 열기
    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
        openLocalizeModal();
    };

    // 4. iframe bbox 범위 좌표 정의
    const bboxMinLng = mapCenterLng - 0.01;
    const bboxMinLat = mapCenterLat - 0.005;
    const bboxMaxLng = mapCenterLng + 0.01;
    const bboxMaxLat = mapCenterLat + 0.005;

    return (
        <div
            onContextMenu={handleContextMenu}
            className="relative h-full w-full overflow-hidden rounded-2xl bg-stone-100 select-none cursor-pointer"
        >
            {/* 위치 측정 중 안내 */}
            {loading && !pinpoint && (
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-medium text-stone-600 shadow-md backdrop-blur-md">
                    <div className="h-2 w-2 animate-ping rounded-full bg-autumn-rust" />
                    현재 위치를 측정 중입니다...
                </div>
            )}

            {/* 우클릭 안내 우측 상단 배지 */}
            <div className="absolute top-4 right-4 z-10 rounded-xl bg-stone-900/70 px-3 py-1.5 text-xs text-white backdrop-blur-md pointer-events-none">
                💡 지도 우클릭 시 위치 변경 모달 열기
            </div>

            {/* 메인 지도 iframe */}
            <iframe
                title="Map View"
                width="100%"
                height="100%"
                key={`${mapCenterLat}-${mapCenterLng}`}
                className="h-full w-full border-0 grayscale-[20%] opacity-90 transition-opacity pointer-events-none"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${bboxMinLng}%2C${bboxMinLat}%2C${bboxMaxLng}%2C${bboxMaxLat}&layer=mapnik&marker=${mapCenterLat}%2C${mapCenterLng}`}
            />

            {/* 핀포인트 오버레이 카드 */}
            {pinpoint && (
                <div className="absolute bottom-6 left-6 z-10 flex flex-col gap-1 rounded-2xl border border-stone-200 bg-white/95 p-4 shadow-xl backdrop-blur-md max-w-sm">
                    <div className="flex items-center justify-between gap-4">
                        <span className="text-xs font-bold text-autumn-rust">📍 선택된 위치</span>
                        <button onClick={resetPinpoint} className="text-xs text-stone-400 hover:text-stone-600">지우기</button>
                    </div>
                    {pinpoint.address && (
                        <p className="text-xs font-medium text-stone-700">{pinpoint.address}</p>
                    )}
                    <div className="flex gap-3 text-[11px] text-stone-500 font-mono">
                        <span>Lat: {pinpoint.latitude.toFixed(6)}</span>
                        <span>Lng: {pinpoint.longitude.toFixed(6)}</span>
                    </div>
                </div>
            )}

            {/* 위치 선택/검색 모달 */}
            <LocalizeModal
                isOpen={isLocalizeModalOpen}
                onClose={closeLocalizeModal}
                onSearchAddress={searchByAddress}
                onSelectLocation={(lat, lng) => setCoordinates(lat, lng, "모달 선택 위치")}
                isSearching={isSearching}
                initialLat={mapCenterLat}
                initialLng={mapCenterLng}
            />
        </div>
    );
}