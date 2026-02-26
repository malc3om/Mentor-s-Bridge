import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Virtual Mentor Bridge",
  description: "Connect. Learn. Grow. Bridge the gap between mentors and mentees.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased min-h-screen flex flex-col font-mono`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
