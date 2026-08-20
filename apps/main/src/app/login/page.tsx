import Link from "next/link";
import { LoginForm } from "@/features/auth/ui/login-form"; // 프로젝트 파일 위치에 맞게 수정

export default function LoginPage() {
    return (
        <div className="flex min-h-screen w-full items-center justify-center px-4 py-10">
            {/* 공통 가율 테마 카드 스타일 */}
            <div className="flex w-full max-w-md flex-col gap-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-xl shadow-stone-200/40">
                
                {/* 상단 타이틀 */}
                <div className="flex flex-col gap-1 text-center">
                    <h1 className="text-xl font-bold text-stone-900 sm:text-2xl">
                        로그인
                    </h1>
                    <p className="text-xs text-stone-500 sm:text-sm">
                        정이 오가는 Affection에 오신 것을 환영합니다.
                    </p>
                </div>

                {/* 작성한 로그인 폼 */}
                <LoginForm />

                {/* 하단 회원가입 이동 링크 */}
                <div className="border-t border-stone-100 pt-4 text-center text-xs text-stone-500">
                    아직 계정이 없으신가요?{" "}
                    <Link
                        href="/signup"
                        className="font-semibold text-autumn-rust transition hover:underline"
                    >
                        회원가입하기
                    </Link>
                </div>
            </div>
        </div>
    );
}