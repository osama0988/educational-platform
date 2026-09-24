import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "../src/components/providers/SessionProvider";
import AIAssistant from "../src/components/ai/AIAssistant";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "منصة أ/ عمرو موسى | منصة تعليمية",
  description: "منصة أ/ عمرو موسى التعليمية للغة العربية للمرحلتين الإعدادية والثانوية.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthSessionProvider>{children}<AIAssistant /></AuthSessionProvider>
      </body>
    </html>
  );
}