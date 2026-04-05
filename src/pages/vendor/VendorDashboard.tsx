// src/pages/vendor/VendorDashboard.tsx
import { Package, DollarSign, Clock, CheckCircle, TrendingUp, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import StatusBadge from '../../components/ui/Badge'
import type { OrderStatus } from '../../types'

const stats = [
  { label: 'Total Orders',    value: '156',    icon: Package,     color: 'bg-blue-500',     change: '+12 today'         },
  { label: "Today's Revenue", value: '₹2,450', icon: DollarSign,  color: 'bg-[#FF6B00]',    change: '+₹340 vs yesterday' },
  { label: 'Pending',         value: '12',     icon: Clock,       color: 'bg-yellow-500',   change: 'Need attention'    },
  { label: 'Completed',       value: '144',    icon: CheckCircle, color: 'bg-green-500',    change: 'All time'          },
]

interface RecentOrder {
  id: string; customer: string; pages: number; amount: string
  status: OrderStatus; time: string
}

const recent: RecentOrder[] = [
  { id: 'ORD-001', customer: 'Rahul Kumar',   pages: 24, amount: '₹125', status: 'pending',   time: '2m ago'  },
  { id: 'ORD-002', customer: 'Priya Sharma',  pages: 8,  amount: '₹45',  status: 'printing',  time: '15m ago' },
  { id: 'ORD-003', customer: 'Amit Singh',    pages: 56, amount: '₹210', status: 'ready',     time: '1h ago'  },
  { id: 'ORD-004', customer: 'Sneha Patel',   pages: 4,  amount: '₹15',  status: 'delivered', time: '3h ago'  },
]

export default function VendorDashboard() {
  const { user } = useAuth()

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">
          {user?.shopName || 'Dashboard'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />{s.change}
            </p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-gray-900">Recent Orders</h2>
          <Link
            to="/vendor/orders"
            className="flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:underline"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {recent.map(order => (
            <div key={order.id} className="flex items-center gap-4 px-5 py-4">
              <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-[#FF6B00]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                <p className="text-xs text-gray-400">{order.id} · {order.pages} pages</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-gray-900 text-sm">{order.amount}</p>
                <p className="text-[10px] text-gray-400">{order.time}</p>
              </div>
              <div className="flex-shrink-0">
                <StatusBadge status={order.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
