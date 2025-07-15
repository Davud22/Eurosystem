"use client"
import { useState, useEffect } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Shield, Camera, Zap, Star, ShoppingCart, DoorOpen, Thermometer, Heart, HeartOff } from "lucide-react"
import styles from "./Proizvodi.module.css"

function Snackbar({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])
  return (
    <div style={{
      position: 'fixed',
      bottom: 36,
      left: '50%',
      transform: 'translateX(-50%)',
      background: type === 'success' ? '#22c55e' : '#ef4444',
      color: '#fff',
      padding: '1.1em 2.5em',
      borderRadius: 12,
      zIndex: 1000,
      boxShadow: '0 4px 24px #0004',
      fontWeight: 600,
      fontSize: 18,
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      animation: 'snackbar-in 0.25s cubic-bezier(.4,2,.6,1)'
    }}>
      {type === 'success' ? (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff2"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#fff2"/><path d="M15 9l-6 6M9 9l6 6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
      )}
      {message}
    </div>
  )
}

function LoginModal({ onClose }) {
  // Placeholder modal, možeš kasnije ubaciti pravu formu
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0007', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Prijava ili registracija</h2>
        <p style={{ marginBottom: 24 }}>Morate biti prijavljeni da biste dodali proizvod u korpu.</p>
        <button onClick={onClose} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5em 1.5em', fontWeight: 600, cursor: 'pointer' }}>Zatvori</button>
      </div>
    </div>
  )
}

export default function ProizvodiPage() {
  const [products, setProducts] = useState({})
  const [loading, setLoading] = useState(true)
  const [snackbar, setSnackbar] = useState(null)
  const [showLogin, setShowLogin] = useState(false)
  const [wishlist, setWishlist] = useState([])

  const categories = [
    { name: "Videonadzor", icon: Camera },
    { name: "Alarmni sistemi", icon: Shield },
    { name: "Kapije", icon: DoorOpen },
    { name: "Klima uređaji", icon: Thermometer },
    { name: "Elektroinstalacioni radovi", icon: Zap }
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = {}
        for (const category of categories) {
          const response = await fetch(`http://localhost:8000/products/?category=${encodeURIComponent(category.name)}`)
          if (response.ok) {
            productsData[category.name] = await response.json()
          } else {
            productsData[category.name] = []
          }
        }
        setProducts(productsData)
      } catch (error) {
        console.error("Greška pri učitavanju proizvoda:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
    // Fetch wishlist
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) {
      fetch('http://localhost:8000/cart/wishlist/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setWishlist(data.map(w => w.product_id)))
    }
  }, [])

  const handleAddToCart = async (productId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) {
      setShowLogin(true)
      return
    }
    try {
      const res = await fetch('http://localhost:8000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      })
      if (res.ok) {
        setSnackbar({ message: 'Proizvod je uspješno dodan u korpu!', type: 'success' })
      } else {
        const data = await res.json()
        if (data.detail && data.detail.includes('UNIQUE')) {
          setSnackbar({ message: 'Proizvod je već u korpi!', type: 'info' })
        } else {
          setSnackbar({ message: 'Greška pri dodavanju u korpu!', type: 'error' })
        }
      }
    } catch {
      setSnackbar({ message: 'Greška pri dodavanju u korpu!', type: 'error' })
    }
  }

  const handleWishlist = async (productId) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) {
      setShowLogin(true)
      return
    }
    if (wishlist.includes(productId)) {
      await fetch(`http://localhost:8000/cart/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setWishlist(wishlist.filter(id => id !== productId))
      setSnackbar({ message: 'Uklonjeno iz liste želja!', type: 'success' })
    } else {
      await fetch('http://localhost:8000/cart/wishlist/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId })
      })
      setWishlist([...wishlist, productId])
      setSnackbar({ message: 'Dodano u listu želja!', type: 'success' })
    }
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <div className={styles.loading}>Učitavanje proizvoda...</div>
        <Footer />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Header />
      {snackbar && <Snackbar message={snackbar.message} type={snackbar.type} onClose={() => setSnackbar(null)} />}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Naši proizvodi</h1>
            <p className={styles.heroDescription}>Kompletna ponuda sigurnosnih sistema i pametnih instalacija</p>
          </div>
        </div>
        <div className={styles.container}>
          {categories.map((category) => {
            const IconComponent = category.icon
            const categoryProducts = products[category.name] || []
            if (categoryProducts.length === 0) return null
            return (
              <section key={category.name} className={styles.categorySection}>
                <div className={styles.categoryHeader}>
                  <div className={styles.categoryIcon}>
                    <IconComponent size={32} />
                  </div>
                  <div>
                    <h2 className={styles.categoryTitle}>{category.name}</h2>
                  </div>
                </div>
                <div className={styles.productsGrid}>
                  {categoryProducts.map((product) => (
                    <div key={product.id} className={styles.productCard}>
                      <button className={styles.wishlistButton} onClick={() => handleWishlist(product.id)}>
                        {wishlist.includes(product.id)
                          ? <Heart fill="#e11d48" color="#e11d48" size={22} />
                          : <Heart size={22} />}
                      </button>
                      <div className={styles.productImage}>
                        <img 
                          src={product.image_url ? `http://localhost:8000${product.image_url}` : "/placeholder.svg"} 
                          alt={product.name}
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                          }}
                        />
                      </div>
                      <div className={styles.productContent}>
                        <h3 className={styles.productName}>{product.name}</h3>
                        <p className={styles.productDescription}>{product.description}</p>
                        {product.specifications && product.specifications.length > 0 && (
                          <ul className={styles.productSpecs}>
                            {product.specifications.map((spec, idx) => (
                              <li key={idx}>
                                <strong>{spec.key}:</strong> {spec.value}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className={styles.productFooter}>
                          <span className={styles.productPrice}>{product.price} KM</span>
                          <button className={styles.addToCartButton} onClick={() => handleAddToCart(product.id)}>
                            <ShoppingCart size={16} />
                            Dodaj u korpu
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      </main>
      <Footer />
    </div>
  )
}
