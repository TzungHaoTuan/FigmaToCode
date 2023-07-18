import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import Header from "@/components/header";

export const metadata = {
  title: "Figma to Code",
  description: "Accelerate Layout Creation with Effortless Conversion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={inter.className}>
        <Header />
        <div className="box-border"></div>
        {children}
      </body>
    </html>
  );
}
