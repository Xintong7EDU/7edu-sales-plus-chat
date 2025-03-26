import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { UserProvider } from "./lib/context/UserContext";
import { ChatProvider } from "./lib/context/ChatContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
  display: "swap",
});

export const metadata: Metadata = {
  title: "7Edu AI Chat | Educational Counseling",
  description: "AI-powered educational counseling and college application guidance",
  keywords: "education, college counseling, AI chat, academic guidance, 7Edu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${lexend.variable} font-sans antialiased h-full bg-white`}
      >
        <div className="flex flex-col min-h-full">
          <UserProvider>
            <ChatProvider>
              {children}
            </ChatProvider>
          </UserProvider>
        </div>
      </body>
    </html>
  );
}
