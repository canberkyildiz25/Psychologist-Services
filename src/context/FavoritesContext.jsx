import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext();

const getStorageKey = (uid) => `favorites_${uid}`;

export function FavoritesProvider({ children }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(getStorageKey(user.uid));
      setFavorites(stored ? JSON.parse(stored) : []);
    } else {
      setFavorites([]);
    }
  }, [user]);

  const persist = (updated) => {
    if (user) {
      localStorage.setItem(getStorageKey(user.uid), JSON.stringify(updated));
    }
  };

  const toggleFavorite = (psychologist) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === psychologist.id);
      const updated = exists
        ? prev.filter((p) => p.id !== psychologist.id)
        : [...prev, psychologist];
      persist(updated);
      return updated;
    });
  };

  const isFavorite = (id) => favorites.some((p) => p.id === id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);
