
import { Link } from 'react-router-dom'
import ImageWithFallback from './ImageWithFallback'

function ProductCard({ product }) {
  const price = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(product.price)

  return (
    <article className="product-card">
      <Link
        to={`/product/${product.id}`}
        className="product-card-link"
        aria-label={`View ${product.name} details`}
      >
        <div className="product-image-wrapper">
          <ImageWithFallback
            className="product-image"
            src={product.image}
            alt={product.name}
            loading="lazy"
          />

          <span className="product-category-tag">
            {product.category}
          </span>
        </div>

        <div className="product-info">
          <div className="product-name-row">
            <h3>{product.name}</h3>

            <span className="product-rating">
              <span aria-hidden="true">★</span> {product.rating}
            </span>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-bottom-row">
            <span className="product-price">{price}</span>
            <span className="view-product-button" aria-hidden="true">
              View details ↗
            </span>
          </div>
        </div>
      </Link>
    </article>
  )
}

export default ProductCard