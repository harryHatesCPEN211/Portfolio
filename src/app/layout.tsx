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
  title: "Harry Nguyen — Mechatronics Engineer",
  description:
    "Portfolio of Harry Nguyen, a mechatronics engineer specializing in embedded systems, PCB design, and robotics.",
  openGraph: {
    title: "Harry Nguyen — Mechatronics Engineer",
    description:
      "Embedded systems, PCB design, and robotics. Simon Fraser University.",
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
