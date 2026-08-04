import type { Metadata } from "next";
import Link from "next/link";
import { SignupForm } from "./signup-form";

export const metadata: Metadata = {
  title: "회원가입",
  description: "Affection 계정을 만들고 첫 번째 방을 열어보세요.",
};

export default function SignupPage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        회원가입
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/login"
          className="font-medium text-indigo-600 hover:text-indigo-700"
        >
          로그인
        </Link>
      </p>

      <SignupForm />
    </main>
  );
}