import Header from "./components/Header/Header"
import HeroSection from "./components/HeroSection/HeroSection"
import ProductCategories from "./components/ProductCategories/ProductCategories"
import OurWork from "./components/OurWork/OurWork"
import BlogPreview from "./components/BlogPreview/BlogPreview"
import ContactSection from "./components/ContactSection/ContactSection"
import Footer from "./components/Footer/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />
      <main>
        <HeroSection />
        <ProductCategories />
        <OurWork />
        <BlogPreview />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
