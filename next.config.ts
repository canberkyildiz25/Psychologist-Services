import path from 'node:path';
import type { NextConfig } from 'next';

// Static export: the site is uploaded to Netlify as prebuilt files. Open
// hours depend on the current time, so they are worked out in the browser.
const config: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: path.resolve(__dirname) },
};

export default config;
