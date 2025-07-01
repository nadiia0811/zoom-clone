import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Yoom",
  description: "Zoom clone built with Next.js, TypeScript, and Tailwind CSS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          logoImageUrl: "/icons/yoom-logo.svg",
          socialButtonsVariant: "iconButton"
        },
        variables: {
          colorText: "#FFF",
          colorPrimary: "#0E78F9",
          colorBackground: "#1C1F2E",
          colorInputBackground: "#252A41",
          colorInputText: "#FFF"
        }
      }}>
      <html lang="en" className="dark">
        <body
          className={`${inter.variable} bg-dark-2 antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
