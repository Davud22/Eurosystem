"use client";
import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Admin.module.css";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../../hooks/useAuth";

const BACKEND_URL = "http://localhost:8000";

export default function DodajBlogPage() {
  // Prvo svi hooks - redoslijed mora biti konzistentan
  const { user, loading, error, logout } = useAuth('admin')
  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    author: "Admin",
    category: ""
  });
  const [imagePreview, setImagePreview] = useState("");
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch(`${BACKEND_URL}/admin/blogs/images`, {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) {
        setForm((prev) => ({ ...prev, image_url: result.url }));
        setImagePreview(result.url.startsWith("/images/") ? `${BACKEND_URL}${result.url}` : result.url);
      }
    } catch {}
    setUploading(false);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image_url: "" }));
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form };
      const res = await fetch(`${BACKEND_URL}/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Blog uspješno kreiran!", type: "success" });
      setTimeout(() => {
        setModal({ open: false, message: "" });
        window.location.href = "/admin";
      }, 1500);
    } catch {
      setModal({ open: true, message: "Greška pri kreiranju bloga!", type: "error" });
      setTimeout(() => setModal({ open: false, message: "" }), 3000);
    }
  };

  const categories = [
    "Videonadzor",
    "Alarmni sistemi",
    "Kapije",
    "Klima uređaji",
    "Elektroinstalacioni radovi"
  ]

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.blogFormWrapper}>
          <div className={styles.blogFormLeft}>
            <Link href="/admin" className={styles.backButton} style={{ marginBottom: 18 }}>
              <ArrowLeft size={20} /> Nazad na admin
            </Link>
            <h1>Dodaj novi blog</h1>
            <p>Unesite informacije o novoj blog objavi</p>
          </div>
          <div className={styles.blogFormRight}>
            {modal.open && (
              <div style={{ background: modal.type === "success" ? "#e0ffe0" : "#fee2e2", color: modal.type === "success" ? "#0a0" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
            )}
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.label}>Naslov *</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Unesite naslov bloga"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="content" className={styles.label}>Sadržaj *</label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={8}
                  className={styles.textarea}
                  placeholder="Napišite sadržaj bloga..."
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="author" className={styles.label}>Autor *</label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  required
                  className={styles.input}
                  placeholder="Unesite ime autora"
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>Kategorija</label>
                <select
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className={styles.input}
                >
                  <option value="">Odaberite kategoriju</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Slika bloga</label>
                <div className={styles.blogDropZone}>
                  {!imagePreview ? (
                    <>
                      <Upload size={44} className={styles.uploadIcon} />
                      <p style={{ color: "#888", marginTop: 8, fontSize: 16 }}>Povucite sliku ovdje ili kliknite za upload</p>
                      <input type="file" accept="image/*" onChange={handleImage} className={styles.fileInput} disabled={uploading} style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} />
                    </>
                  ) : (
                    <div style={{ position: "relative" }}>
                      <img src={imagePreview} alt="blog slika" className={styles.blogImagePreview} />
                      <button type="button" onClick={removeImage} className={styles.removeImage} style={{ position: "absolute", top: 4, right: 4, background: "#fee2e2", borderRadius: "50%", border: "none", padding: 2 }}>
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className={styles.blogFormActions}>
                <button type="button" className={styles.blogCancelButton} onClick={() => router.push("/admin")}>Otkaži</button>
                <button type="submit" className={styles.blogSubmitButton} disabled={uploading}>
                  {uploading ? "Učitavanje slike..." : "Dodaj blog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* Uklonjen <Footer /> */}
    </div>
  );
} 