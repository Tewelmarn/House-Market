import type { Metadata } from "next";
import { Be_Vietnam_Pro, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-headline",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "House Market — PNG SME Marketplace",
  description: "A digital trading village built for Papua New Guinea",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${beVietnam.variable} ${plusJakarta.variable}`}>
      <body style={{ backgroundColor: "#fbf9f6", color: "#1b1c1a" }}>
        {children}
      </body>
    </html>
  );
}
