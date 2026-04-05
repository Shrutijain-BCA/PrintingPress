// src/components/ui/Badge.tsx
import type { OrderStatus } from '../../types'
import {
  Clock, Package, Truck, CheckCircle, XCircle, RefreshCw,
} from 'lucide-react'

const config: Record<
  OrderStatus,
  { label: string; bg: string; text: string; icon: React.ElementType }
> = {
  pending:   { label: 'Pending',   bg: 'bg-yellow-100', text: 'text-yellow-700', icon: Clock },
  accepted:  { label: 'Accepted',  bg: 'bg-indigo-100', text: 'text-indigo-700', icon: RefreshCw },
  printing:  { label: 'Printing',  bg: 'bg-blue-100',   text: 'text-blue-700',   icon: Package },
  ready:     { label: 'Ready!',    bg: 'bg-green-100',  text: 'text-green-700',  icon: Truck },
  delivered: { label: 'Delivered', bg: 'bg-gray-100',   text: 'text-gray-500',   icon: CheckCircle },
  rejected:  { label: 'Rejected',  bg: 'bg-red-100',    text: 'text-red-600',    icon: XCircle },
  cancelled: { label: 'Cancelled', bg: 'bg-gray-100',   text: 'text-gray-500',   icon: XCircle },
}

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const { label, bg, text, icon: Icon } = config[status]
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${bg} ${text}`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}
