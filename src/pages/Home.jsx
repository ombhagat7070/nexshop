
import { useMemo, useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import products from '../data/products.json'
import ProductCard from '../components/ProductCard'
import ImageWithFallback from '../components/ImageWithFallback'
import { filterProducts } from '../data/filterProducts'

function Home() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('featured')
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeHeroImage, setActiveHeroImage] = useState(0)

  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  const heroImages = [
    {
      src: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&auto=format&fit=crop&q=80',
      alt: 'Fashion collection and everyday outfits',
    },
    {
      src: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?w=1000&auto=format&fit=crop&q=80',
      alt: 'Contemporary everyday fashion',
    },
    {
      src: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1000&auto=format&fit=crop&q=80',
      alt: 'Curated clothing and fashion essentials',
    },
    {
      src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1000&auto=format&fit=crop&q=80',
      alt: 'Minimalist fashion inspiration',
    },
  ]

  // Update the page title.
  useEffect(() => {
    document.title = 'Nexshop — Everyday Essentials'
  }, [])

  // Automatically change the hero image every 4 seconds.
  useEffect(() => {
    const slideshowInterval = setInterval(() => {
      setActiveHeroImage((current) => (
        current + 1
      ) % heroImages.length)
    }, 4000)

    return () => clearInterval(slideshowInterval)
  }, [heroImages.length])

  // Open search from the navbar or URL.
  useEffect(() => {
    const openSearch = () => {
      setIsSearchOpen(true)

      requestAnimationFrame(() => {
        searchContainerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        })

        searchInputRef.current?.focus()
      })
    }

    const handleOpenSearch = () => openSearch()

    window.addEventListener('nexshop:open-search', handleOpenSearch)

    const params = new URLSearchParams(location.search)

    if (params.get('search') === '1') {
      openSearch()
      navigate('/', { replace: true })
    }

    return () => {
      window.removeEventListener(
        'nexshop:open-search',
        handleOpenSearch
      )
    }
  }, [location.search, navigate])

  // Close search with Escape.
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isSearchOpen) {
        setSearch('')
        setIsSearchOpen(false)
        searchInputRef.current?.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isSearchOpen])

  const categories = [
    'All',
    ...new Set(products.map((product) => product.category)),
  ]

  // Search and category filtering.
  const filteredProducts = useMemo(() => {
    return filterProducts(products, search, selectedCategory)
  }, [search, selectedCategory])

  // Sort filtered products without mutating the original JSON data.
  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts]

    switch (sortBy) {
      case 'price-low':
        return result.sort((a, b) => a.price - b.price)

      case 'price-high':
        return result.sort((a, b) => b.price - a.price)

      case 'name-az':
        return result.sort((a, b) =>
          a.name.localeCompare(b.name)
        )

      case 'featured':
      default:
        return result
    }
  }, [filteredProducts, sortBy])

  const handleClearFilters = () => {
    setSearch('')
    setSelectedCategory('All')
    setSortBy('featured')
  }

  return (
    <main>
      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">THE EVERYDAY EDIT — 2026</p>

          <h1>
            Wear your
            <br />
            <span>everyday.</span>
          </h1>

          <p className="hero-description">
            Thoughtfully selected clothing for everyday
            comfort. Discover timeless essentials made
            to fit your personal style.
          </p>

          <a href="#products" className="primary-button">
            Explore collection <span>↗</span>
          </a>

          <div className="hero-note">
            <span className="status-dot" />
            Everyday style, thoughtfully curated
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image-placeholder">
            <span className="image-label">
              THE EVERYDAY COLLECTION
            </span>

            <ImageWithFallback
              key={heroImages[activeHeroImage].src}
              className="hero-fashion-image"
              src={heroImages[activeHeroImage].src}
              alt={heroImages[activeHeroImage].alt}
            />

            <div className="hero-new-drop">
              <span>new</span>
              <span>drop ✦</span>
            </div>

            <div className="hero-image-caption">
              <span>Simple by design.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="products-section" id="products">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CURATED FOR YOU</p>
            <h2>Everyday essentials</h2>
          </div>

          <span className="product-total" aria-live="polite">
            {sortedProducts.length}{' '}
            {sortedProducts.length === 1 ? 'product' : 'products'}
          </span>
        </div>

        <div
          className={`search-container ${isSearchOpen ? 'search-open' : ''}`}
          ref={searchContainerRef}
        >
          <span aria-hidden="true">⌕</span>

          <input
            ref={searchInputRef}
            id="search"
            type="search"
            placeholder="Search clothing..."
            aria-label="Search clothing by name or category"
            value={search}
            onFocus={() => setIsSearchOpen(true)}
            onChange={(event) => setSearch(event.target.value)}
          />

          {search && (
            <button
              className="clear-search"
              type="button"
              onClick={() => {
                setSearch('')
                searchInputRef.current?.focus()
              }}
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </div>

        <div
          className="category-filters"
          aria-label="Filter by category"
        >
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button ${
                selectedCategory === category ? 'active' : ''
              }`}
              aria-pressed={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="product-toolbar">
          <span className="results-label">
            Showing {sortedProducts.length} of {products.length} products
          </span>

          <label className="sort-control">
            <span>Sort by</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
              aria-label="Sort products"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name-az">Name: A–Z</option>
            </select>
          </label>
        </div>

        {products.length === 0 ? (
          <div className="empty-preview" role="alert">
            <span className="empty-icon">!</span>
            <h3>Products couldn't be loaded.</h3>
            <p>Please check the local product data.</p>
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="product-grid">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-preview" role="status">
            <span className="empty-icon">⌕</span>
            <h3>No matching products</h3>
            <p>
              Try another search term or select a different category.
            </p>

            <button
              type="button"
              className="primary-button empty-reset"
              onClick={handleClearFilters}
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  )
}

export default Home
