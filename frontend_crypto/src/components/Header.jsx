import { Link } from "react-router-dom"

export default function Header() {
  return (
    <header className="header">
      <div className="container header-container">
        <Link to="/" className="logo">
          <img src="/src/assets/Coin-radar-icon.png" alt="Coin Radar Logo" />
          <span>Coin Radar</span>
        </Link>
        <nav>
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </div>
        </nav>
      </div>
    </header>
  )
}

