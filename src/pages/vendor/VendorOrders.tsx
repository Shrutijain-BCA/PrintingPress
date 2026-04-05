// src/pages/vendor/VendorOrders.tsx
import { useState } from 'react'
import { Package, CheckCircle, XCircle, ChevronDown, Clock } from 'lucide-react'
import StatusBadge from '../../components/ui/Badge'
import type { OrderStatus } from '../../types'

interface VOrder {
  id: string; customer: string; phone: string
  pages: number; amount: string; status: OrderStatus
  time: string; colorMode: string; binding: string; copies: number
}

const seed: VOrder[] = [
  { id: 'ORD-001', customer: 'Rahul Kumar',   phone: '+91 98765 43210', pages: 24, amount: '125.50', status: 'pending',   time: '2m ago',  colorMode: 'B&W',   binding: 'Spiral', copies: 1 },
  { id: 'ORD-002', customer: 'Priya Sharma',  phone: '+91 87654 32109', pages: 8,  amount: '45.00',  status: 'printing',  time: '15m ago', colorMode: 'Color',  binding: 'None',   copies: 2 },
  { id: 'ORD-003', customer: 'Amit Singh',    phone: '+91 76543 21098', pages: 56, amount: '210.80', status: 'ready',     time: '1h ago',  colorMode: 'B&W',   binding: 'Hard',   copies: 1 },
  { id: 'ORD-004', customer: 'Sneha Patel',   phone: '+91 65432 10987', pages: 4,  amount: '15.50',  status: 'delivered', time: '3h ago',  colorMode: 'B&W',   binding: 'None',   copies: 1 },
  { id: 'ORD-005', customer: 'Vikram Reddy',  phone: '+91 54321 09876', pages: 18, amount: '95.00',  status: 'pending',   time: '5m ago',  colorMode: 'Color',  binding: 'Tape',   copies: 3 },
]

const TABS = ['All', 'Pending', 'Printing', 'Ready', 'Delivered']
const ACTIVE_STATUSES: OrderStatus[] = ['accepted', 'printing', 'ready']

export default function VendorOrders() {
  const [orders, setOrders] = useState<VOrder[]>(seed)
  const [filter, setFilter] = useState('All')

  const updateStatus = (id: string, status: OrderStatus) =>
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord))

  const filtered =
    filter === 'All' ? orders : orders.filter(o => o.status === filter.toLowerCase())

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} total</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              filter === tab
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 p-5">

            {/* Top row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{order.customer}</p>
                  <p className="text-xs text-gray-400">{order.phone} · {order.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">₹{order.amount}</p>
                <p className="text-xs text-gray-400">{order.id}</p>
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {([
                ['Pages',   String(order.pages)],
                ['Color',   order.colorMode],
                ['Binding', order.binding],
                ['Copies',  String(order.copies)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{k}</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />

              <div className="flex gap-2">
                {order.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(order.id, 'accepted')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}

                {ACTIVE_STATUSES.includes(order.status) && (
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={e => updateStatus(order.id, e.target.value as OrderStatus)}
                      className="appearance-none pl-3 pr-8 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold border-0 focus:outline-none focus:ring-2 focus:ring-[#FF6B00] cursor-pointer"
                    >
                      <option value="accepted">Accepted</option>
                      <option value="printing">Printing</option>
                      <option value="ready">Ready</option>
                      <option value="delivered">Delivered</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-white absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">No orders here</p>
          </div>
        )}
      </div>
    </div>
  )
}
