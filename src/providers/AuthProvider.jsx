














import { createContext, useContext, useEffect, useState } from 'react'
import { createAuthClient } from 'better-auth/react'
import { toast } from 'sonner'
import api from '../utils/api'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const authClient = createAuthClient({
  baseURL: API_BASE,
})

const AuthContext = createContext(null)

const publicUser = (u) => {
  if (!u) return null
  const { password, passwordHash, ...safe } = u
  return safe
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      
  const [dbUser, setDbUser] = useState(null)  
  const [loading, setLoading] = useState(true)

  
  
  
  const fetchCurrentUser = async () => {
    try {
      const res = await api.get(`/auth/me?t=${Date.now()}`)
      setDbUser(publicUser(res.data))
      return res.data
    } catch (err) {
      setDbUser(null)
      return null
    }
  }

  
  
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await authClient.getSession()
        if (cancelled) return
        if (data && data.user) {
          setUser(data.user)
          await fetchCurrentUser()
          
          if (sessionStorage.getItem('oauth_pending') === 'true') {
            toast.success('Welcome back!')
            sessionStorage.removeItem('oauth_pending')
          }
        }
      } catch (err) {
        
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  
  
  const registerWithEmail = async (name, email, password, photoURL = '') => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      image: photoURL || undefined,
    })
    if (error) {
      return { ok: false, message: error.message || 'Sign-up failed' }
    }
    setUser(data?.user || null)
    await fetchCurrentUser()
    return { ok: true, user: data?.user }
  }

  
  const loginWithEmail = async (email, password) => {
    const { data, error } = await authClient.signIn.email({ email, password })
    if (error) {
      return { ok: false, message: error.message || 'Invalid credentials' }
    }
    setUser(data?.user || null)
    await fetchCurrentUser()
    return { ok: true, user: data?.user }
  }

  
  
  
  const loginWithGoogle = async () => {
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: `${window.location.origin}/`,
    })
    
    
    return { ok: true }
  }

  
  const logout = async () => {
    try {
      await authClient.signOut()
    } finally {
      setUser(null)
      setDbUser(null)
    }
  }

  const value = {
    user,
    dbUser,
    loading,
    refreshUser: fetchCurrentUser,
    registerWithEmail,
    loginWithEmail,
    loginWithGoogle,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
