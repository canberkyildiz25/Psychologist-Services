'use client';

import { useState } from 'react';
import { useFifty } from '@/lib/store';

/** Removes everything this site keeps in the browser: requests, shortlist
    and the light or dark choice. */
export function EraseButton() {
  const [erased, setErased] = useState(false);
  const reset = useFifty((state) => state.reset);

  const erase = () => {
    reset();
    useFifty.persist.clearStorage();
    try {
      localStorage.removeItem('theme');
    } catch {
      /* storage is blocked, so there was nothing to remove */
    }
    delete document.documentElement.dataset.theme;
    setErased(true);
  };

  return (
    <>
      <button type="button" className="btn btn--quiet" onClick={erase}>
        Erase what this site has stored
      </button>
      <p className="about__status" role="status">
        {erased && 'Erased. Nothing from FIFTY is stored in this browser now.'}
      </p>
    </>
  );
}
