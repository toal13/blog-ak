// app/layout.tsx
import "./globals.css";
import { Inter, Karla, Noto_Sans_JP } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
  display: "swap",
});
const noto = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body
        className={`${inter.variable} ${karla.variable} ${noto.variable} font-sans antialiased min-h-[100svh] md:min-h-[100dvh] flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
