import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "./components/navbar"
import Footer from "./components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Eurosystem - Sigurnosni sistemi i elektroinstalacije",
  description:
    "Profesionalna rješenja za sigurnosne sisteme i elektroinstalacije. Zaštitite ono što vam je najvažnije.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="bs">
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
