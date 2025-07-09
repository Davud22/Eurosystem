"use client";
import { useState } from "react";
import { ArrowLeft, Upload, X } from "lucide-react";
import Link from "next/link";
import styles from "../../Admin.module.css";

const BACKEND_URL = "http://localhost:8000";

export default function DodajBlogPage() {
  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    image_url: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [modal, setModal] = useState({ open: false, message: "", type: "success" });
  const [uploading, setUploading] = useState(false);

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
      const res = await fetch(`${BACKEND_URL}/admin/blogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setModal({ open: true, message: "Blog uspješno kreiran!", type: "success" });
      setTimeout(() => {
        setModal({ open: false, message: "" });
        window.location.href = "/admin/blog";
      }, 1500);
    } catch {
      setModal({ open: true, message: "Greška pri kreiranju bloga!", type: "error" });
      setTimeout(() => setModal({ open: false, message: "" }), 3000);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container} style={{ maxWidth: 600, margin: "0 auto" }}>
          <div className={styles.header}>
            <Link href="/admin/blog" className={styles.backButton}>
              <ArrowLeft size={20} /> Nazad na blog
            </Link>
            <h1 className={styles.title}>Dodaj novi blog</h1>
            <p className={styles.subtitle}>Unesite informacije o novoj blog objavi</p>
          </div>
          {modal.open && (
            <div style={{ background: modal.type === "success" ? "#e0ffe0" : "#fee2e2", color: modal.type === "success" ? "#0a0" : "#b91c1c", padding: 12, borderRadius: 8, marginBottom: 16, textAlign: "center", fontWeight: 500 }}>{modal.message}</div>
          )}
          <form onSubmit={handleSubmit} className={styles.form} style={{ marginTop: 24 }}>
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
              <div className={styles.dropZone} style={{ minHeight: 120, justifyContent: "center" }}>
                {!imagePreview ? (
                  <>
                    <Upload size={40} className={styles.uploadIcon} />
                    <p style={{ color: "#888", marginTop: 8 }}>Dodaj sliku bloga</p>
                    <input type="file" accept="image/*" onChange={handleImage} className={styles.fileInput} disabled={uploading} />
                  </>
                ) : (
                  <div style={{ position: "relative" }}>
                    <img src={imagePreview} alt="blog slika" style={{ maxWidth: 180, maxHeight: 120, borderRadius: 8, border: "1px solid #eee" }} />
                    <button type="button" onClick={removeImage} className={styles.removeImage} style={{ position: "absolute", top: 4, right: 4, background: "#fee2e2", borderRadius: "50%", border: "none", padding: 2 }}>
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className={styles.formActions} style={{ marginTop: 24 }}>
              <Link href="/admin/blog" className={styles.cancelButton} style={{ minWidth: 110, textAlign: "center" }}>
                Otkaži
              </Link>
              <button type="submit" className={styles.submitButton} style={{ minWidth: 140 }} disabled={uploading}>
                {uploading ? "Učitavanje slike..." : "Dodaj blog"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
} 