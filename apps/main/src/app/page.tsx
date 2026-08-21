"use client";

import Link from "next/link";

const features = [
    {
        title: "따뜻한 동네 소통",
        body: "이웃 간의 가벼운 정과 온기를 나눌 수 있는 따뜻한 커뮤니티 공간입니다.",
    },
    {
        title: "쉽고 빠른 빌림 & 나눔",
        body: "필요한 물건을 이웃에게 요청하거나, 사용하지 않는 물건을 나누어 보세요.",
    },
    {
        title: "실시간 이웃 채팅",
        body: "1:1 채팅 및 그룹 채팅으로 안전하고 편리하게 의사를 주고받을 수 있습니다.",
    },
];

const steps = [
    {
        title: "간단한 회원가입",
        body: "이메일 인증만으로 1분 만에 가입이 완료됩니다.",
    },
    {
        title: "우리 동네 설정",
        body: "내가 거주하는 동네를 선택하고 이웃들의 소식을 확인하세요.",
    },
    {
        title: "마음 나누기 시작",
        body: "물건을 빌리거나 찾기 글을 작성하여 소통을 시작해 보세요.",
    },
];

export default function HomePage() {
    return (
        <div className="flex min-h-screen flex-col bg-white text-stone-800">
            {/* 메인 컨텐츠 영역 */}
            <main className="flex flex-1 flex-col">
                {/* Hero */}
                <section className="border-b border-stone-200 bg-linear-to-b from-stone-50/80 to-white px-6 py-24 sm:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-xs font-semibold tracking-widest text-autumn-rust uppercase">
                            Affection
                        </p>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance text-stone-900 sm:text-6xl">
                            정이 오가는 SNS 서비스
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-pretty text-stone-600 sm:text-lg">
                            동네 이웃, 친한 사람에게 마음을 전하세요.
                            <br />
                            나눔과 공유가 필요한 시대입니다.
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href="/signup"
                                className="rounded-xl bg-autumn-rust px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-autumn-rust/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-autumn-rust/50"
                            >
                                무료로 시작하기
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                            '정'이 오가는 서비스
                        </h2>
                        <div className="mt-14 grid gap-8 sm:grid-cols-3">
                            {features.map((f) => (
                                <article
                                    key={f.title}
                                    className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-6 transition-all hover:border-stone-300 hover:shadow-sm"
                                >
                                    <h3 className="text-base font-bold text-stone-900">
                                        {f.title}
                                    </h3>
                                    <p className="mt-2.5 text-sm leading-relaxed text-stone-600">
                                        {f.body}
                                    </p>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="border-y border-stone-200 bg-stone-50 px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="text-center text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
                            시작은 3분이면 충분합니다
                        </h2>
                        <ol className="mt-14 grid gap-8 sm:grid-cols-3">
                            {steps.map((s, i) => (
                                <li
                                    key={s.title}
                                    className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                                >
                                    <span className="text-xs font-bold text-autumn-rust tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="mt-2 text-base font-bold text-stone-900">
                                        {s.title}
                                    </h3>
                                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                                        {s.body}
                                    </p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-balance text-stone-900 sm:text-3xl">
                            지금 첫 번째 방을 열어보세요
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-stone-600">
                            가입에 별도의 비용이나 복잡한 절차가 필요하지 않습니다.
                        </p>
                        <Link
                            href="/signup"
                            className="mt-8 inline-block rounded-xl bg-autumn-rust px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-autumn-rust/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-autumn-rust/50"
                        >
                            무료로 시작하기
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}