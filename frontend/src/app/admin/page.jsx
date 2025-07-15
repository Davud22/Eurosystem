"use client"

import { useState, useEffect } from "react"
import {
  Users,
  Package,
  ShoppingCart,
  MessageCircle,
  FileText,
  Camera,
  BarChart3,
  Mail,
  Settings,
  Eye,
  Star,
  UserPlus,
  Trash2,
  UserX,
  UserCheck,
  Paperclip,
  SendHorizonal,
  Loader2,
} from "lucide-react"
import Header from "../components/Header/Header"
import styles from "./Admin.module.css"
import Link from "next/link";
import { useRef } from "react";
import { useAuth } from "../../hooks/useAuth"

export default function AdminDashboard() {
  // SVI HOOKOVI NA VRHU, REDOSLIJED KAO PRI PRVOM RENDERU
  const { user, loading, error, logout } = useAuth('admin');
  const [activeTab, setActiveTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [blockUserId, setBlockUserId] = useState(null);
  const [blogStats, setBlogStats] = useState({ total: 0, avgRating: 0, totalComments: 0, top: [] });
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [deleteOrderId, setDeleteOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  // Email state
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailUserId, setEmailUserId] = useState(""); // "" za sve
  const [emailStatus, setEmailStatus] = useState("");
  // Dashboard stats state
  const [dashboardStats, setDashboardStats] = useState({
    total_archived: 0,
    total_current: 0,
    recent_orders: [],
    top_products: []
  });
  // Chat state for selected user and messages
  const [selectedChatUser, setSelectedChatUser] = useState("1");
  const chatUsers = [
    { id: "1", name: "Davud Fazlic" },
    { id: "2", name: "Ana Jovanović" },
    { id: "3", name: "Stefan Nikolić" },
  ];
  const chatMessages = [
    { id: 1, sender: "admin", text: "Pozdrav! Kako mogu da vam pomognem?", time: "14:30" },
    { id: 2, sender: "user", text: "Imam pitanje za narudžbu #123...", time: "14:31" },
    { id: 3, sender: "admin", text: "Slobodno pitajte!", time: "14:32" },
  ];
  const BACKEND_URL = "http://localhost:8000";

  // Svi useEffect hooks - uvijek se pozivaju
  useEffect(() => {
    if (activeTab === "products") {
      setLoadingProducts(true);
      fetch(`${BACKEND_URL}/admin/products`)
        .then(res => res.json())
        .then(data => setProducts(data))
        .catch(() => setProducts([]))
        .finally(() => setLoadingProducts(false));
    }
  }, [activeTab, BACKEND_URL]);
  
  useEffect(() => {
    if (activeTab === "users") {
      setLoadingUsers(true);
      fetch(`${BACKEND_URL}/admin/users`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(() => setUsers([]))
        .finally(() => setLoadingUsers(false));
    }
  }, [activeTab, BACKEND_URL]);
  
  useEffect(() => {
    if (modal.open) {
      const timeout = setTimeout(() => setModal({ ...modal, open: false }), 3000);
      return () => clearTimeout(timeout);
    }
  }, [modal.open, modal]);

  useEffect(() => {
    fetch("http://localhost:8000/admin/blogs")
      .then(res => res.json())
      .then(data => {
        if (!Array.isArray(data)) return;
        const total = data.length;
        const avgRating = total ? (data.reduce((a, b) => a + (b.avg_rating || 0), 0) / total) : 0;
        const totalComments = data.reduce((a, b) => a + (b.num_comments || 0), 0);
        const top = [...data].sort((a, b) => b.avg_rating - a.avg_rating).slice(0, 3);
        setBlogStats({ total, avgRating, totalComments, top });
      });
  }, []);

  useEffect(() => {
    fetch(`${BACKEND_URL}/admin/blogs`)
      .then(res => res.json())
      .then(data => {
        setBlogs(data);
        setLoadingBlogs(false);
      });
  }, [BACKEND_URL]);

  useEffect(() => {
    if (activeTab === "portfolio") {
      setLoadingProjects(true);
      fetch(`${BACKEND_URL}/admin/projects`)
        .then(res => res.json())
        .then(data => setProjects(data))
        .catch(() => setProjects([]))
        .finally(() => setLoadingProjects(false));
    }
  }, [activeTab, BACKEND_URL]);

  // Dohvati korisnike za email dropdown
  useEffect(() => {
    if (activeTab === "email") {
      fetch(`${BACKEND_URL}/admin/users`)
        .then(res => res.json())
        .then(data => setUsers(data))
        .catch(() => setUsers([]));
    }
  }, [activeTab, BACKEND_URL]);

  // Dohvati narudžbe
  useEffect(() => {
    if (activeTab === "orders") {
      setLoadingOrders(true);
      fetch(`${BACKEND_URL}/orders/`)
        .then(res => res.json())
        .then(data => Array.isArray(data) ? setOrders(data) : setOrders([]))
        .catch(() => setOrders([]))
        .finally(() => setLoadingOrders(false));
    }
  }, [activeTab, BACKEND_URL]);

  // Ukloni sve vezano za orders, loadingOrders, deleteOrderId, selectedOrder, showOrderModal, handleOrderStatusChange, handleDeleteOrder

  // Dashboard stats state
  useEffect(() => {
    if (activeTab === "overview") {
      fetch(`${BACKEND_URL}/orders/dashboard-stats`)
        .then(res => res.json())
        .then(data => setDashboardStats(data));
    }
  }, [activeTab, BACKEND_URL]);

  // Ako se učitava, prikaži loading
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Učitavanje...
      </div>
    )
  }

  // Ako nema korisnika, neće se prikazati (useAuth će preusmjeriti)
  if (!user) {
    return null
  }

  const stats = {
    totalUsers: 1247,
    totalOrders: 89,
    totalProducts: 156,
    avgRating: 4.8,
    todayOrders: 12,
    newUsers: 23,
  }

  // recentOrders i topProducts sada dolaze iz dashboardStats
  const recentOrders = dashboardStats.recent_orders || [];
  const topProducts = dashboardStats.top_products || [];

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "processing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Na čekanju"
      case "processing":
        return "U izradi"
      case "completed":
        return "Završeno"
      default:
        return status
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    // Ukloni i cookie
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    fetch("/api/logout").then(() => {
      window.location.replace("/prijava");
    });
  }

  // Brisanje proizvoda
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Proizvod uspješno obrisan!", type: "success" });
      setProducts(products.filter(p => p.id !== id));
      setDeleteId(null);
    } catch {
      setModal({ open: true, message: "Greška pri brisanju!", type: "error" });
    }
  };
  
  // Brisanje korisnika
  const handleDeleteUser = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Korisnik uspješno obrisan!", type: "success" });
      setUsers(users.filter(u => u.id !== id));
      setDeleteUserId(null);
    } catch {
      setModal({ open: true, message: "Greška pri brisanju korisnika!", type: "error" });
    }
  };
  
  // Blokiranje korisnika
  const handleBlockUser = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${id}/block`, { method: "POST" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Korisnik uspješno blokiran!", type: "success" });
      setUsers(users.map(u => u.id === id ? { ...u, is_active: false } : u));
      setBlockUserId(null);
    } catch {
      setModal({ open: true, message: "Greška pri blokiranju korisnika!", type: "error" });
    }
  };
  
  // Aktiviranje korisnika
  const handleUnblockUser = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/users/${id}/unblock`, { method: "POST" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Korisnik uspješno aktiviran!", type: "success" });
      setUsers(users.map(u => u.id === id ? { ...u, is_active: true } : u));
    } catch {
      setModal({ open: true, message: "Greška pri aktiviranju korisnika!", type: "error" });
    }
  };
  
  // Uređivanje proizvoda
  const handleEditSave = async (updated) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/products/${updated.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: updated.name,
          description: updated.description,
          price: parseFloat(updated.price),
          category: updated.category,
          image_url: updated.image_url || (updated.images && updated.images[0]?.url) || "",
          specifications: updated.specifications,
          in_stock: updated.in_stock,
          featured: updated.featured,
        }),
      });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Proizvod uspješno ažuriran!", type: "success" });
      setEditModalOpen(false);
      // Osvježi listu
      fetch(`${BACKEND_URL}/admin/products`)
        .then(res => res.json())
        .then(data => setProducts(data));
    } catch {
      setModal({ open: true, message: "Greška pri ažuriranju!", type: "error" });
    }
  };
  
  const categories = [
    "Alarmni sistemi",
    "Videonadzor",
    "Pametne instalacije",
    "Kućni sistemi",
    "Poslovni sistemi",
    "Održavanje",
  ];
  
  // Modal za uređivanje proizvoda
  function EditProductModal({ product, onSave, onClose }) {
    const [form, setForm] = useState({ ...product });
    const categories = [
      "Videonadzor",
      "Alarmni sistemi",
      "Kapije", 
      "Klima uređaji",
      "Elektroinstalacioni radovi"
    ];
    // Dodaj polje za sliku
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h2 style={{ marginBottom: 16 }}>Uredi proizvod</h2>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={styles.input} />
          <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className={styles.textarea} />
          <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} className={styles.input} />
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={styles.input}>
            <option value="">Izaberite kategoriju</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {/* Prikaz slike */}
          {form.image_url && (
            <div style={{ margin: '16px 0', textAlign: 'center' }}>
              <img src={form.image_url.startsWith('/images/') ? `http://localhost:8000${form.image_url}` : form.image_url} alt="slika" style={{ width: 120, height: 120, objectFit: 'contain', borderRadius: 8, background: '#fff', border: '1px solid #eee' }} />
            </div>
          )}
          <div style={{ display: "flex", gap: 8, margin: "16px 0 0 0" }}>
            <button onClick={() => onSave({ ...form, id: product.id })} className={styles.submitButton}>Spremi</button>
            <button onClick={onClose} className={styles.cancelButton}>Otkaži</button>
          </div>
        </div>
      </div>
    );
  }

  // Formatiranje datuma
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('bs-BA');
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    try {
      const res = await fetch(`${BACKEND_URL}/admin/projects/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Projekt uspješno obrisan!", type: "success" });
      setProjects(projects.filter(p => p.id !== id));
      setDeleteProjectId(null);
    } catch {
      setModal({ open: true, message: "Greška pri brisanju projekta!", type: "error" });
    }
  };

  // Uklanjam funkciju za update projekata i sve povezano s editiranjem projekata

  const fetchBlogs = () => {
    fetch(`${BACKEND_URL}/admin/blogs`)
      .then(res => res.json())
      .then(data => setBlogs(data));
  };

  // Promjena statusa narudžbe
  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${BACKEND_URL}/orders/${orderId}/status?status=${encodeURIComponent(newStatus)}`, { method: "PATCH" });
      if (!res.ok) throw new Error();
      setOrders(orders => orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setModal({ open: true, message: "Status narudžbe ažuriran!", type: "success" });
    } catch {
      setModal({ open: true, message: "Greška pri promjeni statusa!", type: "error" });
    }
  };

  // Brisanje narudžbe
  // Ukloni sve vezano za orders, loadingOrders, deleteOrderId, selectedOrder, showOrderModal, handleOrderStatusChange, handleDeleteOrder

  const handleArchiveOrder = async (orderId) => {
    await fetch(`${BACKEND_URL}/orders/${orderId}/archive`, { method: "PATCH" });
    setOrders(orders => orders.filter(o => o.id !== orderId));
  };

  return (
    <div className={styles.admin}>
      <Header />

      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.adminProfile}>
            <div className={styles.avatar}>
              <Settings size={32} />
            </div>
            <div className={styles.adminInfo}>
              <h3 className={styles.adminName}>Admin Panel</h3>
              <p className={styles.adminRole}>Eurosystem CMS</p>
            </div>
          </div>

          <nav className={styles.nav}>
            <button
              onClick={() => setActiveTab("overview")}
              className={`${styles.navItem} ${activeTab === "overview" ? styles.active : ""}`}
            >
              <BarChart3 size={20} />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`${styles.navItem} ${activeTab === "users" ? styles.active : ""}`}
            >
              <Users size={20} />
              Korisnici
            </button>
            <button
              onClick={() => setActiveTab("products")}
              className={`${styles.navItem} ${activeTab === "products" ? styles.active : ""}`}
            >
              <Package size={20} />
              Proizvodi
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`${styles.navItem} ${activeTab === "orders" ? styles.active : ""}`}
            >
              <ShoppingCart size={20} />
              Narudžbe
            </button>
            <button
              onClick={() => setActiveTab("comments")}
              className={`${styles.navItem} ${activeTab === "comments" ? styles.active : ""}`}
            >
              <MessageCircle size={20} />
              Chat
            </button>
            <button
              onClick={() => setActiveTab("blog")}
              className={`${styles.navItem} ${activeTab === "blog" ? styles.active : ""}`}
            >
              <FileText size={20} />
              Blog
            </button>
            <button
              onClick={() => setActiveTab("portfolio")}
              className={`${styles.navItem} ${activeTab === "portfolio" ? styles.active : ""}`}
            >
              <Camera size={20} />
              Naši radovi
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`${styles.navItem} ${activeTab === "email" ? styles.active : ""}`}
            >
              <Mail size={20} />
              Email
            </button>
            {/* Dugme Odjava ispod Email */}
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              style={{ marginTop: 24 }}
            >
              Odjava
            </button>
          </nav>
        </div>

        <main className={styles.main}>
          {activeTab === "overview" && (
            <div className={styles.overview}>
              <div className={styles.header}>
                <h1 className={styles.pageTitle}>Dashboard pregled</h1>
                <p className={styles.pageSubtitle}>Dobrodošli u Eurosystem admin panel</p>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Users size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_users}</h3>
                    <p className={styles.statLabel}>Ukupno korisnika</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_orders}</h3>
                    <p className={styles.statLabel}>Ukupno narudžbi</p>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_current}</h3>
                    <p className={styles.statLabel}>Trenutne narudžbe</p>
                    <span className={styles.statChange}>Aktivne</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <ShoppingCart size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_archived}</h3>
                    <p className={styles.statLabel}>Arhivirane narudžbe</p>
                    <span className={styles.statChange}>Skriveno</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Package size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_products}</h3>
                    <p className={styles.statLabel}>Proizvodi</p>
                    <span className={styles.statChange}>Aktivni</span>
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <Star size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.avg_blog_rating}</h3>
                    <p className={styles.statLabel}>Prosečna ocjena</p>
                    <span className={styles.statChange}>Blogovi</span>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <FileText size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_blogs}</h3>
                    <p className={styles.statLabel}>Blogova</p>
                  </div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statIcon}>
                    <MessageCircle size={24} />
                  </div>
                  <div className={styles.statContent}>
                    <h3 className={styles.statNumber}>{dashboardStats.total_blog_comments}</h3>
                    <p className={styles.statLabel}>Komentara na blogovima</p>
                  </div>
                </div>
              </div>

              <div className={styles.contentGrid}>
                <div className={styles.recentOrders}>
                  <h2 className={styles.sectionTitle}>Nedavne narudžbe</h2>
                  <div className={styles.table}>
                    <div className={styles.tableHeader}>
                      <span>Narudžba</span>
                      <span>Kupac</span>
                      <span>Status</span>
                      <span>Iznos</span>
                      <span>Datum</span>
                    </div>
                    {recentOrders.length === 0 ? (
                      <div className={styles.tableRow} style={{ textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        Nema nedavnih narudžbi.
                      </div>
                    ) : recentOrders.map((order) => (
                      <div key={order.id} className={styles.tableRow}>
                        <span className={styles.orderId}>#{order.code}</span>
                        <span style={{ fontWeight: 500 }}>{order.user ? `${order.user.first_name} ${order.user.last_name}` : '-'}</span>
                        <span className={`${styles.status} ${getStatusColor(order.status)}`} style={{ fontWeight: 500 }}>
                          {getStatusText(order.status)}
                        </span>
                        <span className={styles.amount}><b>{order.amount.toLocaleString()}</b> <span style={{ fontWeight: 400 }}>KM</span></span>
                        <span>{order.created_at ? formatDate(order.created_at) : '-'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.topProducts}>
                  <h2 className={styles.sectionTitle}>Najpopularniji proizvodi</h2>
                  <div className={styles.productsList}>
                    {topProducts.map((product, idx) => (
                      <div key={product.id} className={styles.productItem}>
                        <span className={styles.productRank}>#{idx + 1}</span>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productStats}><ShoppingCart size={16} style={{ marginRight: 4 }} /> {product.total_sold}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className={styles.topProducts}>
                  <h2 className={styles.sectionTitle}>Top blogovi</h2>
                  <div className={styles.productsList}>
                    {blogStats.top.map((blog, idx) => (
                      <div key={blog.id} className={styles.productItem}>
                        <div className={styles.productRank}>#{idx + 1}</div>
                        <div className={styles.productInfo}>
                          <h4 className={styles.productName}>{blog.title}</h4>
                          <div className={styles.productStats}>
                            <span className={styles.productViews}>
                              <FileText size={14} />
                              {blog.num_comments} komentara
                            </span>
                            <span className={styles.productSales}>
                              ★ {blog.avg_rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className={styles.usersSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Upravljanje korisnicima</h1>
                <div className={styles.userStats}>
                  <span>Ukupno: {users.length}</span>
                  <span>Aktivni: {users.filter(u => u.is_active).length}</span>
                  <span>Blokirani: {users.filter(u => !u.is_active).length}</span>
                </div>
              </div>
              {modal.open && (
                <div style={{ background: modal.type === "success" ? "#d1fae5" : "#fee2e2", color: modal.type === "success" ? "#047857" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
              )}
              {loadingUsers ? (
                <div>Učitavanje korisnika...</div>
              ) : (
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <span>Ime i prezime</span>
                    <span>Email</span>
                    
                    <span>Datum registracije</span>
                    <span>Status</span>
                    <span>Akcije</span>
                  </div>
                  {users.map((user) => (
                    <div key={user.id} className={styles.tableRow}>
                      <span>{user.first_name} {user.last_name}</span>
                      <span>{user.email}</span>
                      
                      <span>{formatDate(user.created_at)}</span>
                      <span className={user.is_active ? styles.statusActive : styles.statusBlocked}>
                        {user.is_active ? "Aktivan" : "Blokiran"}
                      </span>
                      <span className={styles.actions}>
                        {user.is_active ? (
                          <button 
                            onClick={() => setBlockUserId(user.id)} 
                            className={styles.userBlockButton}
                            title="Blokiraj korisnika"
                          >
                            <UserX size={16} />
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUnblockUser(user.id)} 
                            className={styles.userUnblockButton}
                            title="Aktiviraj korisnika"
                          >
                            <UserCheck size={16} />
                          </button>
                        )}
                        <button 
                          onClick={() => setDeleteUserId(user.id)} 
                          className={styles.userDeleteButton}
                          title="Obriši korisnika"
                        >
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Modal za potvrdu brisanja korisnika */}
              {deleteUserId && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Jeste li sigurni da želite obrisati ovog korisnika?</h3>
                    <p style={{ color: "#666", marginBottom: 16 }}>Ova akcija se ne može poništiti.</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button onClick={() => handleDeleteUser(deleteUserId)} className={styles.deleteButton}>Obriši</button>
                      <button onClick={() => setDeleteUserId(null)} className={styles.cancelButton}>Otkaži</button>
                    </div>
                  </div>
                </div>
              )}
              {/* Modal za potvrdu blokiranja korisnika */}
              {blockUserId && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Jeste li sigurni da želite blokirati ovog korisnika?</h3>
                    <p style={{ color: "#666", marginBottom: 16 }}>Korisnik neće moći pristupiti sistemu.</p>
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button onClick={() => handleBlockUser(blockUserId)} className={styles.blockButton}>Blokiraj</button>
                      <button onClick={() => setBlockUserId(null)} className={styles.cancelButton}>Otkaži</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <div className={styles.sectionHeader}>
                <h2>Proizvodi</h2>
                <Link href="/admin/dodaj-proizvod" className={styles.addButton}>Dodaj proizvod</Link>
              </div>
              {products.length === 0 && !loadingProducts && (
                <div className={styles.emptyState}>
                  Trenutno nema proizvoda. Dodajte prvi proizvod klikom na "Dodaj proizvod".
                </div>
              )}
              {modal.open && (
                <div style={{ background: modal.type === "success" ? "#d1fae5" : "#fee2e2", color: modal.type === "success" ? "#047857" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
              )}
              {loadingProducts ? (
                <div>Učitavanje...</div>
              ) : (
                <div className={styles.productsGrid}>
                  {products.map(product => (
                    <div key={product.id} className={styles.productCard}>
                      <img
                        src={product.image_url ? `http://localhost:8000${product.image_url}` : "/placeholder.svg"} alt={product.name} style={{ maxWidth: 80, maxHeight: 80, objectFit: 'cover', borderRadius: 8 }} />
                      <div className={styles.productInfo}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <div className={styles.productPrice}>{product.price} KM</div>
                        {product.category && <div style={{ color: "#666", fontSize: 14, marginBottom: 8 }}>Kategorija: {product.category}</div>}
                        <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
                          <button onClick={() => { setEditProduct(product); setEditModalOpen(true); }} className={styles.productEditButton}>Edit</button>
                          <button onClick={() => setDeleteId(product.id)} className={styles.productDeleteButton}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Modal za potvrdu brisanja */}
              {deleteId && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Jeste li sigurni da želite obrisati ovaj proizvod?</h3>
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button onClick={() => handleDelete(deleteId)} className={styles.deleteButton}>Obriši</button>
                      <button onClick={() => setDeleteId(null)} className={styles.cancelButton}>Otkaži</button>
                    </div>
                  </div>
                </div>
              )}
              {/* Modal za uređivanje proizvoda */}
              {editModalOpen && editProduct && (
                <EditProductModal product={editProduct} onSave={handleEditSave} onClose={() => setEditModalOpen(false)} />
              )}
            </div>
          )}

          {activeTab === "orders" && (
            <div className={styles.ordersSection}>
              <h1 className={styles.pageTitle}>Upravljanje narudžbama</h1>
              {modal.open && (
                <div style={{ background: modal.type === "success" ? "#d1fae5" : "#fee2e2", color: modal.type === "success" ? "#047857" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
              )}
              {loadingOrders ? (
                <div>Učitavanje narudžbi...</div>
              ) : (
                <div className={styles.table}>
                  <div className={styles.tableHeader}>
                    <span>ID</span>
                    <span>Kupac</span>
                    <span>Telefon</span>
                    <span>Status</span>
                    <span>Iznos</span>
                    <span>Datum</span>
                    <span>Akcije</span>
                  </div>
                  {Array.isArray(orders) && orders.map((order) => (
                    <div key={order.id} className={styles.tableRow}>
                      <span>#{order.id}</span>
                      <span>{order.user?.first_name} {order.user?.last_name}</span>
                      <span>{order.user?.phone || '-'}</span>
                      <span>
                        <select
                          value={order.status}
                          onChange={e => handleOrderStatusChange(order.id, e.target.value)}
                          className={styles.statusSelect}
                        >
                          <option value="pending">Na čekanju</option>
                          <option value="processing">U izradi</option>
                          <option value="completed">Završeno</option>
                        </select>
                      </span>
                      <span>{order.items && order.items.length > 0 ? order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString() + ' KM' : '-'}</span>
                      <span>{order.created_at ? formatDate(order.created_at) : '-'}</span>
                      <span className={styles.actions}>
                        <button className={styles.viewButton} onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }}>Pogledaj</button>
                        <button className={styles.archiveButton} onClick={() => handleArchiveOrder(order.id)}>
                          Arhiviraj
                        </button>
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {/* Modal za detalje narudžbe */}
              {showOrderModal && selectedOrder && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent} style={{ maxWidth: 600 }}>
                    <h2>Detalji narudžbe #{selectedOrder.id}</h2>
                    <div style={{ marginBottom: 12 }}>
                      <b>Kupac:</b> {selectedOrder.user?.first_name} {selectedOrder.user?.last_name}<br />
                      <b>Email:</b> {selectedOrder.user?.email}<br />
                      <b>Telefon:</b> {selectedOrder.user?.phone || '-'}
                    </div>
                    <div style={{ marginBottom: 12 }}>
                      <b>Status:</b> {getStatusText(selectedOrder.status)}<br />
                      <b>Datum:</b> {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : '-'}
                    </div>
                    <div>
                      <b>Proizvodi:</b>
                      <div style={{ marginTop: 8 }}>
                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                          <table className={styles.orderModalTable}>
                            <thead>
                              <tr>
                                <th style={{ padding: 8, textAlign: 'left' }}>Slika</th>
                                <th style={{ padding: 8, textAlign: 'left' }}>Naziv</th>
                                <th style={{ padding: 8, textAlign: 'left' }}>Količina</th>
                                <th style={{ padding: 8, textAlign: 'left' }}>Cijena/kom</th>
                                <th style={{ padding: 8, textAlign: 'left' }}>Ukupno</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedOrder.items.map((item, idx) => (
                                <tr key={idx}>
                                  <td>
                                    {item.product?.image_url ? (
                                      <img src={`http://localhost:8000${item.product.image_url}`} alt={item.product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} />
                                    ) : (
                                      <div style={{ width: 48, height: 48, background: '#f3f4f6', borderRadius: 6 }} />
                                    )}
                                  </td>
                                  <td>{item.product?.name || '-'}</td>
                                  <td>{item.quantity}</td>
                                  <td>{item.price.toLocaleString()} KM</td>
                                  <td>{(item.price * item.quantity).toLocaleString()} KM</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div style={{ color: '#aaa' }}>Nema proizvoda.</div>
                        )}
                      </div>
                      <div style={{ marginTop: 16, textAlign: 'right', fontWeight: 600, fontSize: 18 }}>
                        Ukupno: {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.reduce((sum, i) => sum + (i.price * i.quantity), 0).toLocaleString() + ' KM' : '-'}
                      </div>
                    </div>
                    <div style={{ marginTop: 24, textAlign: 'right' }}>
                      <button onClick={() => setShowOrderModal(false)} className={styles.cancelButton}>Zatvori</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "comments" && (
            <div className={styles.chatSection}>
              <h1 className={styles.pageTitle}>Admin Chat</h1>
              <AdminChat />
            </div>
          )}

          {activeTab === "blog" && (
            <div className={styles.blogSection}>
              <div className={styles.sectionHeader}>
                <h1 className={styles.pageTitle}>Blog upravljanje</h1>
                <Link href="/admin/dodaj-blog" className={styles.addButton}>
                  <FileText size={20} /> Nova objava
                </Link>
              </div>
              {loadingBlogs ? (
                <p>Učitavanje blogova...</p>
              ) : blogs.length === 0 ? (
                <p className={styles.emptyState}>Nema blog objava.</p>
              ) : (
                <div className={styles.productsGrid}>
                  {blogs.map(blog => (
                    <div key={blog.id} className={styles.productCard}>
                      <img
                        src={blog.image_url ? (blog.image_url.startsWith("/images/") ? `${BACKEND_URL}${blog.image_url}` : blog.image_url) : "/placeholder.svg"}
                        alt={blog.title}
                        className={styles.productImage}
                        style={{ border: "2px solid #ddd", background: "#fff" }}
                      />
                      <div className={styles.productInfo}>
                        <h3>{blog.title}</h3>
                        <p style={{ color: "#888", fontSize: 14, margin: "4px 0" }}>
                          Autor: {blog.author} | {new Date(blog.created_at).toLocaleDateString("bs-BA")}<br/>
                          Komentara: {blog.num_comments} | Ocjena: {blog.avg_rating?.toFixed(1) ?? "-"}
                          {blog.category && <><br/>Kategorija: {blog.category}</>}
                        </p>
                        <p>{blog.content.slice(0, 100)}...</p>
                        <div style={{ display: "flex", gap: 8, marginLeft: "auto", marginTop: 8 }}>
                          <Link href={`/admin/blog/${blog.id}`} className={styles.editButton}>Detalji</Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "portfolio" && (
            <div className={styles.portfolioSection}>
              <div className={styles.portfolioHeader}>
                <h1 className={styles.pageTitle}>Naši radovi</h1>
                <Link href="/admin/dodaj-projekat" className={styles.submitButton} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Camera size={20} /> Dodaj projekt
                </Link>
              </div>
              {modal.open && (
                <div style={{ background: modal.type === "success" ? "#e0ffe0" : "#fee2e2", color: modal.type === "success" ? "#0a0" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
              )}
              {loadingProjects ? (
                <div>Učitavanje...</div>
              ) : projects.length === 0 ? (
                <div style={{ textAlign: "center", color: "#aaa", marginTop: 48 }}>Nema radova. Dodajte prvi projekt!</div>
              ) : (
                <div className={styles.projectGrid}>
                  {projects.map((project) => (
                    <div key={project.id} className={styles.projectCard} style={{ position: 'relative' }}>
                      <ProjectImages images={project.images} />
                      <div className={styles.projectContent}>
                        <h3 className={styles.projectTitle}>{project.title}</h3>
                        <p className={styles.projectDescription}>{project.description}</p>
                        <div className={styles.projectMeta}>
                          {project.created_at ? new Date(project.created_at).toLocaleDateString('bs-BA') : ""}
                          {project.category && <><br/>Kategorija: {project.category}</>}
                        </div>
                        {/* Delete button bottom right */}
                        <button
                          onClick={() => setDeleteProjectId(project.id)}
                          className={styles.deleteButton}
                          style={{ position: 'absolute', right: 18, bottom: 18, zIndex: 2 }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Modal za edit */}
              {/* Potvrda za delete */}
              {deleteProjectId && (
                <div className={styles.modalOverlay}>
                  <div className={styles.modalContent}>
                    <h3>Jeste li sigurni da želite obrisati projekt?</h3>
                    <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                      <button onClick={() => handleDeleteProject(deleteProjectId)} className={styles.deleteButton}>Obriši</button>
                      <button onClick={() => setDeleteProjectId(null)} className={styles.cancelButton}>Otkaži</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "email" && (
            <div className={styles.emailSection}>
              <h1 className={styles.pageTitle}>Email notifikacije</h1>
              <form className={styles.emailForm} onSubmit={async e => {
                e.preventDefault();
                setEmailStatus("Šaljem...");
                const res = await fetch(`${BACKEND_URL}/admin/email`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user_id: emailUserId === "" ? null : Number(emailUserId),
                    subject: emailSubject,
                    message: emailMessage,
                  }),
                });
                if (res.ok) {
                  setEmailStatus("Email poslan!");
                  setEmailSubject("");
                  setEmailMessage("");
                  setEmailUserId("");
                } else {
                  setEmailStatus("Greška pri slanju!");
                }
              }}>
                <div className={styles.formGroup}>
                  <label>Naslov</label>
                  <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="Unesite naslov email-a" required />
                </div>
                <div className={styles.formGroup}>
                  <label>Poruka</label>
                  <textarea rows={5} value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="Unesite sadržaj poruke" required></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label>Pošalji</label>
                  <select value={emailUserId} onChange={e => setEmailUserId(e.target.value)}>
                    <option value="">Svim korisnicima</option>
                    {users.map(u => (
                      <option key={u.id} value={u.id}>{u.first_name} {u.last_name} ({u.email})</option>
                    ))}
                  </select>
                </div>
                <button className={styles.sendEmailButton} type="submit">
                  <Mail size={20} /> Pošalji email
                </button>
                {emailStatus && <div style={{ marginTop: 12, color: emailStatus.includes("poslan") ? "#059669" : "#b91c1c", fontWeight: 500 }}>{emailStatus}</div>}
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function ProjectImages({ images }) {
  const [mainIdx, setMainIdx] = useState(0);
  if (!images || images.length === 0) {
    return <div className={styles.projectImagePlaceholder}>Nema slike</div>;
  }
  const mainImage = images[mainIdx]?.startsWith("/images/") ? `http://localhost:8000${images[mainIdx]}` : images[mainIdx];
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginBottom: 12, padding: 12 }}>
      <div style={{
        width: 240,
        height: 150,
        borderRadius: 12,
        background: "#f3f4f6",
        border: "1.5px solid #e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        overflow: "hidden"
      }}>
        <img src={mainImage} alt="slika projekta" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      </div>
      <div style={{ display: "flex", gap: 8, justifyContent: "center", padding: 4 }}>
        {images.map((img, idx) => (
          <div key={idx} style={{
            width: 48,
            height: 32,
            borderRadius: 6,
            border: idx === mainIdx ? "2px solid #3b82f6" : "1.5px solid #e5e7eb",
            overflow: "hidden",
            cursor: "pointer",
            background: "#f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
            onClick={() => setMainIdx(idx)}
          >
            <img
              src={img.startsWith("/images/") ? `http://localhost:8000${img}` : img}
              alt="slika projekta"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminChat() {
  const { user } = useAuth('admin');
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedChatUser, setSelectedChatUser] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState("");
  const [userOnline, setUserOnline] = useState(false);
  const ws = useRef(null);
  const messagesEndRef = useRef(null);
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : "";
  const BACKEND_URL = "http://localhost:8000";
  const [filePreview, setFilePreview] = useState(null);
  const [imgLoading, setImgLoading] = useState(false);
  const [imgLoaded, setImgLoaded] = useState({});

  // Fetch chat partners
  useEffect(() => {
    if (!token) return;
    fetch(`${BACKEND_URL}/chat/partners`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setChatUsers(data) : setChatUsers([]))
      .catch(() => setChatUsers([]));
  }, [token]);

  // Fetch messages and online status
  useEffect(() => {
    if (!selectedChatUser || !token) return;
    setLoadingMessages(true);
    setError("");
    fetch(`${BACKEND_URL}/chat/messages/${selectedChatUser}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setChatMessages(data) : setChatMessages([]))
      .catch(() => setChatMessages([]))
      .finally(() => setLoadingMessages(false));
    fetch(`${BACKEND_URL}/chat/mark-read/${selectedChatUser}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });
    // Online status
    fetch(`${BACKEND_URL}/chat/status/${selectedChatUser}`)
      .then(res => res.json())
      .then(data => setUserOnline(data.online))
      .catch(() => setUserOnline(false));
  }, [selectedChatUser, token]);

  // WebSocket
  useEffect(() => {
    if (!selectedChatUser || !token) return;
    ws.current = new window.WebSocket(
      `ws://localhost:8000/chat/ws/${selectedChatUser}?token=${token}`
    );
    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setChatMessages(prev => [...prev, msg]);
    };
    ws.current.onerror = () => setError("Greška u konekciji na chat server.");
    ws.current.onclose = () => {};
    return () => ws.current && ws.current.close();
  }, [selectedChatUser, token]);

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  // Helper to merge optimistic and real messages (by timestamp)
  function mergeMessages(messages) {
    const seen = new Set();
    return messages.filter(msg => {
      const key = msg.timestamp + '_' + msg.sender_id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  // Helper za theme
  function getBubbleClass(isAdmin) {
    const theme = document.body.dataset.theme === 'dark' ? 'dark' : 'light';
    if (isAdmin) return styles[`chat-bubble-admin-${theme}`];
    return styles[`chat-bubble-user-${theme}`];
  }
  function getTimeClass() {
    return document.body.dataset.theme === 'dark' ? styles['chat-time-dark'] : styles['chat-time-light'];
  }
  function getChatMessagesClass() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return styles['chatMessagesDark'];
    }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return styles['chatMessagesWhite'];
    }
    // fallback: bijeli box
    return styles['chatMessagesWhite'];
  }

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

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <label htmlFor="userSelect" style={{ fontWeight: 500, marginRight: 8 }}>Izaberi korisnika:</label>
        <select
          id="userSelect"
          value={selectedChatUser}
          onChange={e => setSelectedChatUser(e.target.value)}
          style={{ padding: 8, borderRadius: 6, minWidth: 220 }}
        >
          <option value="">Izaberi korisnika</option>
          {chatUsers.map(u => (
            <option key={u.id} value={u.id}>
              {u.first_name} {u.last_name} ({u.email})
            </option>
          ))}
        </select>
        {selectedChatUser && (
          <span style={{ marginLeft: 16, color: userOnline ? '#22c55e' : '#ef4444', fontWeight: 600 }}>
            {userOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
      {selectedChatUser && (
        <div className={styles.chatContainer} style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className={styles.chatHeader}>
            <h3>
              Chat sa korisnikom: {
                chatUsers.find(u => String(u.id) === String(selectedChatUser)) ?
                  `${chatUsers.find(u => String(u.id) === String(selectedChatUser)).first_name} ${chatUsers.find(u => String(u.id) === String(selectedChatUser)).last_name}` : ""
              }
            </h3>
          </div>
          <div
            className={styles.chatMessages}
            style={{
              height: 320,
              overflowY: "auto",
              marginBottom: 8,
              display: "flex",
              flexDirection: "column"
            }}
          >
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
                    key={msg.id + '_' + msg.timestamp}
                    className={getBubbleClass(msg.sender_id === user?.id)}
                    style={{
                      alignSelf: msg.sender_id === user?.id ? "flex-end" : "flex-start",
                      borderRadius: 18,
                      marginBottom: 12,
                      maxWidth: '70%',
                      boxShadow: '0 2px 8px #0002',
                    }}
                  >
                    {typeof msg.attachment_url === "string" && msg.attachment_url !== "" && (
                      <img
                        src={`http://localhost:8000${msg.attachment_url}`}
                        alt="slika"
                        className={styles["chat-image"]}
                        style={{ marginBottom: msg.content ? 8 : 0 }}
                        onError={e => e.target.style.display = 'none'}
                      />
                    )}
                    {msg.content && (
                      <span style={{ wordBreak: "break-word", fontSize: 16 }}>{msg.content}</span>
                    )}
                    <span className={getTimeClass()}>
                      {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      {/* KVAKE: prikaz samo za poruke koje je poslao admin */}
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
          {/* Modern chat input UI */}
          <div className={styles["chat-input-bar"]} style={{margin:'0 10px 10px 10px'}}>
            {/* File upload button with icon */}
            <label className="cursor-pointer flex items-center justify-center" title="Dodaj privitak" style={{ width: 48, height: 48, marginBottom:0 }}>
              <Paperclip size={26} className="text-[#94a3b8]" />
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={sending}
                tabIndex={-1}
                style={{display:'none'}}
              />
            </label>
            {/* Preview slike */}
            {filePreview && (
              <div className="relative mr-2">
                <img src={filePreview} alt="preview" className={styles["chat-image"]} />
                <button
                  onClick={() => { setFile(null); setFilePreview(null); }}
                  className="absolute -top-2 -right-2 bg-[#ef4444] text-white rounded-full w-6 h-6 flex items-center justify-center text-base shadow"
                  style={{ border: 'none' }}
                  title="Ukloni sliku"
                  type="button"
                >×</button>
              </div>
            )}
            {/* Poruka input */}
            <input
              type="text"
              placeholder="Ukucajte poruku..."
              className={styles["chat-input"]}
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && (messageInput.trim() || file)) sendMessage();
              }}
              disabled={sending}
              style={{ minWidth: 0 }}
            />
            {/* Pošalji dugme s ikonom */}
            <button
              className={styles["chat-send-btn"]}
              onClick={sendMessage}
              disabled={sending || (!messageInput.trim() && !file)}
              style={{ fontSize: 18 }}
              type="button"
            >
              {sending ? <Loader2 className="animate-spin" size={24} /> : <SendHorizonal size={24} />}
              {sending ? "Slanje..." : "Pošalji"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
