import "./globals.css";
import { Geist } from "next/font/google";
import { QueryProvider } from "@affection/hooks";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={`${geist.variable} bg-white antialiased`}>
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
