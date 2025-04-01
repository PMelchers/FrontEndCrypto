"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { useState } from "react"
import { FavoritesContext } from "./context/FavoritesContext"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import CoinDetail from "./pages/CoinDetail"

function App() {
  const [favorites, setFavorites] = useState(() => {
    const savedFavorites = localStorage.getItem("favorites")
    return savedFavorites ? JSON.parse(savedFavorites) : []
  })

  const addFavorite = (crypto) => {
    const newFavorites = [...favorites, crypto]
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  const removeFavorite = (id) => {
    const newFavorites = favorites.filter((crypto) => crypto.id !== id)
    setFavorites(newFavorites)
    localStorage.setItem("favorites", JSON.stringify(newFavorites))
  }

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </FavoritesContext.Provider>
  )
}

export default App

