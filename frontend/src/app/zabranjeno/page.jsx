"use client"

import { useState } from "react"
import { Shield, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import styles from "./Zabranjeno.module.css"

export default function ZabranjenoPage() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.icon}>
              <Shield size={80} />
            </div>
            
            <h1 className={styles.title}>Pristup zabranjen</h1>
            
            <p className={styles.description}>
              Nemate dozvolu za pristup ovoj stranici. 
              Ova stranica je rezervisana za administratore.
            </p>
            
            <div className={styles.actions}>
              <Link href="/" className={styles.homeButton}>
                <Home size={20} />
                Početna stranica
              </Link>
              
              <Link href="/prijava" className={styles.loginButton}>
                <ArrowLeft size={20} />
                Prijava
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 