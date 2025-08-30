import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "GreenGenius Bot",
  description:
    "A chatbot for generating invoices to help individuals and businesses streamline their billing processes.",
  icons: {
    icon: "/images/png_logo.png",       // 32×32 or 48×48 PNG works best
    shortcut: "/images/png_logo.png",   // for older browsers
    apple: "/images/png_logo.png",      // for iOS home screen
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ...existing code... */}
        {children}
      </body>
    </html>
  );
}
