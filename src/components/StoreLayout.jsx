import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useCart } from '../context/useCart'

const tickerItems = [
  'everyday essentials',
  'new fits weekly',
  'simple by design',
  'made for your wardrobe',
  'wear your everyday',
]

function Ticker() {
  const group = tickerItems.map((text) => (
    <span key={text}>{text} ✦</span>
  ))

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-group">{group}</div>
        <div className="marquee-group">{group}</div>
      </div>
    </div>
  )
}

function StoreLayout() {
  const { itemCount, notice } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSearchClick = () => {
    if (location.pathname !== '/') {
      navigate('/?search=1')
    } else {
      window.dispatchEvent(new Event('nexshop:open-search'))
    }
  }

  return (
    <div className="app">
      <Ticker />

      <header className="navbar">
        <Link to="/" className="logo" aria-label="Nexshop home">
          nex<span>shop.</span>
        </Link>

        <div className="nav-actions">
          <button
            type="button"
            className="icon-button"
            aria-label="Search products"
            title="Search products"
            onClick={handleSearchClick}
          >
            <svg
              width="21"
              height="21"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.9"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m16 16 4 4" />
            </svg>
          </button>

          <Link
            to="/cart"
            className="cart-link"
            aria-label={`Shopping bag, ${itemCount} items`}
          >
            Bag <span className="cart-count">{itemCount}</span>
          </Link>
        </div>
      </header>

      {notice && (
        <p className="storage-notice" role="alert">
          {notice}
        </p>
      )}

      <Outlet />

      <footer className="footer">
        <Link to="/" className="logo">
          nex<span>shop.</span>
        </Link>
        <p>Thoughtful style. Everyday living.</p>
        <span>© 2026 Nexshop</span>
      </footer>
    </div>
  )
}

export default StoreLayout