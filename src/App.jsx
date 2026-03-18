import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoritesProvider } from "./context/FavoritesContext";
import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import Psychologists from "./pages/Psychologists/Psychologists";
import Favorites from "./pages/Favorites/Favorites";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavoritesProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/psychologists" element={<Psychologists />} />
            <Route path="/favorites" element={<PrivateRoute><Favorites /></PrivateRoute>} />
          </Routes>
        </FavoritesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
