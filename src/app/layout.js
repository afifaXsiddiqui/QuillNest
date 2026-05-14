import {
  Plus_Jakarta_Sans,
  Geist_Mono
} from "next/font/google";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: [
    "400",
    "500",
    "600",
    "700",
    "800"
  ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuillNest",
  description:
    "A premium space for stories, ideas, and thoughtful writing.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`
        ${jakarta.variable}
        ${geistMono.variable}
        h-full
        antialiased
      `}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}