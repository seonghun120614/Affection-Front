import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "설정",
  description: "계정과 앱 설정을 관리하세요.",
};

export default function SettingsPage() {
  return (
    <main className="mx-auto min-h-[calc(100vh-4rem)] max-w-md px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
        설정
      </h1>
      <p className="mt-2 text-sm text-zinc-600">
        설정 화면은 준비 중입니다.
      </p>
    </main>
  );
}
