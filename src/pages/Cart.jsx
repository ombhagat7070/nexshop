
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useCart } from '../context/useCart'
import ImageWithFallback from '../components/ImageWithFallback'

function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    itemCount,
    totalPrice,
  } = useCart()

  useEffect(() => {
    document.title = `Your Bag (${itemCount}) — Nexshop`
    return () => { document.title = 'Nexshop' }
  }, [itemCount])

  const formatPrice = (price) =>
    new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price)

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <p className="eyebrow">YOUR SELECTION</p>
        <h1>Your Bag</h1>
        <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <h2>Your bag is waiting for you.</h2>
          <p>Discover everyday essentials made for your wardrobe.</p>
          <Link className="back-to-shop" to="/">
            Explore collection
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <section className="cart-items" aria-label="Cart items">
            {cartItems.map((item) => (
              <article className="cart-item" key={item.id}>
                <ImageWithFallback
                  className="cart-item-image"
                  src={item.image}
                  alt={item.name}
                />

                <div className="cart-item-info">
                  <p className="cart-item-category">{item.category}</p>
                  <h2>{item.name}</h2>
                  <p className="cart-item-price">
                    {formatPrice(item.price)}
                  </p>

                  <div className="cart-item-actions">
                    <div className="quantity-control">
                      <button
                        type="button"
                        aria-label={`Decrease quantity of ${item.name}`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{item.quantity}</span>

                      <button
                        type="button"
                        aria-label={`Increase quantity of ${item.name}`}
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="remove-item-button"
                      type="button"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>

                <p className="cart-item-subtotal">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </article>
            ))}
          </section>

          <aside className="cart-summary">
            <h2>Order summary</h2>

            <div className="summary-row">
              <span>Total items</span>
              <span>{itemCount}</span>
            </div>

            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Calculated later</span>
            </div>

            <div className="summary-divider" />

            <div className="summary-row summary-total">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>

            <p className="summary-note">
              Shipping charges, if applicable, are not included.
            </p>

            <button
              type="button"
              className="checkout-button"
              onClick={() => alert('Checkout is not yet available.')}
            >
              Proceed to Checkout <span aria-hidden="true">↗</span>
            </button>

            <Link className="continue-shopping-link" to="/">
              Continue shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  )
}

export default Cart
