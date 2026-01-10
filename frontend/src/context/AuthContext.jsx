import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = () => {
      const token = localStorage.getItem('token')
      const storedUser = localStorage.getItem('user')

      if (token && storedUser) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    console.log('Login response:', data)
    setUser(data.data.user)
    setIsAuthenticated(true)
    console.log('Auth state updated - isAuthenticated:', true)
    return data
  }

  const register = async (userData) => {
    const data = await authService.register(userData)
    setUser(data.data.user)
    setIsAuthenticated(true)
    return data
  }

  const logout = async () => {
    await authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateUser = (userData) => {
    setUser((prev) => ({ ...prev, ...userData }))
    localStorage.setItem('user', JSON.stringify({ ...user, ...userData }))
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
