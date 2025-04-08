import axios from "axios"

const API_BASE_URL = "https://api.coingecko.com/api/v3"

/**
 * Validates and normalizes cryptocurrency data
 * @param {Array} data - Raw cryptocurrency data from API
 * @returns {Array} - Normalized cryptocurrency data
 */
const validateCryptoData = (data) => {
  return data.map((coin) => ({
    id: coin.id || "N/A",
    image: coin.image || "",
    name: coin.name || "N/A",
    symbol: coin.symbol || "N/A",
    current_price: coin.current_price || 0,
    price_change_percentage_1h_in_currency: coin.price_change_percentage_1h_in_currency || 0,
    price_change_percentage_24h: coin.price_change_percentage_24h || 0,
    price_change_percentage_24h_in_currency: coin.price_change_percentage_24h_in_currency || 0,
    price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency || 0,
    market_cap: coin.market_cap || 0,
    total_volume: coin.total_volume || 0,
    circulating_supply: coin.circulating_supply || 0,
    sparkline_in_7d: coin.sparkline_in_7d || { price: [] },
  }))
}

/**
 * Fetches cryptocurrency list from CoinGecko API
 * @returns {Promise<Array>} - List of cryptocurrencies
 */
export const getCryptoList = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: "eur",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: true,
        price_change_percentage: "1h,24h,7d",
      },
    })
    console.log(response.data) // Log the API response
    return validateCryptoData(response.data)
  } catch (error) {
    console.error("Error fetching crypto data:", error)
    return []
  }
}

/**
 * Fetches detailed information for a specific coin
 * @param {string} coinId - Coin identifier
 * @returns {Promise<Object|null>} - Detailed coin information
 */
export const getCoinDetails = async (coinId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}`, {
      params: {
        localization: false,
        tickers: false,
        market_data: true,
        community_data: false,
        developer_data: false,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching details for coin ${coinId}:`, error)
    return null
  }
}

/**
 * Fetches market data for cryptocurrencies
 * @returns {Promise<Array>} - Market data for cryptocurrencies
 */
export const fetchMarketData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/markets`, {
      params: {
        vs_currency: "usd",
        order: "market_cap_desc",
        per_page: 100,
        page: 1,
        sparkline: true,
      },
    })
    return response.data
  } catch (error) {
    console.error("Error fetching market data:", error)
    throw new Error("Failed to fetch market data")
  }
}

/**
 * Fetches trending coins from CoinGecko API
 * @returns {Promise<Array>} - List of trending coins
 */
export const fetchTrendingCoins = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/search/trending`)
    return response.data.coins
  } catch (error) {
    console.error("Error fetching trending coins:", error)
    return []
  }
}

/**
 * Fetches historical price data for a specific coin
 * @param {string} coinId - Coin identifier
 * @param {number} days - Number of days of historical data
 * @param {string} currency - Currency for price data (default: usd)
 * @returns {Promise<Object>} - Historical price data
 */
export const fetchCoinChartData = async (coinId, days = 7, currency = "usd") => {
  try {
    const response = await axios.get(`${API_BASE_URL}/coins/${coinId}/market_chart`, {
      params: {
        vs_currency: currency,
        days: days,
      },
    })
    return response.data
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error)
    throw new Error(`Failed to fetch chart data for ${coinId}`)
  }
}

/**
 * Fetches global cryptocurrency market data
 * @returns {Promise<Object>} - Global market data
 */
export const fetchGlobalMarketData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/global`)
    return response.data.data
  } catch (error) {
    console.error("Error fetching global market data:", error)
    return null
  }
}
