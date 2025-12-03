import "./globals.css";
import {
  Playfair_Display,
  Crimson_Pro,
  Zen_Old_Mincho,
} from "next/font/google";
import type { Metadata } from "next";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});
const zen = Zen_Old_Mincho({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-zen-old-mincho",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Anna Kawa Arkitekt",
  description: "Architecture Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv">
      <body
        className={`${playfair.variable} ${crimson.variable} ${zen.variable} font-sans antialiased min-h-[100svh] md:min-h-[100dvh] flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
