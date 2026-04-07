// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'
import type { Order, OrderStatus } from '../types'

// ── Student orders ────────────────────────────────────────────────────────────
export function useOrders() {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get<{ data: { orders: Order[] } }>('/orders')
      setOrders(res.data.orders)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const cancelOrder = async (id: string) => {
    await api.patch(`/orders/${id}/cancel`, {})
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'cancelled' as OrderStatus } : o))
  }

  useEffect(() => { fetchOrders() }, [fetchOrders])
  return { orders, loading, error, refetch: fetchOrders, cancelOrder }
}

// ── Vendor orders ─────────────────────────────────────────────────────────────
export function useVendorOrders(statusFilter?: string) {
  const [orders, setOrders]   = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const query = statusFilter ? `?status=${statusFilter}` : ''
      const res   = await api.get<{ data: { orders: Order[] } }>(`/vendor/orders${query}`)
      setOrders(res.data.orders)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  const updateStatus = async (orderId: string, status: OrderStatus, note?: string) => {
    await api.patch(`/vendor/orders/${orderId}/status`, { status, note })
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
  }

  useEffect(() => { fetchOrders() }, [fetchOrders])
  return { orders, loading, error, refetch: fetchOrders, updateStatus }
}
