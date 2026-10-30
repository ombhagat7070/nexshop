
import { Link, useParams } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import products from '../data/products.json'
import { useCart } from '../context/useCart'
import ImageWithFallback from '../components/ImageWithFallback'

function ProductDetails() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [added, setAdded] = useState(false)
  const addedTimeoutRef = useRef(null)

  const product = products.find(
    (item) => String(item.id) === id
  )

  useEffect(() => {
    document.title = product ? `${product.name} — Nexshop` : 'Nexshop'
    return () => { document.title = 'Nexshop' }
  }, [product])

  useEffect(() => {
    return () => clearTimeout(addedTimeoutRef.current)
  }, [])

  if (!product) {
    return (
      <main className="product-error-page">
        <h1>Product not found</h1>
        <Link className="back-to-shop" to="/">Back to shop</Link>
      </main>
    )
  }

  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price)

  function handleAddToCart() {
    addToCart(product)
    setAdded(true)
    clearTimeout(addedTimeoutRef.current)
    addedTimeoutRef.current = setTimeout(() => setAdded(false), 3500)
  }

  return (
    <main className="product-details-page">
      <div className="details-breadcrumb">
        <Link to="/">Shop</Link>
        <span>/</span>
        <span>{product.category}</span>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <section className="product-details-layout">
        <div className="details-image-wrapper">
          <ImageWithFallback
            className="details-image"
            src={product.image}
            alt={product.name}
          />
        </div>

        <div className="details-content">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>

          <div className="details-rating">
            <span aria-hidden="true">★</span> {product.rating}
            <span className="rating-label">Customer rating</span>
          </div>

          <p className="details-price">{price}</p>

          <p className="details-description">
            {product.description}
          </p>

          <div className="details-divider" />

          <p className="details-note">
            Designed for everyday comfort, effortless styling,
            and a timeless wardrobe.
          </p>

          <button
            className="add-to-cart-button"
            type="button"
            onClick={handleAddToCart}
          >
            {added ? 'Added to bag ✓' : 'Add to bag ↗'}
          </button>

          {added && (
            <div className="cart-success-message" role="status">
              <p>✓ {product.name} added to your bag.</p>
              <Link to="/cart">View bag →</Link>
            </div>
          )}

          <p className="details-small-note">
            Your bag is saved automatically on this device.
          </p>

          <Link className="back-to-shop" to="/">
            ← Continue shopping
          </Link>
        </div>
      </section>
    </main>
  )
}

export default ProductDetails
