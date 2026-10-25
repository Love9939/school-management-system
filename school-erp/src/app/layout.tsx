import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Vidyoday ERP | CBSE K-12 Next-Gen Cloud Platform",
  description: "Unified Indian K-12 CBSE ERP solving portal duplication (UDISE+, APAAR, LOC), NEP 2020 360° HPC, double-entry fee ledger with WhatsApp UPI recovery, 7:30 AM biometric auto-substitution, and AIS-140 RFID student safety.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased min-h-screen bg-[#fbfbf9] text-[#33332e] selection:bg-[#e60023] selection:text-white">
        {children}
      </body>
    </html>
  );
}
