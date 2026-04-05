// src/pages/student/Orders.tsx
import { Package } from 'lucide-react'
import OrderCard from '../../components/shared/OrderCard'
import Button from '../../components/ui/Button'
import { useNavigate } from 'react-router-dom'
import type { Order } from '../../types'

// Mock data — replace with useOrders() hook once backend is ready
const mockOrders: Order[] = [
  {
    id: 'ORD-2024-001', studentId: 'u1', status: 'ready',
    options: { colorMode: 'bw', pageSize: 'A4', sides: 'single', copies: 1, binding: 'spiral', paperQuality: 'standard' },
    documents: [{ name: 'Notes.pdf', size: 120000, type: 'application/pdf', pages: 24 }],
    totalPages: 24, totalPrice: 125.50,
    createdAt: '2024-03-10T10:00:00Z', updatedAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'ORD-2024-002', studentId: 'u1', status: 'delivered',
    options: { colorMode: 'color', pageSize: 'A4', sides: 'double', copies: 1, binding: 'none', paperQuality: 'premium' },
    documents: [{ name: 'Presentation.pptx', size: 400000, type: 'application/vnd.ms-powerpoint', pages: 8 }],
    totalPages: 8, totalPrice: 45.00,
    createdAt: '2024-03-09T09:00:00Z', updatedAt: '2024-03-09T12:00:00Z',
  },
  {
    id: 'ORD-2024-003', studentId: 'u1', status: 'printing',
    options: { colorMode: 'bw', pageSize: 'A4', sides: 'double', copies: 2, binding: 'hard', paperQuality: 'standard' },
    documents: [
      { name: 'Thesis.pdf', size: 800000, type: 'application/pdf', pages: 40 },
      { name: 'Appendix.pdf', size: 200000, type: 'application/pdf', pages: 16 },
    ],
    totalPages: 56, totalPrice: 210.80,
    createdAt: '2024-03-08T14:00:00Z', updatedAt: '2024-03-08T15:00:00Z',
  },
  {
    id: 'ORD-2024-004', studentId: 'u1', status: 'pending',
    options: { colorMode: 'bw', pageSize: 'A4', sides: 'single', copies: 1, binding: 'none', paperQuality: 'standard' },
    documents: [{ name: 'Assignment.docx', size: 50000, type: 'application/msword', pages: 4 }],
    totalPages: 4, totalPrice: 15.50,
    createdAt: '2024-03-07T08:00:00Z', updatedAt: '2024-03-07T08:00:00Z',
  },
]

export default function Orders() {
  const navigate = useNavigate()

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">My Orders</h1>
        <p className="text-sm text-gray-400 mt-1">Track your printing orders</p>
      </div>

      {mockOrders.length > 0 ? (
        <div className="space-y-3">
          {mockOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onViewDetails={() => {}} // Open modal / navigate to detail page
            />
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
