"use client";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FavoritesContext } from "../context/FavoritesContext";

export default function CryptoTable({ cryptos }) {
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useContext(FavoritesContext);

  const handleRowClick = (id) => {
    navigate(`/coin/${id}`);
  };

  const handleFavoriteClick = (e, crypto) => {
    e.stopPropagation(); // Prevent the row click event
    toggleFavorite(crypto); // Pass the full crypto object
  };

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
    <div className="card">
      <table className="crypto-table">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Price</th>
            <th>24h Change</th>
            <th>Market Cap</th>
            <th>Volume (24h)</th>
          </tr>
        </thead>
        <tbody>
          {cryptos.map((crypto) => {
            const isFavorite = favorites.includes(crypto.id);

            return (
              <tr key={crypto.id} className="crypto-table-row" onClick={() => handleRowClick(crypto.id)}>
                <td>
                  <button
                    className="btn btn-icon"
                    onClick={(e) => handleFavoriteClick(e, crypto)}
                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                  >
                    {isFavorite ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                        width="16"
                        height="16"
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
                </td>
                <td>
                  <div className="crypto-table-name">
                    <img
                      src={crypto.image || "/placeholder.svg"}
                      alt={`${crypto.name} logo`}
                      className="crypto-icon"
                    />
                    <div>
                      <div className="crypto-name">{crypto.name}</div>
                      <div className="crypto-symbol">{crypto.symbol.toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td>${crypto.current_price.toLocaleString()}</td>
                <td className={crypto.price_change_percentage_24h >= 0 ? "crypto-change positive" : "crypto-change negative"}>
                  {crypto.price_change_percentage_24h < 0
                    ? `-${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%`
                    : `${crypto.price_change_percentage_24h.toFixed(2)}%`}
                </td>
                <td>{formatMarketCap(crypto.market_cap)}</td>
                <td>{formatMarketCap(crypto.total_volume)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

