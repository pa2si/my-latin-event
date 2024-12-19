import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { anton, antonio } from '@/utils/fonts'
import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "./providers";
import { ClerkProvider } from "@clerk/nextjs";
import { CookiesProvider } from "next-client-cookies/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Latin Event",
  description: "Find your latin event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`debug-screens ${inter.className} ${anton.variable} ${antonio.variable}`}>
          <CookiesProvider>
            <Providers>
              <Navbar />
              <main className="container py-10">{children}</main>
            </Providers>
          </CookiesProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
