import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../lib/api.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('qs_token') || '')
  const [loading, setLoading] = useState(false)
  const isAuth = !!token

  useEffect(() => {
    if (!token) return
    const fetchMe = async () => {
      try {
        setLoading(true)
        const { data } = await api.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
        setUser(data)
      } catch {
        setToken('')
        localStorage.removeItem('qs_token')
      } finally { setLoading(false) }
    }
    fetchMe()
  }, [token])

  const login = async (email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/login', { identifier: email, password })
      localStorage.setItem('qs_token', data.token)
      setToken(data.token)
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role })
      return { ok: true, role: data.role }
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || 'Login failed' }
    } finally { setLoading(false) }
  }

  const register = async (name, email, password) => {
    setLoading(true)
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password })
      localStorage.setItem('qs_token', data.token)
      setToken(data.token)
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role })
      return { ok: true }
    } catch (e) {
      return { ok: false, message: e.response?.data?.message || 'Register failed' }
    } finally { setLoading(false) }
  }

  const logout = () => {
    localStorage.removeItem('qs_token')
    setToken('')
    setUser(null)
  }

  const value = useMemo(() => ({ user, token, isAuth, loading, login, register, logout }), [user, token, isAuth, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
