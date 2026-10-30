import products from '../data/products.json' with { type: 'json' }

const productById = new Map(products.map((product) => [product.id, product]))

export function loadSavedCart() {
  try {
    const savedCart = localStorage.getItem('nexshop-cart')

    if (savedCart === null) {
      return { items: [], notice: null }
    }

    return parseSavedCart(savedCart)
  } catch {
    return {
      items: [],
      notice: 'Saved bag data could not be read and has been reset.',
    }
  }
}

export function parseSavedCart(savedCart) {
  try {
    const parsedCart = JSON.parse(savedCart)

    if (!Array.isArray(parsedCart)) {
      return {
        items: [],
        notice: 'Saved bag data was invalid and has been reset.',
      }
    }

    const items = []
    let hasInvalidItems = false

    for (const savedItem of parsedCart) {
      const product = productById.get(savedItem?.id)

      if (
        !product ||
        !Number.isSafeInteger(savedItem.quantity) ||
        savedItem.quantity < 1
      ) {
        hasInvalidItems = true
        continue
      }

      const existingItem = items.find((item) => item.id === product.id)
      if (existingItem) {
        existingItem.quantity += savedItem.quantity
      } else {
        items.push({ ...product, quantity: savedItem.quantity })
      }
    }

    return {
      items,
      notice: hasInvalidItems
        ? 'Some invalid saved bag items were removed.'
        : null,
    }
  } catch {
    return {
      items: [],
      notice: 'Saved bag data could not be read and has been reset.',
    }
  }
}

export function cartReducer(state, action) {
  if (action.type === 'notice') {
    return { ...state, notice: action.notice }
  }

  if (action.type === 'add') {
    const existingItem = state.items.find(
      (item) => item.id === action.product.id
    )

    const items = existingItem
      ? state.items.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...state.items, { ...action.product, quantity: 1 }]

    return { ...state, items }
  }

  if (action.type === 'remove') {
    return {
      ...state,
      items: state.items.filter((item) => item.id !== action.productId),
    }
  }

  if (action.type === 'quantity') {
    if (action.quantity < 1) {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.productId),
      }
    }

    return {
      ...state,
      items: state.items.map((item) =>
        item.id === action.productId
          ? { ...item, quantity: action.quantity }
          : item
      ),
    }
  }

  return state
}
