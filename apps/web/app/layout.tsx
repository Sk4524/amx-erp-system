import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import RealtimeProvider
from "../components/RealtimeProvider";

import {
  Geist,
  Geist_Mono
} from "next/font/google";

import "./globals.css";

const geistSans = Geist({

  variable:
    "--font-geist-sans",

  subsets: ["latin"],
});

const geistMono = Geist_Mono({

  variable:
    "--font-geist-mono",

  subsets: ["latin"],
});

export const metadata: Metadata = {

  title: "AMX ERP",

  description:
    "Enterprise Resource Planning Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (

    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
         data-scroll-behavior="smooth"
      `}
    >

      <body
      
        className="
          min-h-screen
          bg-[#f1f5f9]
          text-slate-900
          antialiased
          overflow-x-hidden
        "
      >
        <Toaster position="top-right" />
        <RealtimeProvider />

        {children}

      </body>

    </html>
  );
}