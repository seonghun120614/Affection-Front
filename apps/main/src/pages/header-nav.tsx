"use client";

import Link from "next/link";
import { HeaderNavProps } from "./HeaderNav.types";

const menuItemCls =
    "rounded-lg px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none";

export function HeaderNav({
    username,
    openBorrowModal,
    openFindingModal,
    handleLogout,
}: HeaderNavProps) {
    if (username) {
        return (
            <nav className="flex items-center gap-2">
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
