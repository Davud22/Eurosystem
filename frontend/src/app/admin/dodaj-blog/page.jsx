"use client";
import { useState } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import styles from "../Admin.module.css";
import { Upload, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const BACKEND_URL = "http://localhost:8000";

export default function DodajBlogPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    image_url: "",
    author: "Admin"
  });
  const [imagePreview, setImagePreview] = useState("");
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });
  const [uploading, setUploading] = useState(false);

  const router = useRouter();

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
                <button type="button" className={styles.cancelButton} style={{ minWidth: 140, height: 48, textAlign: "center", display: "inline-flex", alignItems: "center", justifyContent: "center" }} onClick={() => router.push("/admin")}>Otkaži</button>
                <button type="submit" className={styles.submitButton} style={{ minWidth: 140, height: 48, display: "inline-flex", alignItems: "center", justifyContent: "center" }} disabled={uploading}>
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