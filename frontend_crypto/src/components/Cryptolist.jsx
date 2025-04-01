import CryptoItem from './CryptoItem';

const CryptoList = ({ cryptoData = [], searchQuery = '' }) => {
  if (cryptoData.length === 0) {
    return <div>No cryptocurrencies found.</div>;
  }

  return (
    <div className="crypto-list">
      {cryptoData
        .filter((coin) => coin.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .map((coin) => (
          <CryptoItem key={coin.id} coin={coin} />
        ))}
    </div>
  );
};

export default CryptoList;
