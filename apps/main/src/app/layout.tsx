import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { ModalProvider } from "@/components/modal-provider";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Affection — 흩어지지 않는 실시간 채팅",
    template: "%s | Affection",
  },
  description:
    "방을 만들고, 초대하고, 나눈 이야기를 그대로 보관하세요. 실시간 채팅 서비스 Affection.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geist.variable} bg-white antialiased`}>
        {/* layout은 페이지를 이동해도 리렌더되지 않는다. 헤더 상태가 유지된다. */}
        {/* 모달 상태는 헤더(트리거)와 페이지 양쪽 위에서 공유해야 하므로 여기서 감싼다 */}
        <ModalProvider>
          <SiteHeader />
          {children}
        </ModalProvider>
      </body>
    </html>
  );
}