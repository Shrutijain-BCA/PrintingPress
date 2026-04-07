// src/context/CartContext.tsx
import { createContext, useContext, useReducer, ReactNode } from 'react'
import type { CartItem, DocumentFile, PrintOptions } from '../types'

interface CartContextValue {
  items: CartItem[]
  addItem: (files: DocumentFile[], options: PrintOptions, price: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: number
  itemCount: number
}

type Action =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; id: string }
  | { type: 'CLEAR' }

function reducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD':    return [...state, action.item]
    case 'REMOVE': return state.filter(i => i.id !== action.id)
    case 'CLEAR':  return []
  }
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(reducer, [])

  const addItem = (files: DocumentFile[], options: PrintOptions, price: number) =>
    dispatch({
      type: 'ADD',
      item: { id: crypto.randomUUID(), files, options, price },
    })

  const removeItem = (id: string) => dispatch({ type: 'REMOVE', id })
  const clearCart  = ()           => dispatch({ type: 'CLEAR' })
  const total      = items.reduce((s, i) => s + i.price, 0)
  const itemCount  = items.length

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be inside <CartProvider>')
  return ctx
}
