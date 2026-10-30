
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import products from '../src/data/products.json' with { type: 'json' }
import { filterProducts } from '../src/data/filterProducts.js'

describe('filterProducts', () => {
  it('returns all products when there are no filters', () => {
    assert.deepEqual(filterProducts(products, '', 'All'), products)
  })

  it('searches case-insensitively by product name and category', () => {
    assert.deepEqual(
      filterProducts(products, 'OXFORD', 'All').map((product) => product.id),
      [13]
    )
    assert.equal(filterProducts(products, 'hoodies', 'All').length, 5)
  })

  it('combines category and search filters', () => {
    assert.deepEqual(
      filterProducts(products, 'everyday', 'Bottomwear').map(
        (product) => product.id
      ),
      [10]
    )
    assert.deepEqual(filterProducts(products, 'linen', 'Bottomwear'), [])
  })

  it('trims whitespace and returns no matches for unknown terms', () => {
    assert.deepEqual(
      filterProducts(products, '  classic  ', 'All').map(
        (product) => product.id
      ),
      [2, 5, 12, 17]
    )
    assert.deepEqual(filterProducts(products, 'not a product', 'All'), [])
  })
})
