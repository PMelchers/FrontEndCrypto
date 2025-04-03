"use client"

import { useState, useEffect } from "react"
import { fetchTrendingCoins, fetchMarketData } from "../services/api"
import CryptoList from "../components/Cryptolist"
import SearchBar from "../components/SearchBar"
import TrendChart from "../components/TrendChart"
import MarketShareChart from "../components/MarketShareChart"
import Favorites from "../components/Favorites"
import CryptoTable from "../components/CryptoTable"

export default function Home() {
  const [cryptos, setCryptos] = useState([])
  const [filteredCryptos, setFilteredCryptos] = useState([])
  const [trendingCoins, setTrendingCoins] = useState([])
  const [bitcoinChartData, setBitcoinChartData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch market data
        const marketData = await fetchMarketData()
        setCryptos(marketData)
        setFilteredCryptos(marketData)

        // Fetch trending coins
        const trending = await fetchTrendingCoins()
        setTrendingCoins(trending)

        // Fetch Bitcoin chart data for the last 7 days
        const bitcoinData = await fetch(
          "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7",
        ).then((res) => res.json())

        setBitcoinChartData(bitcoinData.prices)

        setIsLoading(false)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err.message)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearch = (searchTerm) => {
    if (!searchTerm) {
      setFilteredCryptos(cryptos);
      return;
    }

    const filtered = cryptos.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setFilteredCryptos(filtered);
  };

  if (isLoading) {
    return (
      <div className="container main-content">
        <div className="loading">
          <p>Loading cryptocurrency data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container main-content">
        <div className="error">
          <p>Error loading data: {error}</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container main-content">
      <div className="home-header">
        <h1 className="page-title">Cryptocurrency Market</h1>
        <p className="page-description">
          Track prices, market cap, and volume for thousands of cryptocurrencies in real-time.
        </p>
      </div>

      {/* Trending Coins Section */}
      <div className="trending-section card">
        <div className="card-header">
          <h2 className="card-title">Trending Coins</h2>
        </div>
        <div className="trending-list">
          {trendingCoins.map((coin) => (
            <div key={coin.item.id} className="trending-item">
              <img
                src={coin.item.small || "/placeholder.svg"}
                alt={`${coin.item.name} logo`}
                className="trending-icon"
              />
              <div className="trending-info">
                <div className="trending-name">{coin.item.name}</div>
                <div className="trending-symbol">{coin.item.symbol}</div>
              </div>
              <div className="trending-rank">#{coin.item.market_cap_rank}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-main">

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Market Share</h2>
            </div>
            {cryptos.length > 0 && <MarketShareChart data={cryptos.slice(0, 10)} />}
          </div>

          <Favorites />

          <SearchBar onSearch={handleSearch} />

          <div className="card">
            <div className="card-header">
              <h2 className="card-title">All Cryptocurrencies</h2>
            </div>
            <CryptoTable cryptos={filteredCryptos} />
          </div>
        </div>
      </div>
    </div>
  )
}

