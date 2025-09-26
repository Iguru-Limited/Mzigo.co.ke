import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { ToastProvider } from "@/components/ToastProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Mzigo",
    template: "%s | Mzigo"
  },
  description: "Mzigo - Your trusted package delivery and tracking solution",
  keywords: ["package delivery", "tracking", "logistics", "shipping"],
  authors: [{ name: "Mzigo Team" }],
  creator: "Mzigo",
  publisher: "Mzigo",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ToastProvider>
          {/* Header always on top */}
          <Header />
          {/* Page Content */}
          <main className="min-h-screen bg-white">
            <div className="p-3 sm:p-4 lg:p-6 container mx-auto">{children}</div>
          </main>
        </ToastProvider>
      </body>
    </html>
  );
}
