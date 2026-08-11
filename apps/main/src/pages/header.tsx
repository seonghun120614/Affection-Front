"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const menuItemCls =
    "rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none";

/**
 * 헤더 오른쪽 nav. 로그인 여부에 따라 메뉴 ↔ 로그인/회원가입 을 전환한다.
 *
 * 로그인 상태는 login-form이 sessionStorage에 넣어둔 username으로 판단한다.
 * (JWT는 HttpOnly 쿠키라 프론트에서 읽을 수 없다)
 */
export function HeaderNav() {
    const pathname = usePathname();
    const router = useRouter();
    const [username, setUsername] = useState<string | null>(null);
    const { openFindingModal, openBorrowModal } = useModal();

    const handleLogout = async () => {
        await auth.logout();
        setUsername(null); // 헤더는 라우트가 안 바뀌면 sessionStorage를 다시 안 읽으므로 직접 갱신
        router.push("/");
    };

    // sessionStorage는 서버에 없으므로 마운트 후에 읽는다 (hydration mismatch 방지).
    // 헤더는 layout에 있어 페이지 이동 시 리마운트되지 않으므로,
    // 로그인 직후 /rooms 로 이동할 때 pathname 변화를 계기로 다시 읽는다.
    useEffect(() => {
        setUsername(sessionStorage.getItem("username"));
    }, [pathname]);

    if (username) {
        return (
            <nav className="flex items-center gap-2">
                {/* 채팅/그룹채팅은 지도 화면으로. 어떤 패널을 열지는 나중에 지도 쪽에서 처리 */}
                <Link href="/rooms" className={menuItemCls}>
                    채팅
                </Link>
                <button
                    type="button"
                    onClick={openBorrowModal}
                    className={menuItemCls}
                >
                    빌려주세요
                </button>
                <button
                    type="button"
                    onClick={openFindingModal}
                    className={menuItemCls}
                >
                    찾아주세요
                </button>
                <Link href="/rooms" className={menuItemCls}>
                    그룹채팅
                </Link>
                <Link
                    href="/settings"
                    className="rounded-lg px-4 py-2 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
                >
                    {username}
                </Link>
                <button
                    type="button"
                    onClick={handleLogout}
                    className={menuItemCls}
                >
                    로그아웃
                </button>
            </nav>
        );
    }

    return (
        <nav className="flex items-center gap-2">
            <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
            >
                로그인
            </Link>
            <Link
                href="/signup"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
                회원가입
            </Link>
        </nav>
    );
}
