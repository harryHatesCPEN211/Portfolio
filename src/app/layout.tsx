import type { Metadata } from "next";
import { DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Harry Nguyen — Electrical Engineering Student",
  description:
    "Portfolio of Harry Nguyen, a 3rd-year Electrical Engineering student at UBC specializing in PCB design, circuit analysis, and embedded systems.",
  openGraph: {
    title: "Harry Nguyen — Electrical Engineering Student",
    description:
      "PCB design, circuit analysis, and embedded systems. University of British Columbia.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmMono.variable}`}
    >
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
