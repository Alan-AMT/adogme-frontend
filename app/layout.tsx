import BubbleChatbot from "@/modules/chatbot/components/bubbleChatbot";
import Footer from "@/modules/home/components/Footer"; // Ruta actualizada
import AdogmeHeader from "@/modules/home/components/header";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";

import "@/modules/home/styles/footer.css";
import "@/modules/home/styles/hero.css";
import "@/modules/home/styles/homeDogs.css";
import "@/modules/home/styles/homeHowItWorks.css";
import "@/modules/home/styles/homeShelters.css";
import "@/modules/home/styles/homeStories.css";

import "@/modules/auth/styles/auth.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Adogme - Adopción Responsable",
  description: "Encuentra a tu mejor amigo en la Gustavo A. Madero",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-theme="mytheme">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <AdogmeHeader />

        {/* flex-grow asegura que el footer siempre baje al final */}
        <main className="flex-grow">
          {children}
        </main>

        <Footer />

        <BubbleChatbot />
      </body>
    </html>
  );
}
