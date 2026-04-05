// src/context/AuthContext.tsx
// ─── MOCK AUTH — works without any backend ───────────────────────────────────
// To switch to real backend: replace mock* functions with real api.ts calls.

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react'
import type { User, AuthState, UserRole } from '../types'

// ─── Mock storage keys ────────────────────────────────────────────────────────
const USERS_KEY   = 'printify_users'
const TOKEN_KEY   = 'printify_token'
const SESSION_KEY = 'printify_session'

interface StoredUser extends User { password: string }

function getUsers(): StoredUser[] {
  try {
    const raw   = localStorage.getItem(USERS_KEY)
    const users: StoredUser[] = raw ? JSON.parse(raw) : []
    const emails = users.map(u => u.email)

    // Seed demo accounts
    if (!emails.includes('student@demo.com')) {
      users.push({ id: 'demo-student', name: 'Demo Student', email: 'student@demo.com',
        password: 'demo123', role: 'student', college: 'Demo University',
        phone: '+91 98765 43210', createdAt: new Date().toISOString() })
    }
    if (!emails.includes('vendor@demo.com')) {
      users.push({ id: 'demo-vendor', name: 'Demo Vendor', email: 'vendor@demo.com',
        password: 'demo123', role: 'vendor', shopName: 'Quick Print Co.',
        phone: '+91 87654 32109', createdAt: new Date().toISOString() })
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    return users
  } catch { return [] }
}

function saveUsers(u: StoredUser[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)) }
function strip(u: StoredUser): User { const { password: _, ...rest } = u; void _; return rest }
function delay(ms: number)          { return new Promise(r => setTimeout(r, ms)) }

// ─── Mock API ─────────────────────────────────────────────────────────────────

async function mockLogin(email: string, password: string) {
  await delay(450)
  const found = getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
  if (!found)              throw new Error('No account found with this email')
  if (found.password !== password) throw new Error('Incorrect password')
  const token = `mock_${found.id}_${Date.now()}`
  return { user: strip(found), token }
}

async function mockRegister(payload: RegisterPayload) {
  await delay(500)
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === payload.email.toLowerCase()))
    throw new Error('An account with this email already exists')
  const newUser: StoredUser = {
    id: `user_${Date.now()}`,
    name: payload.name, email: payload.email, password: payload.password,
    role: payload.role, phone: payload.phone, college: payload.college,
    shopName: payload.shopName, createdAt: new Date().toISOString(),
  }
  saveUsers([...users, newUser])
  const token = `mock_${newUser.id}_${Date.now()}`
  return { user: strip(newUser), token }
}

async function mockGetMe(): Promise<User> {
  await delay(200)
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) throw new Error('No session')
  const { userId } = JSON.parse(raw) as { userId: string }
  const found = getUsers().find(u => u.id === userId)
  if (!found) throw new Error('User not found')
  return strip(found)
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RegisterPayload {
  name: string; email: string; password: string; role: UserRole
  phone?: string; college?: string; shopName?: string
}

interface AuthContextValue extends AuthState {
  login:    (email: string, password: string) => Promise<void>
  register: (payload: RegisterPayload)        => Promise<void>
  logout:   () => void
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

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

// ─── Provider ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    if (!localStorage.getItem(TOKEN_KEY)) { dispatch({ type: 'LOGOUT' }); return }
    mockGetMe()
      .then(user => dispatch({ type: 'SET', user, token: localStorage.getItem(TOKEN_KEY)! }))
      .catch(() => { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(SESSION_KEY); dispatch({ type: 'LOGOUT' }) })
  }, [])

  const login = async (email: string, password: string) => {
    dispatch({ type: 'LOADING' })
    const data = await mockLogin(email, password)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: data.user.id }))
    dispatch({ type: 'SET', user: data.user, token: data.token })
  }

  const register = async (payload: RegisterPayload) => {
    dispatch({ type: 'LOADING' })
    const data = await mockRegister(payload)
    localStorage.setItem(TOKEN_KEY, data.token)
    localStorage.setItem(SESSION_KEY, JSON.stringify({ userId: data.user.id }))
    dispatch({ type: 'SET', user: data.user, token: data.token })
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(SESSION_KEY)
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

// ─── SWITCHING TO REAL BACKEND ────────────────────────────────────────────────
// 1. Import: import { api } from '../utils/api'
// 2. Replace mockLogin    → api.post('/auth/login', { email, password })
// 3. Replace mockRegister → api.post('/auth/register', payload)
// 4. Replace mockGetMe    → api.get('/auth/me')
// Everything else stays the same.
