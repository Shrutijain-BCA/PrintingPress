// src/pages/vendor/VendorDashboard.tsx
import { useEffect, useState } from 'react'
import { Package, DollarSign, Clock, CheckCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { api } from '../../utils/api'

interface DashboardData {
  stats: { totalOrders: number; pendingOrders: number; todayOrders: number; todayRevenue: number }
  recentOrders: any[]
}

export default function VendorDashboard() {
  const { user } = useAuth()
  const [data, setData]       = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  useEffect(() => {
    api.get<{ data: DashboardData }>('/vendor/dashboard')
      .then(res => setData(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>
  if (error)   return <div className="pt-20 text-center text-red-500 font-semibold">{error}</div>

  const stats = [
    { label: 'Total Orders',    value: String(data?.stats.totalOrders ?? 0),        icon: Package,     color: 'bg-blue-500'    },
    { label: "Today's Revenue", value: `₹${data?.stats.todayRevenue?.toFixed(0) ?? 0}`, icon: DollarSign, color: 'bg-[#FF6B00]' },
    { label: 'Pending',         value: String(data?.stats.pendingOrders ?? 0),      icon: Clock,       color: 'bg-yellow-500'  },
    { label: 'Today Orders',    value: String(data?.stats.todayOrders ?? 0),        icon: CheckCircle, color: 'bg-green-500'   },
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">{user?.shopName || 'Dashboard'}</h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Recent Orders</h2>
          <Link to="/vendor/orders" className="flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:underline">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {data?.recentOrders.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No orders yet</p>
          )}
          {data?.recentOrders.map((order: any) => (
            <div key={order._id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-[#FF6B00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{order.student?.name || 'Student'}</p>
                <p className="text-xs text-gray-400">{order.orderNumber} · {order.totalPages} pages</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-gray-900 text-sm">₹{order.totalPrice}</p>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick tip */}
      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
        <p className="text-xs font-bold text-orange-700 mb-1">Tip</p>
        <p className="text-sm text-orange-600">Accept pending orders quickly to improve your rating.</p>
      </div>
    </div>
  )
}
