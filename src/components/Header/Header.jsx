import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import AuthModal from "../AuthModal/AuthModal";
import styles from "./Header.module.css";

export default function Header() {
  const { user, logout } = useAuth();
  const { favorites } = useFavorites();
  const [authModal, setAuthModal] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          <NavLink to="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoOrange}>psychologists</span>
            <span className={styles.logoDot}>.services</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className={styles.nav}>
            <NavLink to="/" end className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>Home</NavLink>
            <NavLink to="/psychologists" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>Psychologists</NavLink>
            {user && (
              <NavLink to="/favorites" className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`}>
                Favorites
                {favorites.length > 0 && <span className={styles.badge}>{favorites.length}</span>}
              </NavLink>
            )}
          </nav>

          <div className={styles.authArea}>
            {user ? (
              <>
                <div className={styles.userAvatar}>{(user.displayName || user.email).charAt(0).toUpperCase()}</div>
                <span className={styles.userName}>{user.displayName || user.email}</span>
                <button className={styles.logoutBtn} onClick={logout}>Log out</button>
              </>
            ) : (
              <>
                <button className={styles.loginBtn} onClick={() => setAuthModal("login")}>Log In</button>
                <button className={styles.registerBtn} onClick={() => setAuthModal("register")}>Registration</button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className={styles.burger}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLine1Open : ""}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLine2Open : ""}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLine3Open : ""}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className={styles.mobileMenu}>
            <NavLink to="/" end className={styles.mobileLink} onClick={closeMenu}>Home</NavLink>
            <NavLink to="/psychologists" className={styles.mobileLink} onClick={closeMenu}>Psychologists</NavLink>
            {user && (
              <NavLink to="/favorites" className={styles.mobileLink} onClick={closeMenu}>
                Favorites {favorites.length > 0 && `(${favorites.length})`}
              </NavLink>
            )}
            <div className={styles.mobileDivider} />
            {user ? (
              <button className={styles.mobileLogout} onClick={() => { logout(); closeMenu(); }}>Log out</button>
            ) : (
              <div className={styles.mobileAuth}>
                <button className={styles.loginBtn} onClick={() => { setAuthModal("login"); closeMenu(); }}>Log In</button>
                <button className={styles.registerBtn} onClick={() => { setAuthModal("register"); closeMenu(); }}>Registration</button>
              </div>
            )}
          </div>
        )}
      </header>

      {authModal && <AuthModal mode={authModal} onClose={() => setAuthModal(null)} />}
    </>
  );
}
