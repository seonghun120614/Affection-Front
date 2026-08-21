"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ModalLayout, Input, Button } from "@affection/ui";

const LocalizeMap = dynamic(() => import("./LocalizeMap"), {
    ssr: false,
    loading: () => (
        <div className="flex h-full items-center justify-center text-xs text-stone-400">
            지도를 불러오는 중입니다...
        </div>
    ),
});

interface LocalizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSearchAddress?: (address: string) => Promise<any>;
    onSelectLocation?: (lat: number, lng: number) => void;
    isSearching?: boolean;
    initialLat?: number;
    initialLng?: number;
}

export function LocalizeModal({
    isOpen,
    onClose,
    onSearchAddress,
    onSelectLocation,
    isSearching = false,
    initialLat = 37.5665,
    initialLng = 126.978,
}: LocalizeModalProps) {
    const [addressInput, setAddressInput] = useState("");
    const [centerLat, setCenterLat] = useState(initialLat);
    const [centerLng, setCenterLng] = useState(initialLng);

    useEffect(() => {
        if (initialLat && initialLng) {
            setCenterLat(initialLat);
            setCenterLng(initialLng);
        }
    }, [initialLat, initialLng]);

    // 주소 검색 시 모달을 닫지 않고 내부 지도 좌표만 갱신하여 Focus 이동
    const handleSearch = async () => {
        if (!addressInput.trim() || !onSearchAddress) return;
        const result = await onSearchAddress(addressInput);
        if (result) {
            setCenterLat(result.latitude);
            setCenterLng(result.longitude);
        }
    };

    // [이 위치로 설정] 버튼을 누를 때만 모달을 닫고 최종 위치 전달
    const handleConfirmLocation = () => {
        if (onSelectLocation) {
            onSelectLocation(centerLat, centerLng);
        }
        onClose();
    };

    return (
        <ModalLayout isOpen={isOpen} onClose={onClose} title="주인 찾기 위치 검색">
            <div className="flex flex-col gap-4">
                {/* 1. 주소 검색 영역 */}
                <div className="flex flex-col gap-2">
                    <p className="text-xs text-stone-500">분실 및 발견 장소를 입력해 주세요.</p>
                    {/* items-center -> items-stretch 로 변경하여 높이 맞춤 */}
                    <div className="flex items-stretch gap-2">
                        <div className="flex-1">
                            <Input
                                placeholder="예: 역삼동, 강남대로 396"
                                value={addressInput}
                                onChange={(e) => setAddressInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                            />
                        </div>
                        {/* h-full 및 flex 적용으로 Input 높이에 100% 맞춤 */}
                        <div className="w-24 shrink-0 flex">
                            <Button
                                status={isSearching ? "loading" : "default"}
                                onClick={handleSearch}
                                className="h-full w-full"
                            >
                                검색
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="relative flex items-center justify-center my-1">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-200" /></div>
                    <span className="relative bg-white px-2 text-[11px] text-stone-400">또는 지도에서 직접 선택</span>
                </div>

                {/* 2. 대화형 지도 영역 */}
                <div className="relative h-56 w-full overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
                    {isOpen && (
                        <LocalizeMap
                            centerLat={centerLat}
                            centerLng={centerLng}
                            onCenterChange={(lat, lng) => {
                                setCenterLat(lat);
                                setCenterLng(lng);
                            }}
                        />
                    )}

                    <div className="pointer-events-none absolute inset-0 z-1000 flex items-center justify-center pb-6">
                        <div className="text-3xl text-autumn-rust drop-shadow-md">📍</div>
                    </div>
                </div>

                {/* 3. 위치 확정 버튼 */}
                <div className="flex items-center justify-between gap-3">
                    <div className="text-[11px] text-stone-500 font-mono">
                        {centerLat.toFixed(5)}, {centerLng.toFixed(5)}
                    </div>
                    {/* 상단 검색 버튼과 동일한 높이(h-10) 적용 */}
                    <div className="h-10 w-36 shrink-0">
                        <Button onClick={handleConfirmLocation} className="h-full w-full">
                            이 위치로 설정
                        </Button>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
}