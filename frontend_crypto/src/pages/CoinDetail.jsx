import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCoinDetails } from '../services/api';
import '../styles.css'; // Import the updated CSS file

const CoinDetailPage = () => {
  const { coinId } = useParams();
  const [coin, setCoin] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCoinDetails(coinId);
      setCoin(data);
    };
    fetchData();
  }, [coinId]);

  if (!coin) return <p>Loading...</p>;

  return (
    <div className="coin-detail-container">
      <Link to="/" className="back-button">← Back to Dashboard</Link>
      <h1>{coin.name} ({coin.symbol.toUpperCase()})</h1>
      <p>Current Price: €{coin.market_data.current_price.eur}</p>
      <p>Market Cap: €{coin.market_data.market_cap.eur}</p>
      <p>24h Change: {coin.market_data.price_change_percentage_24h}%</p>
    </div>
  );
};

export default CoinDetailPage;
