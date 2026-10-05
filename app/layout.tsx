import type { Metadata, Viewport } from 'next';
import { Albert_Sans } from 'next/font/google';
import type { ReactNode } from 'react';
import { Header } from '@/components/Chrome';
import { Footer } from '@/components/Footer';
import { AUTHOR, DESCRIPTION, SITE } from '@/lib/site';
import './globals.css';

// One family for everything. Albert Sans is a plain Scandinavian grotesque:
// quiet at text size, and light enough to set a large headline without
// raising its voice. Hierarchy comes from size and weight alone.
const albert = Albert_Sans({ subsets: ['latin', 'latin-ext'], variable: '--font-albert', display: 'swap' });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7fafd' },
    { media: '(prefers-color-scheme: dark)', color: '#111820' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'FIFTY · Pick the hour, then the person', template: '%s · FIFTY' },
  description: DESCRIPTION,
  applicationName: 'FIFTY',
  authors: [AUTHOR],
  creator: AUTHOR.name,
  formatDetection: { telephone: false, email: false, address: false },
  openGraph: {
    type: 'website',
    siteName: 'FIFTY',
    locale: 'en_GB',
    title: 'FIFTY · Pick the hour, then the person',
    description: 'Ten psychologists on one timetable. A portfolio demonstration by Canberk Yıldız.',
    url: SITE,
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Two cream armchairs facing each other in a bright, quiet room' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

/* Runs before first paint. The page follows the system unless the visitor
   has chosen light or dark here before. */
const BOOT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}})()`;

/* What a search engine may say about the site: that it is a website, and whose. */
const LD = JSON.stringify({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'FIFTY',
  url: SITE,
  description: DESCRIPTION,
  inLanguage: 'en',
  author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={albert.variable} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: LD }} />
        <a className="skip-link" href="#main">
          Skip to the page
        </a>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
