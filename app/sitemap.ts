import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

/* Only the pages a search engine should list. The profiles are of people who
   do not exist and the requests page is private to a browser, so both stay out. */
export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/people/', '/about/'].map((path) => ({ url: `${SITE}${path}` }));
}
