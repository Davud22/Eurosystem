"use client"

import { useState, useEffect, useRef } from "react"
import { User, ShoppingBag, Heart, MessageCircle, Settings, Star, TrendingUp, Trash2, ShoppingCart } from "lucide-react"
import Header from "../components/Header/Header"
import styles from "./User.module.css"

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ first_name: "", last_name: "", email: "", phone: "" })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const formRef = useRef(null)
  const [wishlist, setWishlist] = useState([])

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"

  useEffect(() => {
    async function fetchUser() {
      setLoading(true)
      const token = localStorage.getItem("access_token")
      const res = await fetch(`${BACKEND_URL}/user/me`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        setForm({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email || "",
          phone: data.phone || ""
        })
      }
      setLoading(false)
    }
    fetchUser()
    // Fetch wishlist
    const token = localStorage.getItem("access_token")
    if (token) {
      fetch(`${BACKEND_URL}/cart/wishlist/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setWishlist(data))
    }
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const token = localStorage.getItem("access_token")
    const res = await fetch(`${BACKEND_URL}/user/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      const data = await res.json()
      setUser(data)
      // Optionally show success
    }
    setSaving(false)
  }

  function logout() {
    localStorage.removeItem("access_token");
    fetch("/api/logout").then(() => {
      window.location.replace("/prijava");
    });
  }

  const handleRemoveWishlist = async (product_id) => {
    const token = localStorage.getItem("access_token")
    await fetch(`${BACKEND_URL}/cart/wishlist/remove/${product_id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    })
    setWishlist(wishlist.filter(w => w.product_id !== product_id))
  }

  const handleAddToCart = async (product_id) => {
    const token = localStorage.getItem("access_token")
    await fetch(`${BACKEND_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ product_id, quantity: 1 })
    })
    await handleRemoveWishlist(product_id)
  }

  const stats = {
    orders: 3,
    wishlist: 12,
    messages: 2,
    reviews: 8,
  }

  const recentOrders = [
    {
      id: "ORD-001",
      product: "Alarmni sistem Pro",
      status: "U izradi",
      date: "15.12.2024",
      amount: "45.000 RSD",
    },
    {
      id: "ORD-002",
      product: "IP kamera set",
      status: "Isporučeno",
      date: "10.12.2024",
      amount: "28.000 RSD",
    },
  ]

  const recommendedProducts = [
    {
      id: 1,
      name: "Pametni senzor pokreta",
      price: "8.500 RSD",
      image: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Wireless alarm",
      price: "15.000 RSD",
      image: "/placeholder.svg?height=100&width=100",
    },
  ]

  return (
    <div className={styles.userDashboard}>
      <Header />

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.userProfile}>
            <div className={styles.avatar}>
              <User size={32} />
            </div>
            <div className={styles.userInfo}>
              <h3 className={styles.userName}>{user ? `${user.first_name} ${user.last_name}` : ""}</h3>
              <p className={styles.userEmail}>{user ? user.email : ""}</p>
              <span className={styles.userRole}>Korisnik</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            >
              <TrendingUp size={20} />
              Pregled
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
            >
              <ShoppingBag size={20} />
              Moje narudžbe
            </button>
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`${styles.navItem} ${activeTab === "wishlist" ? styles.active : ""}`}
            >
              <Heart size={20} />
              Lista želja
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`${styles.navItem} ${activeTab === "messages" ? styles.active : ""}`}
            >
              <MessageCircle size={20} />
              Eurosystem Chat
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
            >
              <Settings size={20} />
              Moj profil
            </button>
          </nav>
          <button onClick={logout} className={styles.logoutButton}>Odjava</button>
        </div>

        <main className={styles.main}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              <div className={styles.welcome}>
                <h1 className={styles.welcomeTitle}>Zdravo, Emrah! 👋</h1>
                <p className={styles.welcomeText}>Dobrodošli nazad u vaš Eurosystem korisnički panel</p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingBag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.orders}</h3>
                    <p className={styles.statLabel}>Narudžbe</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Heart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.wishlist}</h3>
                    <p className={styles.statLabel}>Lista želja</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <MessageCircle size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.messages}</h3>
                    <p className={styles.statLabel}>Poruke</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Star size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{stats.reviews}</h3>
                    <p className={styles.statLabel}>Recenzije</p>
                  </div>
                </div>
              </div>

              <div className={styles.contentGrid}>
                <div className={styles.recentOrders}>
                  <h2 className={styles.sectionTitle}>Nedavne narudžbe</h2>
                  <div className={styles.ordersList}>
                    {recentOrders.map((order) => (
                      <div key={order.id} className={styles.orderItem}>
                        <div className={styles.orderInfo}>
                          <h4 className={styles.orderProduct}>{order.product}</h4>
                          <p className={styles.orderId}>#{order.id}</p>
                        </div>
                        <div className={styles.orderMeta}>
                          <span
                            className={`${styles.orderStatus} ${
                              order.status === "Isporučeno" ? styles.delivered : styles.processing
                            }`}
                          >
                            {order.status}
                          </span>
                          <span className={styles.orderDate}>{order.date}</span>
                          <span className={styles.orderAmount}>{order.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.recommendations}>
                  <h2 className={styles.sectionTitle}>Preporučeno za vas</h2>
                  <div className={styles.productsList}>
                    {recommendedProducts.map((product) => (
                      <div key={product.id} className={styles.productItem}>
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{product.name}</h4>
                          <p className={styles.productPrice}>{product.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              <h1 className={styles.pageTitle}>Moje narudžbe</h1>
              <div className={styles.ordersList}>
                {recentOrders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <h3 className={styles.orderProduct}>{order.product}</h3>
                      <span
                        className={`${styles.orderStatus} ${
                          order.status === "Isporučeno" ? styles.delivered : styles.processing
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className={styles.orderDetails}>
                      <p>Narudžba: #{order.id}</p>
                      <p>Datum: {order.date}</p>
                      <p>Iznos: {order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className={styles.wishlistTab}>
              <h2 className={styles.sectionTitle}>Lista želja</h2>
              {wishlist.length === 0 ? (
                <p className={styles.emptyWishlist}>Vaša lista želja je trenutno prazna.</p>
              ) : (
                <div className={styles.wishlistGrid}>
                  {wishlist.map((item) => (
                    <div key={item.id} className={styles.wishlistCard}>
                      <img src={item.product?.image_url ? (item.product.image_url.startsWith('/images/') ? `http://localhost:8000${item.product.image_url}` : item.product.image_url) : "/placeholder.svg"} alt={item.product?.name} className={styles.wishlistImage} />
                      <div className={styles.wishlistInfo}>
                        <h3>{item.product?.name}</h3>
                        <p>{item.product?.description}</p>
                        <span className={styles.wishlistPrice}>{item.product?.price} KM</span>
                      </div>
                      <div className={styles.wishlistActions}>
                        <button className={styles.addToCartBtn} onClick={() => handleAddToCart(item.product_id)}>
                          <ShoppingCart size={18} /> Dodaj u korpu
                        </button>
                        <button className={styles.removeBtn} onClick={() => handleRemoveWishlist(item.product_id)}>
                          <Trash2 size={18} /> Obriši
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "messages" && (
            <div className={styles.messagesSection}>
              <h1 className={styles.pageTitle}>Eurosystem Chat</h1>
              <div className={styles.chatContainer}>
                <div className={styles.chatHeader}>
                  <h3>Direktna komunikacija sa Eurosystem timom</h3>
                </div>
                <div className={styles.chatMessages}>
                  <div className={styles.message}>
                    <p>Pozdrav! Kako mogu da vam pomognem sa našim proizvodima?</p>
                    <span className={styles.messageTime}>14:30</span>
                  </div>
                </div>
                <div className={styles.chatInput}>
                  <input type="text" placeholder="Ukucajte poruku..." className={styles.messageInput} />
                  <button className={styles.sendButton}>Pošalji</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <div className={styles.profileSection}>
              <h1 className={styles.pageTitle}>Moj profil</h1>
              <form className={styles.profileForm} onSubmit={handleSave} ref={formRef}>
                <div className={styles.formGroup}>
                  <label>Ime</label>
                  <input name="first_name" value={form.first_name} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Prezime</label>
                  <input name="last_name" value={form.last_name} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={handleChange} />
                </div>
                <div className={styles.formGroup}>
                  <label>Telefon</label>
                  <input name="phone" value={form.phone} onChange={handleChange} />
                </div>
                <button className={styles.saveButton} type="submit" disabled={saving}>{saving ? "Čuvam..." : "Sačuvaj izmjene"}</button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
