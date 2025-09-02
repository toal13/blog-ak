import "./globals.css";
import { Playfair, Crimson_Pro, Noto_Serif_JP } from "next/font/google";

const playfair = Playfair({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});
const crimson = Crimson_Pro({
  subsets: ["latin"],
  variable: "--font-crimson",
  display: "swap",
});
const noto = Noto_Serif_JP({
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
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
        className={`${playfair.variable} ${crimson.variable} ${noto.variable} font-sans antialiased min-h-[100svh] md:min-h-[100dvh] flex flex-col`}
      >
        {children}
      </body>
    </html>
  );
}
