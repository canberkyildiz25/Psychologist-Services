import type { MetadataRoute } from 'next';
import { DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FIFTY',
    short_name: 'FIFTY',
    description: DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#f7fafd',
    theme_color: '#f7fafd',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
