import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "../../pages/login-form";

export const metadata: Metadata = {
    title: "로그인",
    description: "Affection 계정으로 로그인하세요.",
};

export default function LoginPage() {
    return (
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                로그인
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
                계정이 없으신가요?{" "}
                <Link
                    href="/signup"
                    className="font-medium text-indigo-600 hover:text-indigo-700"
                >
                    회원가입
                </Link>
            </p>

            {/* 폼만 클라이언트 컴포넌트. 페이지 자체는 서버에 남아 metadata를 내보낸다. */}
            {/* useSearchParams()를 쓰는 컴포넌트는 Suspense 없이는 정적 프리렌더가 실패한다. */}
            <Suspense>
                <LoginForm />
            </Suspense>
        </main>
    );
}
