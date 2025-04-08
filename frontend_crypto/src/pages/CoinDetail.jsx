"use client"

import { useState, useEffect, useContext } from "react"
import { useParams } from "react-router-dom"
import { FavoritesContext } from "../context/FavoritesContext"
import DetailedPriceChart from "../components/DetailedPriceChart"

export default function CoinDetail() {
  const { id } = useParams()
  const { favorites, toggleFavorite } = useContext(FavoritesContext)
  const [coin, setCoin] = useState(null)
  const [chartData, setChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const isFavorite = favorites.some((fav) => fav.id === id)

  useEffect(() => {
    const fetchCoinData = async () => {
      try {
        setIsLoading(true)

        const coinResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`,
        )

        if (!coinResponse.ok) {
          throw new Error(`Failed to fetch coin data: ${coinResponse.status}`)
        }

        const coinData = await coinResponse.json()
        setCoin(coinData)

        const chartResponse = await fetch(
          `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=90`,
        )

        if (!chartResponse.ok) {
          throw new Error(`Failed to fetch chart data: ${chartResponse.status}`)
        }

        const chartData = await chartResponse.json()
        setChartData(chartData.prices)

        setIsLoading(false)
      } catch (err) {
        console.error("Error in fetchCoinData:", err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchCoinData()
  }, [id])

  const handleFavoriteClick = () => {
    if (coin) {
      toggleFavorite(coin)
    }
  }

  const formatNumber = (num) => {
    if (num >= 1e12) {
      return `${(num / 1e12).toFixed(2)}T`
    } else if (num >= 1e9) {
      return `${(num / 1e9).toFixed(2)}B`
    } else if (num >= 1e6) {
      return `${(num / 1e6).toFixed(2)}M`
    } else {
      return `${num.toLocaleString()}`
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
    (coin.market_data?.price_change_percentage_24h || 0) >= 0 ? "crypto-change positive" : "crypto-change negative"

  return (
    <div className="container main-content">
      <div className="coin-detail">
        <div className="coin-detail-main">
          <div className="coin-header">
            <img src={coin.image?.small || "/placeholder.svg"} alt={`${coin.name} logo`} className="coin-icon" />
            <div>
              <h1 className="coin-title">{coin.name}</h1>
              <span className="coin-symbol">{coin.symbol?.toUpperCase()}</span>
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
            <div className="coin-current-price">
              ${coin.market_data?.current_price?.usd?.toLocaleString() || "N/A"}
            </div>
            <div className={priceChangeClass}>
              {(coin.market_data?.price_change_percentage_24h || 0) >= 0 ? (
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
              {Math.abs(coin.market_data?.price_change_percentage_24h || 0).toFixed(2)}%
            </div>
          </div>

          {chartData.length > 0 && <DetailedPriceChart data={chartData} coinId={id} />}

          {coin.description?.en && (
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
                <div className="coin-stat-value">{formatNumber(coin.market_data?.market_cap?.usd || 0)}</div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">24h Trading Volume</div>
                <div className="coin-stat-value">{formatNumber(coin.market_data?.total_volume?.usd || 0)}</div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Fully Diluted Valuation</div>
                <div className="coin-stat-value">
                  {coin.market_data?.fully_diluted_valuation?.usd
                    ? formatNumber(coin.market_data.fully_diluted_valuation.usd)
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Circulating Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data?.circulating_supply?.toLocaleString() || "N/A"} {coin.symbol?.toUpperCase()}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Total Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data?.total_supply
                    ? `${coin.market_data.total_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">Max Supply</div>
                <div className="coin-stat-value">
                  {coin.market_data?.max_supply
                    ? `${coin.market_data.max_supply.toLocaleString()} ${coin.symbol?.toUpperCase()}`
                    : "N/A"}
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">All-Time High</div>
                <div className="coin-stat-value">
                  ${coin.market_data?.ath?.usd?.toLocaleString() || "N/A"}
                  <span className="coin-ath-change">
                    ({(coin.market_data?.ath_change_percentage?.usd || 0).toFixed(2)}%)
                  </span>
                </div>
              </div>
              <div className="coin-stat-card">
                <div className="coin-stat-title">All-Time Low</div>
                <div className="coin-stat-value">
                  ${coin.market_data?.atl?.usd?.toLocaleString() || "N/A"}
                  <span className="coin-atl-change">
                    ({(coin.market_data?.atl_change_percentage?.usd || 0).toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
