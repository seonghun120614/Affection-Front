import "./global.css";
import { Geist } from "next/font/google";
import { QueryProvider } from "@affection/hooks";
import { Header } from "@/pages/Header";
import { Footer } from "@/pages/Footer";
import { ModalProvider } from "@affection/ui";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export default function RootLayout({
    children,
}: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="ko" suppressHydrationWarning>
            <body className={`${geist.variable} bg-white antialiased`}>
                <QueryProvider>
                    <ModalProvider>
                        <Header />
                        {children}
                        <Footer />
                    </ModalProvider>
                </QueryProvider>
            </body>
        </html>
    );
}