import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreShell from "@/components/StoreShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gordo Ryders | Equipamiento, Cascos y Accesorios para Motociclistas",
  description: "Tienda oficial Gordo Ryders en Colombia. Cascos certificados ECE 22.06, guantes Proviker Ref E44, impermeables siliconados, protecciones y distribución mayorista.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-neutral-950 text-white selection:bg-orange-500 selection:text-neutral-950">
        <StoreShell>{children}</StoreShell>
      </body>
    </html>
  );
}
