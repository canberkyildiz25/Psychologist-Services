import { useState, useEffect, useRef } from "react";
import { fetchPsychologists } from "../../firebase/database";
import { psychologists as localData } from "../../data/psychologists";
import PsychologistCard from "../../components/PsychologistCard/PsychologistCard";
import FilterDropdown from "../../components/FilterDropdown/FilterDropdown";
import styles from "./Psychologists.module.css";

const PAGE_SIZE = 3;

function sortList(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "nameAZ":         return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "nameZA":         return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case "priceLow":       return sorted.sort((a, b) => a.price_per_hour - b.price_per_hour);
    case "priceHigh":      return sorted.sort((a, b) => b.price_per_hour - a.price_per_hour);
    case "popularityLow":  return sorted.sort((a, b) => a.rating - b.rating);
    case "popularityHigh": return sorted.sort((a, b) => b.rating - a.rating);
    default: return sorted;
  }
}

export default function Psychologists() {
  const [sortBy, setSortBy] = useState("nameAZ");
  const [allItems, setAllItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const isFirebase = useRef(false);

  useEffect(() => {
    setLoading(true);
    fetchPsychologists()
      .then((data) => {
        if (data.length > 0) {
          isFirebase.current = true;
          setAllItems(data);
        } else {
          isFirebase.current = false;
          setAllItems(localData);
        }
      })
      .catch(() => {
        isFirebase.current = false;
        setAllItems(localData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    await new Promise((r) => setTimeout(r, 300));
    setVisibleCount((prev) => prev + PAGE_SIZE);
    setLoadingMore(false);
  };

  const sorted = sortList(allItems, sortBy);
  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < allItems.length;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.toolbar}>
          <FilterDropdown value={sortBy} onChange={setSortBy} />
        </div>

        {loading && <p className={styles.loadingText}>Loading…</p>}

        {!loading && (
          <>
            <ul className={styles.list}>
              {visible.map((p) => (
                <li key={p.id}>
                  <PsychologistCard psychologist={p} />
                </li>
              ))}
            </ul>

            {hasMore && (
              <div className={styles.loadMoreWrap}>
                <button
                  className={styles.loadMoreBtn}
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
