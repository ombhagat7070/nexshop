import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import products from '../src/data/products.json' with { type: 'json' }
import { cartReducer, parseSavedCart } from '../src/context/cartUtils.js'

describe('saved bag data', () => {
  it('uses canonical product details and accepts valid quantities', () => {
    const saved = parseSavedCart(
      JSON.stringify([{ id: 1, name: 'Altered name', price: 0, quantity: 2 }])
    )

    assert.equal(saved.notice, null)
    assert.deepEqual(saved.items, [{ ...products[0], quantity: 2 }])
  })

  it('drops invalid items and reports that recovery to the shopper', () => {
    const saved = parseSavedCart(
      JSON.stringify([
        { id: 1, quantity: 1 },
        { id: 999, quantity: 1 },
        { id: 2, quantity: 0 },
      ])
    )

    assert.deepEqual(saved.items, [{ ...products[0], quantity: 1 }])
    assert.match(saved.notice, /invalid saved bag items/)
  })

  it('returns a visible recovery notice for malformed saved data', () => {
    const saved = parseSavedCart('{')

    assert.deepEqual(saved.items, [])
    assert.match(saved.notice, /could not be read/)
  })
})

describe('cart operations', () => {
  it('adds products, increments existing items, and updates quantities', () => {
    const initial = { items: [], notice: null }
    const withOne = cartReducer(initial, { type: 'add', product: products[0] })
    const withTwo = cartReducer(withOne, { type: 'add', product: products[0] })
    const updated = cartReducer(withTwo, {
      type: 'quantity',
      productId: products[0].id,
      quantity: 4,
    })

    assert.equal(withOne.items[0].quantity, 1)
    assert.equal(withTwo.items[0].quantity, 2)
    assert.equal(updated.items[0].quantity, 4)
  })

  it('removes products when removed or reduced below one', () => {
    const initial = {
      items: [{ ...products[0], quantity: 1 }],
      notice: null,
    }

    assert.deepEqual(
      cartReducer(initial, {
        type: 'quantity',
        productId: products[0].id,
        quantity: 0,
      }).items,
      []
    )
    assert.deepEqual(
      cartReducer(initial, {
        type: 'remove',
        productId: products[0].id,
      }).items,
      []
    )
  })
})
