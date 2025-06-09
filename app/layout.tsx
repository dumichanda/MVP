import './globals.css';
import type { Metadata } from 'next';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ui/error-boundary';

export const metadata: Metadata = {
  title: 'Mavuso - Discover Unique Dating Experiences',
  description: 'Connect through unforgettable experiences. Find and create unique dating adventures in South Africa.',
  keywords: 'dating, experiences, South Africa, adventures, romance, activities',
  authors: [{ name: 'Mavuso Team' }],
  creator: 'Mavuso',
  publisher: 'Mavuso',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://mavuso.app'),
  openGraph: {
    title: 'Mavuso - Discover Unique Dating Experiences',
    description: 'Connect through unforgettable experiences. Find and create unique dating adventures in South Africa.',
    url: 'https://mavuso.app',
    siteName: 'Mavuso',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Mavuso - Dating Through Experiences',
      },
    ],
    locale: 'en_ZA',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mavuso - Discover Unique Dating Experiences',
    description: 'Connect through unforgettable experiences. Find and create unique dating adventures in South Africa.',
    images: ['/og-image.jpg'],
    creator: '@mavusoapp',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#EF4444" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="font-inter">
        <ErrorBoundary>
          <AuthProvider>
            <AppProvider>
              {children}
            </AppProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}