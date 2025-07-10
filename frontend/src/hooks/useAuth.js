import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth(requiredRole = null) {
  // Svi hooks se pozivaju uvijek u istom redoslijedu
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const checkAuth = async () => {
      try {
        // Provjeri i localStorage i cookies
        const token = localStorage.getItem('access_token') || 
                     document.cookie.split('; ').find(row => row.startsWith('access_token='))?.split('=')[1]
        
        if (!token) {
          if (requiredRole && isMounted) {
            router.push('/prijava')
            return
          }
          if (isMounted) {
            setLoading(false)
          }
          return
        }

        // Provjeri token na backendu
        const response = await fetch('http://localhost:8000/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!response.ok) {
          localStorage.removeItem('access_token')
          // Ukloni i cookie
          document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
          if (requiredRole && isMounted) {
            router.push('/prijava')
            return
          }
          if (isMounted) {
            setLoading(false)
          }
          return
        }

        const userData = await response.json()
        
        if (isMounted) {
          setUser(userData)
          
          // Provjeri role ako je potrebno
          if (requiredRole && userData.role !== requiredRole) {
            router.push('/zabranjeno')
            return
          }
        }

      } catch (error) {
        console.error('Auth error:', error)
        localStorage.removeItem('access_token')
        // Ukloni i cookie
        document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        if (requiredRole && isMounted) {
          router.push('/prijava')
          return
        }
        if (isMounted) {
          setError(error.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    checkAuth()

    return () => {
      isMounted = false
    }
  }, [requiredRole, router])

  const logout = () => {
    localStorage.removeItem('access_token')
    // Ukloni i cookie
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/prijava')
  }

  return { user, loading, error, logout }
} 