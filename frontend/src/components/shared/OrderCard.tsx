// src/components/shared/OrderCard.tsx
import { Download } from 'lucide-react'
import type { Order } from '../../types'
import StatusBadge from '../ui/Badge'
import Button from '../ui/Button'
import { formatDate } from '../../utils/format'

const STEPS = ['pending', 'accepted', 'printing', 'ready', 'delivered']

export default function OrderCard({ order, onViewDetails }: { order: Order; onViewDetails?: (o: Order) => void }) {
  // Support both id and _id (MongoDB)
  const id = (order as any)._id || order.id
  const idx = STEPS.indexOf(order.status)
  const opts = (order as any).printOptions || order.options || {}

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-bold text-gray-900 text-sm">{(order as any).orderNumber || id}</p>
          <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        {([
          ['Pages', String(order.totalPages)],
          ['Total', `₹${order.totalPrice}`],
          ['Color', opts.colorMode === 'bw' ? 'B&W' : 'Color'],
        ] as [string, string][]).map(([k, v]) => (
          <div key={k} className="bg-gray-50 rounded-xl p-2.5">
            <p className="text-[10px] text-gray-400 uppercase font-bold">{k}</p>
            <p className="text-xs font-bold text-gray-900 mt-0.5">{v}</p>
          </div>
        ))}
      </div>

      {idx >= 0 && order.status !== 'rejected' && order.status !== 'cancelled' && (
        <div className="mb-4">
          <div className="flex justify-between mb-1.5">
            {STEPS.map((s, i) => (
              <span key={s} className={`text-[9px] font-bold capitalize ${i <= idx ? 'text-[#FF6B00]' : 'text-gray-300'}`}>{s}</span>
            ))}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#FF6B00] rounded-full transition-all duration-500"
              style={{ width: `${((idx + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onViewDetails?.(order)}>View Details</Button>
        {order.status === 'delivered' && (
          <Button variant="ghost" size="sm"><Download className="w-3.5 h-3.5" /> Invoice</Button>
        )}
      </div>
    </div>
  )
}
