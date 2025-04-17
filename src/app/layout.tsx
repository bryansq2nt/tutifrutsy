import type { Metadata } from "next/types";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./context/LanguageContext";
import BackgroundMusic from "./components/BackgroundMusic";
import Link from "next/link";
import ClientLanguageSwitcher from "./components/ClientLanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tutifrutsy - Productos Salvadoreños",
  description: "Descubre los mejores productos de El Salvador",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-white`}
      >
        <LanguageProvider>
          <header className="bg-white shadow-sm">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
              <Link 
                href="/" 
                className="text-2xl font-bold text-orange-600 hover:text-orange-700 transition-colors"
              >
                Tutifrutsy
              </Link>
              <ClientLanguageSwitcher />
            </div>
          </header>
          <main>{children}</main>
          <BackgroundMusic />
        </LanguageProvider>
      </body>
    </html>
  );
}
