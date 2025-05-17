"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import styles from "./hero-image.module.css"

export default function HeroImage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Create security camera effect
    const drawSecurityEffect = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Vertical lines
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal lines
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw recording indicator
      const now = new Date()
      ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
      ctx.font = "14px monospace"
      ctx.fillText(`REC ${now.toLocaleTimeString()}`, 20, 30)

      // Draw blinking recording dot
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = "rgba(255, 0, 0, 0.7)"
        ctx.beginPath()
        ctx.arc(10, 30, 5, 0, Math.PI * 2)
        ctx.fill()
      }

      requestAnimationFrame(drawSecurityEffect)
    }

    drawSecurityEffect()

    // Handle resize
    const handleResize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className={styles.heroImageWrapper}>
      <Image
        src="/placeholder.svg?height=500&width=700"
        alt="Security system"
        width={700}
        height={500}
        className={styles.heroImage}
      />
      <canvas ref={canvasRef} className={styles.securityOverlay} />
    </div>
  )
}
