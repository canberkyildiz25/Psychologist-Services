import type { Metadata, Viewport } from 'next';
import { Lexend, Source_Sans_3 } from 'next/font/google';
import type { ReactNode } from 'react';
import { Header } from '@/components/Chrome';
import { Footer } from '@/components/Footer';
import './globals.css';

// Lexend was drawn to be easy to read and it looks unhurried, which is the
// tone this site needs. It sets headings and controls. Source Sans 3 sets
// the running text.
const lexend = Lexend({ subsets: ['latin', 'latin-ext'], variable: '--font-lexend', display: 'swap' });
const source = Source_Sans_3({ subsets: ['latin', 'latin-ext'], variable: '--font-source', display: 'swap' });

const SITE = 'https://resilient-salmiakki-c08a67.netlify.app';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f1f5f9' },
    { media: '(prefers-color-scheme: dark)', color: '#111820' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'FIFTY · Pick the hour, then the person', template: '%s · FIFTY' },
  description:
    'A demonstration practice: ten psychologists on one timetable. See every open fifty-minute session this week, pick the hour first and the person second.',
  authors: [{ name: 'Canberk Yıldız', url: 'https://canberkyildiz.netlify.app' }],
  openGraph: {
    type: 'website',
    siteName: 'FIFTY',
    title: 'FIFTY · Pick the hour, then the person',
    description: 'Ten psychologists on one timetable. A portfolio demonstration by Canberk Yıldız.',
    url: SITE,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Two armchairs facing each other in a quiet room with slate grey walls' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

/* Runs before first paint. The page follows the system unless the visitor
   has chosen light or dark here before. */
const BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${lexend.variable} ${source.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <a className="skip-link ui" href="#main">
          Skip to the page
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
