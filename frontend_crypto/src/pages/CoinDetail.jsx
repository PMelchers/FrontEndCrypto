"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { FavoritesContext } from "../context/FavoritesContext"
import DetailedPriceChart from "../components/DetailedPriceChart"

export default function CoinDetail() {
  const { id } = useParams()
  const { favorites, addFavorite, removeFavorite } = useContext(FavoritesContext)
  const [coin, setCoin] = useState(null)
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isFavorite = favorites.some((fav) => fav.id === id)

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setIsLoading(true)

        // Fetch coin details
        const coinResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        )

        if (!coinResponse.ok) {
          throw new Error("Failed to fetch coin data")
        }

        const coinData = await coinResponse.json()
        setCoin(coinData)

        // Fetch chart data
        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=90`,
        )

        if (!chartResponse.ok) {
          throw new Error("Failed to fetch chart data")
        }

        const chartData = await chartResponse.json()
        setChartData(chartData.prices)

        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchCoinData()
  }, [id])

  const handleFavoriteClick = () => {
    if (isFavorite) {
      removeFavorite(id)
    } else if (coin) {
      const simplifiedCoin = {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image.small,
        current_price: coin.market_data.current_price.usd,
        price_change_percentage_24h: coin.market_data.price_change_percentage_24h,
        market_cap: coin.market_data.market_cap.usd,
        total_volume: coin.market_data.total_volume.usd,
      }
      addFavorite(simplifiedCoin)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return `$${(num / 1e12).toFixed(2)}T`
    } else if (num >= 1e9) {
      return `$${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `$${(num / 1e6).toFixed(2)}M`
    } else {
      return `$${num.toLocaleString()}`
    }
  }

  if (isLoading) {
    return (
      <div className="container main-content">
        <div className="loading">
          <p>Loading coin data...</p>
        </div>
      </div>
    )
  }

  if (error || !coin) {
    return (
      <div className="container main-content">
        <div className="error">
          <p>Error loading data: {error || "Coin not found"}</p>
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const priceChangeClass =
    coin.market_data.price_change_percentage_24h >= 0 ? "crypto-change positive" : "crypto-change negative"

  return (
    <div className="container main-content">
      <div className="coin-detail">
        <div className="coin-detail-main">
          <div className="coin-header">
            <img src={coin.image.small || "/placeholder.svg"} alt={`${coin.name} logo`} className="coin-icon" />
            <div>
              <h1 className="coin-title">{coin.name}</h1>
              <span className="coin-symbol">{coin.symbol.toUpperCase()}</span>
            </div>
            <button
              className="btn btn-icon"
              onClick={handleFavoriteClick}
              aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorite ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="#f59e0b"
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
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
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

          <div className="coin-price-container">
            <div className="coin-current-price">${coin.market_data.current_price.usd.toLocaleString()}</div>
            <div className={priceChangeClass}>
              {coin.market_data.price_change_percentage_24h >= 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="18 15 12 9 6 15"></polyline>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              )}
              {Math.abs(coin.market_data.price_change_percentage_24h).toFixed(2)}%
            </div>
          </div>

          {chartData.length > 0 && <DetailedPriceChart data={chartData} coinId={id} />}

          {coin.description.en && (
            <div className="card coin-description">
              <div className="card-header">
                <h2 className="card-title">About {coin.name}</h2>
              </div>
              <div dangerouslySetInnerHTML={{ __html: coin.description.en }} />
            </div>
          )}
        </div>

        <div className="coin-detail-sidebar">
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Market Stats</h2>
            </div>
            <div className="coin-stats">
              <div className="coin-stat-card">
                <div className="coin-stat-title">Market Cap</div>
                <div className="coin-stat-value">{formatNumber(coin.market_data.market_cap.usd)}</div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">24h Trading Volume</div>
                <div className="coin-stat-value">{formatNumber(coin.market_data.total_volume.usd)}</div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Fully Diluted Valuation</div>
                <div className="coin-stat-value">
                  {coin.market_data.fully_diluted_valuation?.usd
                    ? formatNumber(coin.market_data.fully_diluted_valuation.usd)
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Circulating Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data.circulating_supply.toLocaleString()} {coin.symbol.toUpperCase()}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Total Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data.total_supply
                    ? `${coin.market_data.total_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Max Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data.max_supply
                    ? `${coin.market_data.max_supply.toLocaleString()} ${coin.symbol.toUpperCase()}`
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">All-Time High</div>
                <div className="coin-stat-value">
                  ${coin.market_data.ath.usd.toLocaleString()}
                  <span className="coin-ath-change">({coin.market_data.ath_change_percentage.usd.toFixed(2)}%)</span>
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">All-Time Low</div>
                <div className="coin-stat-value">
                  ${coin.market_data.atl.usd.toLocaleString()}
                  <span className="coin-atl-change">({coin.market_data.atl_change_percentage.usd.toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Price Change</h2>
            </div>
            <div className="coin-price-changes">
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">24h</div>
                <div className={coin.market_data.price_change_percentage_24h >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_24h.toFixed(2)}%
                </div>
              </div>
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">7d</div>
                <div className={coin.market_data.price_change_percentage_7d >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_7d.toFixed(2)}%
                </div>
              </div>
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">14d</div>
                <div className={coin.market_data.price_change_percentage_14d >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_14d.toFixed(2)}%
                </div>
              </div>
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">30d</div>
                <div className={coin.market_data.price_change_percentage_30d >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_30d.toFixed(2)}%
                </div>
              </div>
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">60d</div>
                <div className={coin.market_data.price_change_percentage_60d >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_60d.toFixed(2)}%
                </div>
              </div>
              <div className="coin-price-change-item">
                <div className="coin-price-change-label">1y</div>
                <div className={coin.market_data.price_change_percentage_1y >= 0 ? "positive" : "negative"}>
                  {coin.market_data.price_change_percentage_1y
                    ? coin.market_data.price_change_percentage_1y.toFixed(2)
                    : "N/A"}
                  %
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Additional Info</h2>
            </div>
            <div className="coin-additional-info">
              <div className="coin-info-item">
                <div className="coin-info-label">Website</div>
                <div className="coin-info-value">
                  {coin.links.homepage[0] ? (
                    <a href={coin.links.homepage[0]} target="_blank" rel="noopener noreferrer">
                      {coin.links.homepage[0].replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="coin-info-item">
                <div className="coin-info-label">Explorer</div>
                <div className="coin-info-value">
                  {coin.links.blockchain_site[0] ? (
                    <a href={coin.links.blockchain_site[0]} target="_blank" rel="noopener noreferrer">
                      {coin.links.blockchain_site[0].replace(/(^\w+:|^)\/\//, "").replace(/\/$/, "")}
                    </a>
                  ) : (
                    "N/A"
                  )}
                </div>
              </div>
              <div className="coin-info-item">
                <div className="coin-info-label">Community</div>
                <div className="coin-info-value coin-social-links">
                  {coin.links.twitter_screen_name && (
                    <a
                      href={`https://twitter.com/${coin.links.twitter_screen_name}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                      </svg>
                    </a>
                  )}
                  {coin.links.subreddit_url && (
                    <a href={coin.links.subreddit_url} target="_blank" rel="noopener noreferrer">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10"></circle>
                        <circle cx="12" cy="12" r="4"></circle>
                        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                        <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                        <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                      </svg>
                    </a>
                  )}
                  {coin.links.facebook_username && (
                    <a
                      href={`https://facebook.com/${coin.links.facebook_username}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

