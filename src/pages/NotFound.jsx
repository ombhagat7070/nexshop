import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function NotFound() {
  useEffect(() => {
    document.title = '404 — Page Not Found — Nexshop'
  }, [])
  return (
    <main className="not-found-page">
      <p className="eyebrow">404 — PAGE NOT FOUND</p>
      <h1>That page isn’t here.</h1>
      <p>Try returning to the collection to find what you’re looking for.</p>
      <Link className="primary-button" to="/">
        Back to shop
      </Link>
    </main>
  )
}

export default NotFound
