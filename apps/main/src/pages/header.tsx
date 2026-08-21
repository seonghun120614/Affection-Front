"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useModalStore } from "@affection/hooks";
import { usePathname, useRouter } from "next/navigation";
import { useLogout } from "@/features";

export interface HeaderNavProps {
    username?: string | null;
    openBorrowModal?: () => void;
    openFindingModal?: () => void;
}

// 웹 전용 공통 메뉴 버튼 스타일 (상수 명명 규칙 적용)
const MENU_ITEM_CLS =
    "rounded-xl px-3.5 py-2 text-sm font-medium text-stone-600 transition-all hover:bg-stone-100 hover:text-stone-900 focus-visible:ring-2 focus-visible:ring-stone-300 focus-visible:outline-none";

function HeaderNav({ username }: HeaderNavProps) {
    const router = useRouter();
    const openFindingModal = useModalStore((state) => state.openModal);
    const { mutate: logout } = useLogout((path: string) => {
        router.push(path);
    });

    const handleLogout = () => {
        // useLogout 훅을 통한 백엔드 세션/토큰 정리 후 클라이언트 스토리지 비우기
        logout(undefined, {
            onSuccess: () => {
                localStorage.removeItem("username");
                localStorage.removeItem("accessToken");
                router.push("/");
                router.refresh();
            },
            onError: () => {
                localStorage.removeItem("username");
                localStorage.removeItem("accessToken");
                router.push("/");
                router.refresh();
            },
        });
    };

    return (
        <nav className="flex items-center gap-2 sm:gap-3">
            {username ? (
                /* 로그인 후: 모달 버튼 및 유저 프로필/로그아웃 */
                <>
                    <button onClick={() => {}} className={MENU_ITEM_CLS}>
                        물품 대여하기
                    </button>
                    <button onClick={openFindingModal} className={MENU_ITEM_CLS}>
                        주인 찾기
                    </button>
                    
                    <div className="mx-1 h-4 w-px bg-stone-200" />

                    <span className="px-1 text-sm font-semibold text-stone-900">
                        <span className="text-autumn-rust">{username}</span> 님
                    </span>

                    <button
                        onClick={handleLogout}
                        className="rounded-xl border border-stone-200 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                /* 로그인 전: 로그인 / 회원가입 버튼 */
                <>
                    <Link href="/login" className={MENU_ITEM_CLS}>
                        로그인
                    </Link>
                    <Link
                        href="/signup"
                        className="rounded-xl bg-autumn-rust px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-autumn-rust/90 active:scale-[0.98]"
                    >
                        시작하기
                    </Link>
                </>
            )}
        </nav>
    );
}

export function Header() {
    const pathname = usePathname();
    const [username, setUsername] = useState<string | null>(null);

    const isAuthPage = pathname === "/signup" || pathname === "/login";

    useEffect(() => {
        // localStorage에서 저장된 username을 가져옴
        const storedUser = localStorage.getItem("username");
        setUsername(storedUser);
    }, [pathname]);

    return (
        <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-tight text-stone-900 transition hover:opacity-80"
                >
                    Affection<span className="text-autumn-rust">.</span>
                </Link>

                {!isAuthPage && (
                    <HeaderNav
                        username={username}
                        openBorrowModal={() => console.log("대여 모달")}
                        openFindingModal={() => console.log("찾기 모달")}
                    />
                )}
            </div>
        </header>
    );
}