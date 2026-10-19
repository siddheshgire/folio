import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { GroupProvider } from "@/lib/groups/GroupStore";

export const metadata: Metadata = {
  title: "FOLIO — One Campus. One Library. Every Resource.",
  description: "A private, WhatsApp-like collaborative space for your friend group to chat, drop study materials, preview PDFs, and organize semester notes with multi-factor security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0B0F19] text-gray-100 antialiased selection:bg-brand-500 selection:text-white">
        <AuthProvider>
          <GroupProvider>
            {children}
          </GroupProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
