'use client';

import { CalendarBlank, CircleHalf, ListChecks, UsersThree } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFifty, useHydrated } from '@/lib/store';

/** The mark: fifty minutes of the hour, drawn as five sixths of a clock face. */
export function Mark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeDasharray="47.12 56.55" transform="rotate(-90 12 12)" />
    </svg>
  );
}

function ThemeToggle() {
  const flip = () => {
    const root = document.documentElement;
    const dark = root.dataset.theme ? root.dataset.theme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    const next = dark ? 'light' : 'dark';
    root.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* private mode: the choice lasts for this page view only */
    }
  };
  return (
    <button type="button" className="icon-btn" onClick={flip} aria-label="Switch between light and dark" title="Switch between light and dark">
      <CircleHalf size={22} weight="fill" aria-hidden="true" />
    </button>
  );
}

export function Header() {
  const path = usePathname().replace(/\/$/, '') || '/';
  const hydrated = useHydrated();
  const requests = useFifty((state) => state.requests.length);
  const count = hydrated ? requests : 0;

  return (
    <header className="site-header">
      <div className="wrap site-header__row">
        <Link className="wordmark" href="/" aria-label="FIFTY, home">
          <Mark />
          FIFTY
        </Link>
        <div className="site-header__end">
          <nav className="site-nav" aria-label="Primary">
            <Link href="/#hours" aria-current={path === '/' ? 'page' : undefined}>
              <CalendarBlank size={22} aria-hidden="true" />
              <span className="nav-long">Open hours</span>
              <span className="nav-short">Hours</span>
            </Link>
            <Link href="/people/" aria-current={path.startsWith('/people') ? 'page' : undefined}>
              <UsersThree size={22} aria-hidden="true" />
              <span className="nav-long">Psychologists</span>
              <span className="nav-short">People</span>
            </Link>
            <Link href="/requests/" aria-current={path === '/requests' ? 'page' : undefined}>
              <ListChecks size={22} aria-hidden="true" />
              <span>Requests</span>
              {count > 0 && (
                <span className="count" aria-label={`${count} made`}>
                  {count}
                </span>
              )}
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
