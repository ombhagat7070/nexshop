import {
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import { CartContext } from './useCart'
import { cartReducer, loadSavedCart } from './cartUtils'

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, undefined, loadSavedCart)
  const { items: cartItems, notice } = cart

  useEffect(() => {
    try {
      localStorage.setItem('nexshop-cart', JSON.stringify(cartItems))
    } catch (error) {
      console.error('Could not save cart:', error)
      dispatch({
        type: 'notice',
        notice: 'Your bag could not be saved on this device.',
      })
    }
  }, [cartItems])

  function addToCart(product) {
    dispatch({ type: 'add', product })
  }

  function removeFromCart(productId) {
    dispatch({ type: 'remove', productId })
  }

  function updateQuantity(productId, quantity) {
    dispatch({ type: 'quantity', productId, quantity })
  }

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )

  const totalPrice = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      ),
    [cartItems]
  )

  const value = {
    cartItems,
    notice,
    addToCart,
    removeFromCart,
    updateQuantity,
    itemCount,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
