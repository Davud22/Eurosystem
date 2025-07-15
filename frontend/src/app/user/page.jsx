"use client"

import { useState, useEffect, useRef } from "react"
import { User, ShoppingBag, Heart, MessageCircle, Settings, Star, TrendingUp, Trash2, ShoppingCart, Paperclip, SendHorizonal, Loader2 } from "lucide-react"
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
  const [orders, setOrders] = useState([])
  const [dashboardStats, setDashboardStats] = useState({orders: 0, wishlist: 0, cart: 0, messages: 2})

  // CHAT STATE
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [sending, setSending] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const adminId = 1; // hardkodirano, zamijeni ako imaš endpoint za admina

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
        .then(data => setWishlist(Array.isArray(data) ? data : Array.isArray(data?.wishlist) ? data.wishlist : []))
      // Fetch orders
      fetch(`${BACKEND_URL}/orders/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(Array.isArray(data) ? data : Array.isArray(data?.orders) ? data.orders : []))
      // Fetch dashboard stats
      fetch(`${BACKEND_URL}/user/dashboard-stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setDashboardStats(data))
    }
  }, [])

  // Fetch chat messages
  useEffect(() => {
    if (activeTab !== "messages" || !token) return;
    setLoadingMessages(true);
    setError("");
    fetch(`${BACKEND_URL}/chat/messages/${adminId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setChatMessages(data) : setChatMessages([]))
      .catch(() => setChatMessages([]))
      .finally(() => setLoadingMessages(false));
    // Mark as read
    fetch(`${BACKEND_URL}/chat/mark-read/${adminId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
  }, [activeTab, token]);

  // WebSocket
  useEffect(() => {
    if (activeTab !== "messages" || !token) return;
    ws.current = new window.WebSocket(
      `ws://localhost:8000/chat/ws/${adminId}?token=${token}`
    );
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setChatMessages(prev => [...prev, msg]);
    };
    ws.current.onerror = () => setError("Greška u konekciji na chat server.");
    ws.current.onclose = () => {};
    return () => ws.current && ws.current.close();
  }, [activeTab, token]);

  // Scroll to bottom
  useEffect(() => {
    if (activeTab === "messages" && messagesEndRef.current) {
      // Timeout zbog rendera
      setTimeout(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [chatMessages, activeTab]);

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

  // File preview
  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setFilePreview(ev.target.result);
      reader.readAsDataURL(f);
    } else {
      setFilePreview(null);
    }
  };

  // Send message
  const sendMessage = async () => {
    if ((!messageInput.trim() && !file) || sending || !ws.current || ws.current.readyState !== 1) return;
    setSending(true);
    setError("");
    let attachmentUrl = null;
    let chat_id = null;
    if (chatMessages.length > 0 && chatMessages[0].chat_id) {
      chat_id = chatMessages[0].chat_id;
    }
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch(`${BACKEND_URL}/chat/upload-image`, {
          method: 'POST',
          body: formData,
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        attachmentUrl = data.url;
        setFile(null);
        setFilePreview(null);
      } catch {
        setError("Greška pri uploadu slike.");
        setSending(false);
        return;
      }
    }
    try {
      ws.current.send(JSON.stringify({ content: messageInput, attachment_url: attachmentUrl, chat_id }));
      setMessageInput("");
    } catch {
      setError("Neuspješno slanje poruke.");
    }
    setSending(false);
  };

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
                <h1 className={styles.welcomeTitle}>Zdravo, {user ? `${user.first_name} ${user.last_name}` : ""}! 👋</h1>
                <p className={styles.welcomeText}>Dobrodošli nazad u vaš Eurosystem korisnički panel</p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingBag size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.orders}</h3>
                    <p className={styles.statLabel}>Narudžbe</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Heart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.wishlist}</h3>
                    <p className={styles.statLabel}>Lista želja</p>
                  </div>
                </div>
                {/* Uklonjen statCard za Poruke */}
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.cart}</h3>
                    <p className={styles.statLabel}>Korpa</p>
                  </div>
                </div>
              </div>

              <div className={styles.contentGrid}>
                {/* Nedavne narudžbe */}
                <div className={styles.recentOrders}>
                  <h2 className={styles.sectionTitle}>Nedavne narudžbe</h2>
                  <div className={styles.ordersList}>
                    {orders.length === 0 ? (
                      <div className={styles.emptyState}>Nemate narudžbi.</div>
                    ) : (
                      orders && Array.isArray(orders) && orders.slice(-3).reverse().map((order) => (
                        <div key={order.id} className={styles.orderItem}>
                          <div className={styles.orderInfo}>
                            <h4 className={styles.orderProduct}>{order.items[0]?.product?.name || `Narudžba #${order.code}`}</h4>
                            <p className={styles.orderId}>#{order.code}</p>
                          </div>
                          <div className={styles.orderMeta}>
                            <span
                              className={
                                `${styles.orderStatus} ` +
                                (order.status === 'completed' ? styles.zavrseno :
                                  order.status === 'u izradi' ? styles.uIzradi :
                                  order.status === 'odbijen' ? styles.odbijen : '')
                              }
                            >
                              {order.status === 'completed' ? 'završeno' : order.status === 'u izradi' ? 'u izradi' : order.status === 'odbijen' ? 'odbijen' : order.status}
                            </span>
                            <span className={styles.orderDate}>{new Date(order.created_at).toLocaleDateString()}</span>
                            <span className={styles.orderAmount}>{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)} KM</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className={styles.recommendations}>
                  <h2 className={styles.sectionTitle}>Preporučeno za vas</h2>
                  <div className={styles.productsList}>
                    {wishlist && Array.isArray(wishlist) && wishlist.slice(0, 2).map((item) => (
                      <div key={item.id} className={styles.productItem}>
                        <img
                          src={item.product?.image_url ? (item.product.image_url.startsWith('/images/') ? `http://localhost:8000${item.product.image_url}` : item.product.image_url) : "/placeholder.svg"}
                          alt={item.product?.name}
                          className={styles.productImage}
                        />
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{item.product?.name}</h4>
                          <p className={styles.productPrice}>{item.product?.price} KM</p>
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
                {orders.length === 0 ? (
                  <div className={styles.emptyState}>Nemate narudžbi.</div>
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderHeader}>
                        <div>
                          <span className={styles.orderProduct}>Narudžba: #{order.code}</span>
                          <span className={styles.orderDate} style={{marginLeft: 16}}>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>
                        <span
                          className={
                            `${styles.orderStatus} ` +
                            (order.status === 'completed' ? styles.zavrseno :
                              order.status === 'u izradi' ? styles.uIzradi :
                              order.status === 'odbijen' ? styles.odbijen : '')
                          }
                        >
                          {order.status === 'completed' ? 'završeno' : order.status === 'u izradi' ? 'u izradi' : order.status === 'odbijen' ? 'odbijen' : order.status}
                        </span>
                      </div>
                      <div className={styles.orderDetails}>
                        <b>Stavke narudžbe:</b>
                        <div className={styles.orderItemsList}>
                          {order.items.map(item => (
                            <div key={item.id} className={styles.orderItemRow}>
                              <img
                                src={item.product?.image_url ? (item.product.image_url.startsWith('/images/') ? `http://localhost:8000${item.product.image_url}` : item.product.image_url) : "/placeholder.svg"}
                                alt={item.product?.name}
                                className={styles.orderProductImage}
                              />
                              <span style={{ fontWeight: 500 }}>{item.product?.name || 'Proizvod'}</span>
                              <span>x{item.quantity}</span>
                              <span style={{ color: '#888' }}>{item.price} KM</span>
                              <span style={{ fontWeight: 600 }}>= {(item.price * item.quantity).toLocaleString()} KM</span>
                            </div>
                          ))}
                        </div>
                        <div style={{marginTop: '1em', fontWeight: 600}}>
                          Ukupno: {order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)} KM
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                  {loadingMessages ? (
                    <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>Učitavanje poruka...</div>
                  ) : chatMessages.length === 0 ? (
                    <div style={{ color: "#888", textAlign: "center", marginTop: 40 }}>
                      Nema poruka. Počni razgovor!
                    </div>
                  ) : (
                    chatMessages
                      .slice()
                      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                      .map(msg => (
                        <div
                          key={msg.id}
                          className={msg.sender_id === user?.id ? styles.messageUser : styles.messageAdmin}
                        >
                          {msg.attachment_url && (
                            <>
                              {!imgLoaded[msg.id] && (
                                <div style={{textAlign:'center',marginBottom:6,fontSize:13,color:'#94a3b8'}}>Učitavanje slike...</div>
                              )}
                              <img
                                src={msg.attachment_url.startsWith('/images/') ? `http://localhost:8000${msg.attachment_url}` : msg.attachment_url}
                                alt="slika"
                                className={styles.messageImage}
                                style={{ marginBottom: msg.content ? 8 : 0, display: imgLoaded[msg.id] ? 'block' : 'none' }}
                                onLoad={() => setImgLoaded(l => ({...l, [msg.id]: true}))}
                              />
                            </>
                          )}
                          {msg.content && (
                            <span style={{ wordBreak: "break-word", fontSize: 16 }}>{msg.content}</span>
                          )}
                          <span className={styles.messageTime}>
                            {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            {/* Kvačice samo za userove poruke */}
                            {msg.sender_id === user?.id && (
                              msg.read || msg.is_read ? (
                                <span className={styles["chat-tick"] + ' ' + styles["chat-tick-double"]} title="Pročitano">✔✔</span>
                              ) : (
                                <span className={styles["chat-tick"] + ' ' + styles["chat-tick-single"]} title="Poslano">✔</span>
                              )
                            )}
                          </span>
                        </div>
                      ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
                {error && <div style={{ color: '#ef4444', textAlign: 'center', marginBottom: 8 }}>{error}</div>}
                <div className={styles.chatInput} style={{margin:'0 10px 10px 10px'}}>
                  <label className="cursor-pointer flex items-center justify-center" title="Dodaj privitak" style={{ width: 44, height: 44, marginBottom:0 }}>
                    <Paperclip size={22} className="text-[#94a3b8]" />
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="hidden"
                      disabled={sending}
                      tabIndex={-1}
                      style={{display:'none'}}
                    />
                  </label>
                  {filePreview && (
                    <div className="relative mr-2">
                      <img src={filePreview} alt="preview" className={styles.messageImage} style={{maxWidth: 60, maxHeight: 60, borderRadius: 8, border: '2px solid #3b82f6'}} />
                      <button
                        onClick={() => { setFile(null); setFilePreview(null); }}
                        className="absolute -top-2 -right-2 bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-base shadow"
                        style={{ border: 'none' }}
                        title="Ukloni sliku"
                        type="button"
                      >×</button>
                    </div>
                  )}
                  <input
                    type="text"
                    placeholder="Ukucajte poruku..."
                    className={styles.messageInput}
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && (messageInput.trim() || file)) sendMessage();
                    }}
                    disabled={sending}
                    style={{ minWidth: 0 }}
                  />
                  <button
                    className={styles.sendButton}
                    onClick={sendMessage}
                    disabled={sending || (!messageInput.trim() && !file)}
                    style={{ fontSize: 16 }}
                    type="button"
                  >
                    {sending ? <Loader2 className="animate-spin" size={20} /> : <SendHorizonal size={20} />}
                    {sending ? "Slanje..." : "Pošalji"}
                  </button>
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
