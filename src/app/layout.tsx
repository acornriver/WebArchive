import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// 번호·연도·분류 같은 작은 정보에만 쓰는 고정폭
const plexMono = localFont({
  variable: "--font-plex-mono",
  src: [
    { path: "./fonts/IBMPlexMono-Regular.woff2", weight: "400" },
    { path: "./fonts/IBMPlexMono-Medium.woff2", weight: "500" },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.acornriver.work"),
  title: { default: "acornriver 강민혁", template: "%s · acornriver 강민혁" },
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
      <body className={`${plexMono.variable} antialiased`}>
        <a href="#main-content" className="skip-link">본문으로 건너뛰기</a>
        {children}
      </body>
    </html>
  );
}
