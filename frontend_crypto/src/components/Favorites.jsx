"use client"

import { useContext } from "react"
import { FavoritesContext } from "../context/FavoritesContext"
import CryptoItem from "./CryptoItem"

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext)

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h2 className="favorites-title">Your Favorites</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="card favorites-empty">
          <p>You haven't added any cryptocurrencies to your favorites yet.</p>
          <p>Click the star icon on any cryptocurrency to add it to your favorites.</p>
        </div>
      ) : (
        <div className="crypto-list">
          {favorites.map((crypto) => (
            <CryptoItem key={crypto.id} crypto={crypto} />
          ))}
        </div>
      )}
    </div>
  )
}

