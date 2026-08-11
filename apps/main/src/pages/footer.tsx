import Link from "next/link";

export default function Footer() {
    return (
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm text-zinc-500 sm:flex-row">
            <p>© {new Date().getFullYear()} Affection</p>
            <nav className="flex gap-6">
                <Link href="/pricing" className="hover:text-zinc-900">
                    요금
                </Link>
                <Link href="/terms" className="hover:text-zinc-900">
                    이용약관
                </Link>
                <Link href="/privacy" className="hover:text-zinc-900">
                    개인정보처리방침
                </Link>
            </nav>
        </div>
    );
}
