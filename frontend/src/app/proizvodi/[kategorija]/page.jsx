"use client"
import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Header from "../../components/Header/Header"
import Footer from "../../components/Footer/Footer"
import styles from "../Proizvodi.module.css"
import { Shield, Camera, DoorOpen, Thermometer, Zap, Check } from "lucide-react"

const icons = {
  "Videonadzor": Camera,
  "Alarmni sistemi": Shield,
  "Kapije": DoorOpen,
  "Klima uređaji": Thermometer,
  "Elektroinstalacioni radovi": Zap,
}

export default function ProizvodiKategorijaPage() {
  const { kategorija } = useParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addedToCart, setAddedToCart] = useState({});

  const categoryMap = {
    "videonadzor": "Videonadzor",
    "alarmni-sistemi": "Alarmni sistemi",
    "kapije": "Kapije",
    "klima-uredjaji": "Klima uređaji",
    "elektroinstalacioni-radovi": "Elektroinstalacioni radovi"
  };

  useEffect(() => {
    if (!kategorija) return;
    setLoading(true);
    const apiCategory = categoryMap[kategorija] || kategorija;
    fetch(`http://localhost:8000/products/?category=${encodeURIComponent(apiCategory)}`)
      .then(res => res.json())
      .then(data => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setError("Greška pri dohvaćanju proizvoda."))
      .finally(() => setLoading(false));
  }, [kategorija]);

  const iconMap = {
    "Videonadzor": Camera,
    "Alarmni sistemi": Shield,
    "Kapije": DoorOpen,
    "Klima uređaji": Thermometer,
    "Elektroinstalacioni radovi": Zap,
  }
  const displayName = categoryMap[kategorija] || kategorija || ""
  const Icon = iconMap[displayName] || Shield

  const handleAddToCart = async (productId) => {
    // Pretpostavljamo da imaš endpoint za dodavanje u korpu
    setAddedToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      await fetch('http://localhost:8000/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });
    } catch {}
    setTimeout(() => setAddedToCart((prev) => ({ ...prev, [productId]: false })), 1500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <main className={styles.main}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 1rem 1.5rem 1rem', display: 'flex', alignItems: 'center', gap: 20 }}>
          <div className={styles.iconContainer} style={{ marginRight: 12 }}>
            <Icon size={40} />
          </div>
          <h1 className={styles.title} style={{ margin: 0 }}>{displayName}</h1>
        </div>
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 40 }}>Učitavanje...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'red' }}>{error}</div>
        ) : (
          <div className={styles.productsGrid}>
            {products.length === 0 ? (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#888', fontSize: 20 }}>Nema proizvoda u ovoj kategoriji.</div>
            ) : (
              products.map(product => (
                <div key={product.id} className={styles.productCard}>
                  <div className={styles.productImage}>
                    <img src={product.image_url ? `http://localhost:8000${product.image_url}` : "/placeholder.svg"} alt={product.name} />
                  </div>
                  <div className={styles.productContent}>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productDescription}>{product.description}</div>
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>{product.price} KM</span>
                      <button
                        className={styles.addToCartButton + " btn btn-primary"}
                        style={{ minWidth: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addedToCart[product.id]}
                      >
                        {addedToCart[product.id] ? <><Check size={18} style={{marginRight: 6}}/> Dodano!</> : "Dodaj u korpu"}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
} 