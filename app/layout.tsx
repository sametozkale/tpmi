import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Hanken_Grotesk, Inter } from "next/font/google";
import { cookies } from "next/headers";
import { Providers } from "./providers";
import "./globals.css";

const titleFont = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-title",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TPMI",
  description:
    "TPMI — a global precious metals portfolio tracker with live spot context.",
};

type ThemeMode = "light" | "dark";

function getThemeFromCookie(value?: string): ThemeMode {
  return value === "dark" ? "dark" : "light";
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const cookieStore = await cookies();
  const initialTheme = getThemeFromCookie(cookieStore.get("tpmi_theme")?.value);

  return (
    <html
      lang="en"
      data-theme={initialTheme}
      suppressHydrationWarning
      className={`${titleFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
