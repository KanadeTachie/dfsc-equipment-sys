import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// import Header from '../components/navbar'
import QueryProvider from "@/components/query-provider";
import { GlobalProvider } from "./GlobalProvider";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DFSC-ERS",
  description: "DFSC Equipment Reservation System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalProvider>
          <QueryProvider>
            {/* <Header /> */}
            {children}
            <Analytics />
          </QueryProvider>
        </GlobalProvider>
        <Toaster />
      </body>
    </html>
  );
}
