"use client"

import { useEffect, useState } from "react"
import Header from "../components/Header/Header"
import Footer from "../components/Footer/Footer"
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react"
import styles from "./Korpa.module.css"
import jsPDF from "jspdf"

function LoginModal({ onClose }) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px #0007', textAlign: 'center' }}>
        <h2 style={{ marginBottom: 16 }}>Prijava ili registracija</h2>
        <p style={{ marginBottom: 24 }}>Morate biti prijavljeni da biste videli svoju korpu.</p>
        <button onClick={onClose} style={{ background: 'var(--accent-primary)', color: '#fff', border: 'none', borderRadius: 6, padding: '0.5em 1.5em', fontWeight: 600, cursor: 'pointer' }}>Zatvori</button>
      </div>
    </div>
  )
}

function ThankYouModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.55)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn 0.3s'
    }}>
      <div style={{
        background: 'var(--bg-primary)', color: 'var(--text-primary)', borderRadius: 18, padding: 48, minWidth: 340,
        boxShadow: '0 8px 32px #0005', textAlign: 'center', position: 'relative', overflow: 'hidden',
        animation: 'popIn 0.35s cubic-bezier(.4,2,.6,1)'
      }}>
        <img src="/euro-system-logo.png" alt="Eurosystem logo" style={{ width: 90, marginBottom: 18, filter: 'drop-shadow(0 2px 8px #0002)' }} />
        <div style={{ margin: '0 auto 18px auto', width: 80, height: 80, borderRadius: '50%', background: '#22c55e22', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'bounce 1.2s infinite alternate' }}>
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="12" fill="#22c55e"/><path d="M7 13l3 3 7-7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 10 }}>Hvala na narudžbi!</h2>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', marginBottom: 24 }}>Vaša narudžba je uspješno poslata.<br/>Eurosystem tim će Vas uskoro kontaktirati.</p>
        <button onClick={onClose} style={{ background: '#22c55e', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 36px', fontWeight: 700, fontSize: 18, cursor: 'pointer', boxShadow: '0 2px 8px #22c55e55', transition: 'background 0.2s' }}>Zatvori</button>
        <style>{`
          @keyframes popIn { 0% { transform: scale(0.7); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
          @keyframes fadeIn { 0% { opacity: 0; } 100% { opacity: 1; } }
          @keyframes bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-12px); } }
        `}</style>
      </div>
    </div>
  )
}

export default function KorpaPage() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [orderMessage, setOrderMessage] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) {
      setShowLogin(true)
      setLoading(false)
      return
    }
    fetch('http://localhost:8000/cart/my', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCartItems(data))
      .finally(() => setLoading(false))
  }, [])

  const getImageUrl = (product) => {
    if (!product?.image_url) return "/placeholder.svg"
    return product.image_url.startsWith("/images/") ? `http://localhost:8000${product.image_url}` : product.image_url
  }

  const updateQuantity = async (product_id, newQuantity) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return
    if (newQuantity <= 0) {
      await removeItem(product_id)
      return
    }
    await fetch(`http://localhost:8000/cart/update/${product_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ quantity: newQuantity })
    })
    setCartItems((items) => items.map((item) => item.product_id === product_id ? { ...item, quantity: newQuantity } : item))
  }

  const removeItem = async (product_id) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (!token) return
    await fetch(`http://localhost:8000/cart/remove/${product_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setCartItems(items => items.filter(item => item.product_id !== product_id))
  }

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product?.price || 0) * item.quantity, 0)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("sr-RS").format(price) + " KM"
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Račun - Proizvodi u korpi", 15, 20)
    let y = 35
    cartItems.forEach((item, idx) => {
      doc.setFontSize(12)
      doc.text(`${idx + 1}. ${item.product?.name || ''} x${item.quantity} - ${formatPrice((item.product?.price || 0) * item.quantity)}`, 15, y)
      y += 10
    })
    doc.setFontSize(14)
    doc.text(`Ukupno: ${formatPrice(getTotalPrice())}`, 15, y + 10)
    doc.save("racun.pdf")
  }

  const sendOrder = async () => {
    setOrderMessage("");
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) {
      setShowLogin(true);
      return;
    }
    try {
      const res = await fetch('http://localhost:8000/orders/from-cart', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems([]);
        setShowThankYou(true);
        setOrderMessage("");
      } else {
        const data = await res.json();
        setOrderMessage(data.detail || "Greška prilikom slanja narudžbe.");
      }
    } catch (e) {
      setOrderMessage("Greška prilikom slanja narudžbe.");
    }
  };

  if (loading) {
    return <div className={styles.page}><Header /><div className={styles.loading}>Učitavanje...</div><Footer /></div>
  }
  if (showLogin) {
    return <LoginModal onClose={() => setShowLogin(false)} />
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.container}>
            <h1 className={styles.heroTitle}>Vaša korpa</h1>
            <p className={styles.heroDescription}>Pregledajte odabrane proizvode i završite kupovinu</p>
          </div>
        </div>

        <div className={styles.container}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={64} className={styles.emptyIcon} />
              <h2 className={styles.emptyTitle}>Vaša korpa je prazna</h2>
              <p className={styles.emptyDescription}>Dodajte proizvode u korpu da biste nastavili sa kupovinom</p>
              <a href="/proizvodi" className={styles.shopButton}>
                Pogledaj proizvode
              </a>
            </div>
          ) : (
            <div className={styles.cartContent}>
              <div className={styles.cartItems}>
                <h2 className={styles.sectionTitle}>Proizvodi u korpi ({cartItems.length})</h2>

                {cartItems.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={getImageUrl(item.product)} alt={item.product?.name} />
                    </div>

                    <div className={styles.itemDetails}>
                      <h3 className={styles.itemName}>{item.product?.name}</h3>
                      <p className={styles.itemDescription}>{item.product?.description}</p>
                      <span className={styles.itemPrice}>{formatPrice(item.product?.price)}</span>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className={styles.quantityButton}
                        >
                          <Minus size={16} />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className={styles.quantityButton}
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className={styles.itemTotal}>{formatPrice(item.product?.price * item.quantity)}</div>

                      <button onClick={() => removeItem(item.product_id)} className={styles.removeButton}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.cartSummary}>
                <h2 className={styles.summaryTitle}>Pregled narudžbe</h2>

                <div className={styles.summaryDetails}>
                  <div className={styles.summaryRow}>
                    <span>Ukupno proizvoda:</span>
                    <span>{cartItems.reduce((total, item) => total + item.quantity, 0)}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Subtotal:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>

                  <div className={styles.summaryRow}>
                    <span>Dostava:</span>
                    <span>Besplatno</span>
                  </div>

                  <div className={styles.summaryDivider}></div>

                  <div className={styles.summaryTotal}>
                    <span>Ukupno:</span>
                    <span>{formatPrice(getTotalPrice())}</span>
                  </div>
                </div>

                <button className={styles.checkoutButton} onClick={sendOrder}>
                  Pošalji narudžbu
                  <ArrowRight size={20} />
                </button>
                {orderMessage && <div style={{color: orderMessage.includes('uspešno') ? 'green' : 'red', marginTop: 8}}>{orderMessage}</div>}
                <button className={styles.checkoutButton} style={{marginTop: 16}} onClick={exportPDF}>
                  Export PDF račun
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      {showThankYou && <ThankYouModal onClose={() => setShowThankYou(false)} />}
    </div>
  )
}
