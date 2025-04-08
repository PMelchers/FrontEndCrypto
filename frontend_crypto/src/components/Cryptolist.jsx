import CryptoItem from "./CryptoItem"

const CryptoList = ({ cryptoData = [], searchQuery = "" }) => {
  if (cryptoData.length === 0) {
    return <div>No cryptocurrencies found.</div>
  }

  return (
    <div className="crypto-list">
      {cryptoData
        .filter((crypto) => crypto.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((crypto) => (
          <CryptoItem key={crypto.id} crypto={crypto} />
        ))}
    </div>
  )
}

export default CryptoList
