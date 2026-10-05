import type { Metadata } from 'next';
import { Directory } from '@/components/Directory';

export const metadata: Metadata = {
  title: 'Psychologists',
  description: 'The ten psychologists of FIFTY, a demonstration practice: what each works with, how they meet, their fee and their next free hour.',
  alternates: { canonical: '/people/' },
};

export default function People() {
  return (
    <main id="main" className="wrap">
      <div className="page-head">
        <h1>Ten psychologists</h1>
        <p>Everyone here keeps the same fifty-minute hour. Narrow the list by what you need, or put whoever is free soonest at the top.</p>
      </div>
      <Directory />
      <div className="page-foot" />
    </main>
  );
}
