import Link from "next/link";

export function Footer() {
    return (
        <footer className="w-full border-t border-stone-200 bg-stone-50/50 py-8 text-xs text-stone-500">
            <div className="mx-auto flex max-w-5xl flex-col gap-6 px-6">
                {/* 상단: Copyright & 주요 링크 */}
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <p>© {new Date().getFullYear()} Affection. All rights reserved.</p>
                    <nav className="flex gap-6">
                        <Link href="/pricing" className="hover:text-stone-900 transition">
                            요금
                        </Link>
                        <Link href="/terms" className="hover:text-stone-900 transition">
                            이용약관
                        </Link>
                        {/* 개인정보처리방침은 법적으로 타 링크와 구별되도록 굵게 표기합니다 */}
                        <Link href="/privacy" className="font-bold text-stone-700 hover:text-stone-900 transition">
                            개인정보처리방침
                        </Link>
                    </nav>
                </div>

                {/* 하단: 법정 필수 사업자 정보 */}
                <div className="flex flex-col gap-1 text-[11px] leading-relaxed text-stone-400 border-t border-stone-200/60 pt-4">
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>(주)어펙션</span>
                        <span>대표: 홍길동</span>
                        <span>사업자등록번호: 000-00-00000</span>
                        <span>통신판매업신고: 2026-서울강남-0000</span>
                    </div>
                    <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                        <span>주소: 서울특별시 강남구 테헤란로 000</span>
                        <span>문의: support@affection.com</span>
                        <span>호스팅서비스 제공자: Vercel Inc.</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}