import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "./components/ThemeProvider"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Eurosystem - Sigurnosni sistemi i elektroinstalacije",
  description: "Profesionalni sigurnosni sistemi, videonadzor i pametne elektroinstalacije",
}

export default function RootLayout({ children }) {
  return (
    <html lang="sr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
