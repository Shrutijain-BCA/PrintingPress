// src/hooks/useOrders.ts
import { useState, useEffect, useCallback } from 'react'
import type { Order } from '../types'
import { api } from '../utils/api'

/**
 * Fetch the current user's orders.
 * For vendors, call useVendorOrders() instead (below).
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Order[]>('/orders')
      setOrders(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetch() }, [fetch])

  return { orders, loading, error, refetch: fetch }
}

export function useVendorOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.get<Order[]>('/vendor/orders')
      setOrders(data)
      setError(null)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }, [])

  const updateStatus = async (orderId: string, status: Order['status']) => {
    await api.patch(`/vendor/orders/${orderId}/status`, { status })
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    )
  }

  useEffect(() => { fetch() }, [fetch])

  return { orders, loading, error, refetch: fetch, updateStatus }
}
