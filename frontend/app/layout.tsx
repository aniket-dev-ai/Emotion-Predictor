import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emotion AI",
  description: "A deep-learning based emotion classification system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Add className="dark" right here 👇
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
