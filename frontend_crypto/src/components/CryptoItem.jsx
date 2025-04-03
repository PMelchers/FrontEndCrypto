"use client";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

export default function CryptoItem({ crypto }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const isFavorite = favorites.some((fav) => fav.id === crypto.id);

  const handleClick = () => {
    navigate(`/coin/${crypto.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent the parent click event
    toggleFavorite(crypto); // Pass the full crypto object
  };

  const priceChangeClass =
    (crypto.price_change_percentage_24h || 0) >= 0 ? "crypto-change positive" : "crypto-change negative";

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    } else {
      return `$${marketCap.toFixed(2)}`;
    }
  };

  return (
    <div className="crypto-item" onClick={handleClick}>
      <div className="crypto-item-header">
        <div className="crypto-info">
          <img
            src={crypto.image || "/placeholder.svg"}
            alt={`${crypto.name || "N/A"} logo`}
            className="crypto-icon"
          />
          <div>
            <div className="crypto-name">{crypto.name || "N/A"}</div>
            <div className="crypto-symbol">{crypto.symbol?.toUpperCase() || "N/A"}</div>
          </div>
        </div>
        <button
          className="btn btn-icon"
          onClick={handleFavoriteClick}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {isFavorite ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="#f59e0b" /* Filled star for favorite */
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none" /* Empty star for non-favorite */
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
            </svg>
          )}
        </button>
      </div>
      <div className="crypto-price">${crypto.current_price?.toLocaleString() || "N/A"}</div>
      <div className={priceChangeClass}>
        {crypto.price_change_percentage_24h < 0
          ? `-${Math.abs(crypto.price_change_percentage_24h || 0).toFixed(2)}%`
          : `${crypto.price_change_percentage_24h?.toFixed(2) || "0.00"}%`}
      </div>
      <div className="crypto-market-cap">Market Cap: {formatMarketCap(crypto.market_cap || 0)}</div>
      <div className="crypto-volume">24h Volume: {formatMarketCap(crypto.total_volume || 0)}</div>
    </div>
  );
}

