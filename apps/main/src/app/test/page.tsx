"use client";

import { useState } from "react";
import { LoginForm } from "@/features/auth/ui/login-form";

// 세분화된 디바이스 타입 정의
type DeviceType = 
    | 'mobile' 
    | 'fold-closed' 
    | 'fold-open' 
    | 'tablet-landscape' 
    | 'laptop' 
    | 'desktop';

export default function TestPage() {
    const [device, setDevice] = useState<DeviceType>('mobile');

    // 각 기기별 실제 뷰포트 비율 및 해상도 매핑
    const deviceStyles: Record<DeviceType, string> = {
        'mobile': "w-[375px] h-[667px] p-6",              // 일반 스마트폰
        'fold-closed': "w-[344px] h-[780px] p-4",         // 갤럭시 Z 폴드 (접힘/커버 화면)
        'fold-open': "w-[768px] h-[884px] p-10",          // 갤럭시 Z 폴드 (펼침) / 태블릿 세로
        'tablet-landscape': "w-[1024px] h-[768px] p-12",  // 태블릿 가로 (Landscape)
        'laptop': "w-[1280px] h-[720px] p-16",            // 노트북
        'desktop': "w-[1440px] h-[900px] p-16",           // 데스크톱 모니터
    };

    // UI 레이블 매핑
    const deviceLabels: Record<DeviceType, string> = {
        'mobile': 'Mobile',
        'fold-closed': 'Fold (Closed)',
        'fold-open': 'Fold (Open)',
        'tablet-landscape': 'Tablet (Land)',
        'laptop': 'Laptop',
        'desktop': 'Desktop',
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-gray-950 overflow-hidden py-20">
            {/* 디바이스 변경 컨트롤러 (버튼 그룹) */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex flex-wrap justify-center gap-1.5 bg-white/90 backdrop-blur-md p-2 rounded-xl shadow-lg border border-gray-200 max-w-[90vw]">
                {(Object.keys(deviceStyles) as DeviceType[]).map((d) => (
                    <button
                        key={d}
                        onClick={() => setDevice(d)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            device === d 
                                ? 'bg-blue-600 text-white shadow-sm' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                        {deviceLabels[d]}
                    </button>
                ))}
            </div>

            {/* main 디바이스 프레임 */}
            <main className={`relative flex flex-col justify-center border-12 border-gray-800 rounded-4xl shadow-2xl bg-white transition-all duration-500 ease-in-out overflow-y-auto ${deviceStyles[device]}`}>
                <div className="w-full max-w-sm mx-auto">
                    <LoginForm/>
                </div>
            </main>
        </div>
    );
}