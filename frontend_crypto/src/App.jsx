"use client"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { FavoritesProvider } from './context/FavoritesContext';
import Header from "./components/Header"
import Footer from "./components/Footer"
import Home from "./pages/Home"
import CoinDetail from "./pages/CoinDetail"

function App() {
  return (
    <FavoritesProvider>
      <Router>
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/coin/:id" element={<CoinDetail />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </FavoritesProvider>
  );
}

export default App;

