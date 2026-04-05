// src/pages/student/Cart.tsx
import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import Button from '../../components/ui/Button'

export default function Cart() {
  const { items, removeItem, total, clearCart } = useCart()
  const navigate = useNavigate()

  const handleCheckout = () => {
    // TODO: POST /api/orders with items
    alert('Order placed! 🎉')
    clearCart()
    navigate('/orders')
  }

  if (items.length === 0) {
    return (
      <div className="px-4 pt-20 pb-24 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-xl font-black text-gray-900 mb-2">Cart is empty</h2>
        <p className="text-gray-400 text-sm mb-8">Upload documents to start printing</p>
        <Button onClick={() => navigate('/upload')}>Upload Documents</Button>
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-36 md:pb-10">
      <h1 className="text-2xl font-black text-gray-900 mb-5">Your Cart</h1>

      {/* Cart items */}
      <div className="space-y-3 mb-5">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-2xl border border-gray-100 p-5">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="font-bold text-gray-900">
                  {item.files.length} Document{item.files.length > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[220px]">
                  {item.files.map(f => f.name).join(', ')}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-400" />
              </button>
            </div>

            {/* Options grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {([
                ['Color',   item.options.colorMode === 'bw' ? 'B&W' : 'Color'],
                ['Size',    item.options.pageSize],
                ['Sides',   item.options.sides === 'single' ? 'Single' : 'Double'],
                ['Copies',  String(item.options.copies)],
                ['Binding', item.options.binding === 'none' ? 'None' : item.options.binding],
                ['Paper',   item.options.paperQuality === 'standard' ? 'Standard' : 'Premium'],
              ] as [string, string][]).map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-xl p-2.5">
                  <p className="text-[10px] text-gray-400 uppercase font-bold">{k}</p>
                  <p className="text-xs font-bold text-gray-900 mt-0.5 capitalize">{v}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400 font-medium">Item total</span>
              <span className="font-black text-[#FF6B00] text-lg">₹{item.price.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Add more */}
      <button
        onClick={() => navigate('/upload')}
        className="w-full bg-white border-2 border-dashed border-gray-200 rounded-2xl py-4 text-sm font-bold text-gray-400 hover:border-orange-300 hover:text-[#FF6B00] transition-colors mb-5"
      >
        + Add More Documents
      </button>

      {/* Sticky order summary */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:bg-transparent md:p-0">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-gray-100 p-5 md:border md:bg-white">
          <div className="space-y-2 mb-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold">₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Delivery</span>
              <span className="font-bold">₹30.00</span>
            </div>
          </div>
          <div className="flex justify-between mb-5 pt-3 border-t border-gray-100">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-black text-xl text-[#FF6B00]">₹{(total + 30).toFixed(2)}</span>
          </div>
          <Button size="lg" className="w-full" onClick={handleCheckout}>
            Place Order <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
