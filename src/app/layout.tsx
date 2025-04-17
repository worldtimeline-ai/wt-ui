import type { Metadata } from "next";
import Clarity from '@microsoft/clarity';
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "World Timeline",
  description: "Interactive visualization of world timeline across different time periods",
  generator: 'Next.js',
  manifest: '/manifest.json',
  keywords: ['nextjs', 'nextjs14', 'next14', 'pwa', 'next-pwa'],
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#fff' }],
  authors: [
    { name: 'Vikash Kumar' },
    {
      name: 'Vikash Kumar',
      url: 'https://www.linkedin.com/in/sharma-vikashkr/',
    },
  ],
  viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
  icons: [
    { rel: 'apple-touch-icon', url: 'icons/icon.png' },
    { rel: 'icon', url: 'icons/icon.png' },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  Clarity.init(process.env.NEXT_PUBLIC_MS_CLARITY_PROJECT_ID ?? '');
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
