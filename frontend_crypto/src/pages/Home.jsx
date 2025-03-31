import { useEffect, useState } from 'react';
import { getCryptoList } from '../services/api';
import SearchBar from '../components/SearchBar';
import CryptoTable from '../components/CryptoTable';
import '../styles.css'; // Import the updated CSS file

const Home = () => {
  const [cryptoData, setCryptoData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getCryptoList();
      setCryptoData(data);
    };
    fetchData();
  }, []);

  const filteredCryptoData = cryptoData.filter((coin) =>
    coin.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1>Crypto Dashboard</h1>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CryptoTable cryptoData={filteredCryptoData} />
    </div>
  );
};

export default Home;