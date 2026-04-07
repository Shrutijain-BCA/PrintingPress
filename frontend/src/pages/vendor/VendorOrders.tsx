// src/pages/vendor/VendorOrders.tsx
import { useState } from 'react'
import { Package, CheckCircle, XCircle, ChevronDown, Clock } from 'lucide-react'
import StatusBadge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { useVendorOrders } from '../../hooks/useOrders'
import type { OrderStatus } from '../../types'

const TABS = ['All', 'Pending', 'Accepted', 'Printing', 'Ready', 'Delivered']
const ACTIVE: OrderStatus[] = ['accepted', 'printing', 'ready']

export default function VendorOrders() {
  const [filter, setFilter] = useState('All')
  const statusFilter = filter === 'All' ? undefined : filter.toLowerCase()
  const { orders, loading, error, updateStatus } = useVendorOrders(statusFilter)
  const [updating, setUpdating] = useState<string | null>(null)

  const handleStatus = async (id: string, status: OrderStatus) => {
    setUpdating(id)
    try { await updateStatus(id, status) }
    catch (e) { console.error(e) }
    finally { setUpdating(null) }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Orders</h1>
        <p className="text-sm text-gray-400 mt-1">{orders.length} orders</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto no-scrollbar pb-1">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
              filter === tab ? 'bg-gray-900 text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
            }`}
          >{tab}</button>
        ))}
      </div>

      {loading && <div className="flex justify-center pt-10"><Spinner /></div>}
      {error   && <div className="text-center text-red-500 pt-10 font-semibold">{error}</div>}

      <div className="space-y-3">
        {!loading && !error && orders.map(order => (
          <div key={order.id || (order as any)._id} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#FF6B00]" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">
                    {(order as any).student?.name || 'Student'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(order as any).orderNumber} · {(order as any).student?.phone || ''}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">₹{order.totalPrice}</p>
                <p className="text-xs text-gray-400">{order.totalPages} pages</p>
              </div>
            </div>

            {/* Print options */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {([
                ['Color',   (order as any).printOptions?.colorMode === 'bw' ? 'B&W' : 'Color'],
                ['Size',    (order as any).printOptions?.pageSize],
                ['Binding', (order as any).printOptions?.binding],
                ['Copies',  String((order as any).printOptions?.copies)],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{k}</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5 capitalize">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <StatusBadge status={order.status} />
              <div className="flex gap-2">
                {updating === (order.id || (order as any)._id) && (
                  <Spinner size="sm" />
                )}
                {order.status === 'pending' && !updating && (
                  <>
                    <button onClick={() => handleStatus((order as any)._id || order.id, 'accepted')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => handleStatus((order as any)._id || order.id, 'rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Reject
                    </button>
                  </>
                )}
                {ACTIVE.includes(order.status) && !updating && (
                  <div className="relative">
                    <select
                      value={order.status}
                      onChange={e => handleStatus((order as any)._id || order.id, e.target.value as OrderStatus)}
                      className="appearance-none pl-3 pr-8 py-1.5 bg-gray-900 text-white rounded-xl text-xs font-bold border-0 focus:outline-none cursor-pointer"
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

        {!loading && !error && orders.length === 0 && (
          <div className="py-16 text-center">
            <Clock className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">No orders here</p>
          </div>
        )}
      </div>
    </div>
  )
}
