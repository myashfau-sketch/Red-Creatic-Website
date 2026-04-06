import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { ThemeProvider } from '../context/ThemeContext';
import StartupIntro from '../components/common/StartupIntro';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Red Creatic',
    template: 'Red Creatic | %s',
  },
  description: 'Red Creatic Maldives printing, signage, branding, gallery, products, and project showcase.',
  icons: {
    icon: [
      {
        url: '/assets/images/logo-only.png',
        type: 'image/png',
      },
    ],
    shortcut: ['/assets/images/logo-only.png'],
    apple: ['/assets/images/logo-only.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <StartupIntro />
          {children}
        </ThemeProvider>
</body>
    </html>
  );
}
