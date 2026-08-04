import Link from "next/link";
import { HeaderNav } from "@/components/header-nav";

/**
 * 서버 컴포넌트다. "use client" 가 없다.
 * sticky 는 순수 CSS라 자바스크립트가 필요 없기 때문.
 *
 * 로그인 상태에 따라 바뀌는 오른쪽 nav만 클라이언트 컴포넌트(HeaderNav)로 분리했다.
 */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-zinc-900"
        >
          Affection
        </Link>

        <HeaderNav />
      </div>
    </header>
  );
}
