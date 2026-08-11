// import Header from "../pages/header";
// import Footer from "./footer";
import Link from "next/link";

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* 헤더 */}
            <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/85 backdrop-blur-md">
                {/* <Header /> */}
            </header>

            {/* 메인 컨텐츠 영역 */}
            <main className="flex-1 flex flex-col">
                {/* Hero */}
                <section className="border-b border-zinc-200 px-6 py-24 sm:py-32">
                    <div className="mx-auto max-w-3xl text-center">
                        <p className="text-sm font-medium tracking-widest text-indigo-600 uppercase">
                            Affection
                        </p>
                        <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight text-balance text-zinc-900 sm:text-6xl">
                            정이 오가는 SNS 서비스
                        </h1>
                        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-600">
                            동네 이웃, 친한 사람에게 마음을 전하세요.
                            <br />
                            나눔과 공유가 필요한 시대입니다.
                        </p>
                        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
                            <Link
                                href="/signup"
                                className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                            >
                                무료로 시작하기
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features */}
                <section className="px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
                            '정'이 오가는 서비스
                        </h2>
                        <div className="mt-14 grid gap-8 sm:grid-cols-3">
                            {/* {features.map((f) => (
                                <article key={f.title}>
                                    <h3 className="text-lg font-semibold text-zinc-900">
                                        {f.title}
                                    </h3>
                                    <p className="mt-3 leading-relaxed text-zinc-600">
                                        {f.body}
                                    </p>
                                </article>
                            ))} */}
                        </div>
                    </div>
                </section>

                {/* How it works */}
                <section className="border-y border-zinc-200 bg-zinc-50 px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-5xl">
                        <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
                            시작은 3분이면 충분합니다
                        </h2>
                        <ol className="mt-14 grid gap-8 sm:grid-cols-3">
                            {/* {steps.map((s, i) => (
                                <li key={s.title}>
                                    <span className="text-sm font-medium text-indigo-600 tabular-nums">
                                        {String(i + 1).padStart(2, "0")}
                                    </span>
                                    <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                                        {s.title}
                                    </h3>
                                    <p className="mt-2 leading-relaxed text-zinc-600">
                                        {s.body}
                                    </p>
                                </li>
                            ))} */}
                        </ol>
                    </div>
                </section>

                {/* CTA */}
                <section className="px-6 py-20 sm:py-28">
                    <div className="mx-auto max-w-2xl text-center">
                        <h2 className="text-3xl font-semibold tracking-tight text-balance text-zinc-900">
                            지금 첫 번째 방을 열어보세요
                        </h2>
                        <p className="mt-4 leading-relaxed text-zinc-600">
                            가입에 카드가 필요하지 않습니다.
                        </p>
                        <Link
                            href="/signup"
                            className="mt-8 inline-block rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
                        >
                            무료로 시작하기
                        </Link>
                    </div>
                </section>
            </main>

            {/* 푸터 */}
            <footer className="border-t border-zinc-200 px-6 py-12">
                {/* <Footer /> */}
            </footer>
        </div>
    );
}
