// src/context/AuthContext.tsx — Real backend auth
import { createContext, useContext, useEffect, useReducer, ReactNode } from 'react'
import type { User, AuthState, UserRole } from '../types'
import { api } from '../utils/api'

const TOKEN_KEY = 'printify_token'

export interface RegisterPayload {
  name: string; email: string; password: string; role: UserRole
  phone?: string; college?: string; shopName?: string
}

interface AuthContextValue extends AuthState {
  login:    (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload)        => Promise<void>
  logout:   () => void
}

type Action =
  | { type: 'LOADING' }
  | { type: 'SET'; user: User; token: string }
  | { type: 'LOGOUT' }

function reducer(state: AuthState, action: Action): AuthState {
  switch (action.type) {
    case 'LOADING': return { ...state, isLoading: true }
    case 'SET':     return { user: action.user, token: action.token, isLoading: false, isAuthenticated: true }
    case 'LOGOUT':  return { user: null, token: null, isLoading: false, isAuthenticated: false }
  }
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isLoading: true,
    isAuthenticated: false,
  })

  // Rehydrate session on page load
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { dispatch({ type: 'LOGOUT' }); return }
    api.get<{ data: { user: User } }>('/auth/me')
      .then(res => dispatch({ type: 'SET', user: res.data.user, token }))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        dispatch({ type: 'LOGOUT' })
      })
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOADING' })
    const res = await api.post<{ data: { user: User; token: string } }>('/auth/login', { email, password })
    localStorage.setItem(TOKEN_KEY, res.data.token)
    dispatch({ type: 'SET', user: res.data.user, token: res.data.token })
  }

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: 'LOADING' })
    const res = await api.post<{ data: { user: User; token: string } }>('/auth/register', payload)
    localStorage.setItem(TOKEN_KEY, res.data.token)
    dispatch({ type: 'SET', user: res.data.user, token: res.data.token })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    dispatch({ type: 'LOGOUT' })
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside <AuthProvider>')
  return ctx
}
