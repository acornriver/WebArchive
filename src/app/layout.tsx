import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

// 번호·연도·분류 같은 작은 정보에만 쓰는 고정폭
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "acornriver 강민혁",
  description:
    "미디어 아티스트 acornriver(강민혁)의 작업. 사운드 퍼포먼스, 설치, 영상, 음악, 출판.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className={`${plexMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
