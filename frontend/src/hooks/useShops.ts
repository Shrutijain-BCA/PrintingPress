// src/hooks/useShops.ts
import { useState, useEffect } from 'react'
import { api } from '../utils/api'
import type { Shop } from '../types'

export function useShops() {
  const [shops, setShops]     = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    api.get<{ data: { shops: Shop[] } }>('/shops')
      .then(res => {
        setShops(res.data.shops)
        setError(null)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch shops')
      })
      .finally(() => setLoading(false))
  }, [])

  return { shops, loading, error }
}

export function useShop(id: string) {
  const [shop, setShop]       = useState<Shop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    api.get<{ data: { shop: Shop } }>(`/shops/${id}`)
      .then(res => {
        setShop(res.data.shop)
        setError(null)
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : 'Failed to fetch shop')
      })
      .finally(() => setLoading(false))
  }, [id])

  return { shop, loading, error }
}