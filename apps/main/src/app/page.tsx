import Link from "next/link";
import type { Metadata } from "next";

// 페이지별 SEO. 서버 컴포넌트라서 이 값이 실제 HTML <head>에 박혀 나간다.
export const metadata: Metadata = {
  title: "Affection — 흩어지지 않는 실시간 채팅",
  description:
    "방을 만들고, 초대하고, 나눈 이야기를 그대로 보관하세요. 실시간 메시지와 알림을 지원하는 채팅 서비스입니다.",
  openGraph: {
    title: "Affection — 흩어지지 않는 실시간 채팅",
    description: "방을 만들고, 초대하고, 나눈 이야기를 그대로 보관하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

const features = [
  {
    title: "지연 없는 실시간 전송",
    body: "WebSocket으로 메시지가 즉시 도착합니다. 새로고침할 필요가 없습니다.",
  },
  {
    title: "대화가 남는 방",
    body: "방을 나갔다 돌아와도 지난 대화가 그대로 있습니다. 검색해서 다시 찾으세요.",
  },
  {
    title: "놓치지 않는 알림",
    body: "읽지 않은 메시지와 멘션을 모아서 알려드립니다. 필요한 것만 골라 받으세요.",
  },
];

const steps = [
  { title: "방 만들기", body: "주제를 정하고 방을 엽니다." },
  { title: "초대하기", body: "링크 하나로 함께할 사람을 부릅니다." },
  { title: "대화하기", body: "나눈 이야기는 사라지지 않고 쌓입니다." },
];

export default function HomePage() {
  return (
    <main className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-zinc-200 px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-medium tracking-widest text-indigo-600 uppercase">
            Affection
          </p>
          <h1 className="mt-6 text-4xl leading-tight font-semibold tracking-tight text-balance text-zinc-900 sm:text-6xl">
            말이 오래 머무는 채팅
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-pretty text-zinc-600">
            방을 만들고, 초대하고, 나눈 이야기를 그대로 보관하세요. 대화가
            흩어지지 않는 실시간 채팅 서비스입니다.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition hover:bg-indigo-700 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              무료로 시작하기
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-zinc-300 px-6 py-3 font-medium text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              요금 보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
            대화에 필요한 것만
          </h2>
          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {features.map((f) => (
              <article key={f.title}>
                <h3 className="text-lg font-semibold text-zinc-900">
                  {f.title}
                </h3>
                <p className="mt-3 leading-relaxed text-zinc-600">{f.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works — 순서가 실제로 의미 있으므로 번호를 붙인다 */}
      <section className="border-y border-zinc-200 bg-zinc-50 px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-semibold tracking-tight text-zinc-900">
            시작은 3분이면 충분합니다
          </h2>
          <ol className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="text-sm font-medium text-indigo-600 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                  {s.title}
                </h3>
                <p className="mt-2 leading-relaxed text-zinc-600">{s.body}</p>
              </li>
            ))}
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

      {/* Footer */}
      <footer className="border-t border-zinc-200 px-6 py-12">
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
      </footer>
    </main>
  );
}