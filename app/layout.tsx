import type {Metadata} from 'next';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: '$ANSEM — Father of the Dog',
  description: 'Official website for $ANSEM, Father of the Dog. The origin of dog culture on Solana. CA: SPqTn8KkooByR41x3SsaNxGxXDqPFFRXR2Kkt8TJhSK',
  icons: {
    icon: '/assets/ansem-logo.png',
    apple: '/assets/ansem-logo.png',
  },
  openGraph: {
    title: '$ANSEM — Father of the Dog',
    description: 'Official website for $ANSEM, Father of the Dog. The origin of dog culture on Solana.',
    images: ['/assets/ansem-banner.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '$ANSEM — Father of the Dog',
    description: 'Official website for $ANSEM, Father of the Dog. The origin of dog culture on Solana.',
    images: ['/assets/ansem-banner.png'],
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
