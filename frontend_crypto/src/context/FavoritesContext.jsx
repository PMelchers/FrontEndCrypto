import { createContext, useState, useEffect } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    setFavorites(storedFavorites);
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (crypto) => {
    if (!crypto || !crypto.id) return; // Ensure the crypto object is valid
    console.log("Toggling favorite:", crypto); // Debugging log
    setFavorites((prev) =>
      prev.some((fav) => fav.id === crypto.id)
        ? prev.filter((fav) => fav.id !== crypto.id)
        : [...prev, crypto]
    );
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
