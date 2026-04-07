// src/pages/student/Orders.tsx
import { Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import OrderCard from '../../components/shared/OrderCard'
import Button from '../../components/ui/Button'
import Spinner from '../../components/ui/Spinner'
import { useOrders } from '../../hooks/useOrders'

export default function Orders() {
  const navigate = useNavigate()
  const { orders, loading, error, refetch } = useOrders()

  if (loading) {
    return (
      <div className="flex justify-center pt-20">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="px-4 pt-20 text-center">
        <p className="text-red-500 font-semibold mb-4">{error}</p>
        <Button onClick={refetch} variant="outline">Try Again</Button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-400 mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
        </div>
        <button onClick={refetch} className="text-xs font-bold text-[#FF6B00] hover:underline">Refresh</button>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <Package className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-black text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-400 text-sm mb-8">Upload your first document to get started</p>
          <Button onClick={() => navigate('/upload')}>Upload Document</Button>
        </div>
      )}
    </div>
  )
}
