function ImageWithFallback({ src, alt, ...props }) {
  function handleError(event) {
    event.currentTarget.onerror = null
    event.currentTarget.src = '/product-placeholder.svg'
  }

  return <img src={src} alt={alt} onError={handleError} {...props} />
}

export default ImageWithFallback
