import { useState, useRef, useEffect } from "react";
import styles from "./FilterDropdown.module.css";

const options = [
  { value: "nameAZ", label: "Name (A → Z)" },
  { value: "nameZA", label: "Name (Z → A)" },
  { value: "priceLow", label: "Price (Low → High)" },
  { value: "priceHigh", label: "Price (High → Low)" },
  { value: "popularityLow", label: "Popularity (Low → High)" },
  { value: "popularityHigh", label: "Popularity (High → Low)" },
];

export default function FilterDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button className={styles.trigger} onClick={() => setOpen((v) => !v)}>
        <span className={styles.filterLabel}>Filter by:</span>
        <span className={styles.filterValue}>{selected.label}</span>
        <span className={`${styles.chevron} ${open ? styles.chevronUp : ""}`}>▾</span>
      </button>
      {open && (
        <ul className={styles.menu}>
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`${styles.item} ${opt.value === value ? styles.itemActive : ""}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
              {opt.value === value && <span className={styles.check}>✓</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
