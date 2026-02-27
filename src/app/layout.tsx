import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sonance Best Buy Dashboard",
  description: "Product analytics for Sonance products on Best Buy",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
