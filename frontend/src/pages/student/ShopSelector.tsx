// src/pages/student/ShopSelector.tsx
import { useNavigate, useLocation } from 'react-router-dom'
import { Store, MapPin, Phone, ChevronRight, Star } from 'lucide-react'
import { useShops } from '../../hooks/useShops'
import Spinner from '../../components/ui/Spinner'

export default function ShopSelector() {
  const navigate = useNavigate()
  const location = useLocation()
  const { files, options, price } = location.state || {}
  const { shops, loading, error } = useShops()

  const handleSelectShop = (shopId: string) => {
    navigate('/payment', {
      state: { files, options, price, shopId },
    })
  }

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
      </div>
    )
  }

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Choose Print Shop</h1>
        <p className="text-sm text-gray-400 mt-1">
          Select a nearby shop to print your documents
        </p>
      </div>

      {/* Order summary */}
      <div className="bg-[#FF6B00] rounded-2xl p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-orange-100 text-xs font-bold uppercase tracking-wider">
              Your Order
            </p>
            <p className="text-white font-black text-lg mt-0.5">
              {files?.length || 0} file{files?.length > 1 ? 's' : ''} · ₹{price?.toFixed(2)}
            </p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-2">
            <p className="text-white text-xs font-bold">
              Pay now: ₹{((price * 0.5) + (price * 0.1)).toFixed(2)}
            </p>
            <p className="text-orange-100 text-[10px]">50% + 10% platform fee</p>
          </div>
        </div>
      </div>

      {/* Shop list */}
      {shops.length === 0 ? (
        <div className="text-center py-16">
          <Store className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 font-semibold">No shops available right now</p>
          <p className="text-gray-300 text-sm mt-1">Please try again later</p>
        </div>
      ) : (
        <div className="space-y-3">
          {shops.map(shop => (
            <button
              key={shop._id}
              onClick={() => handleSelectShop(shop._id)}
              className="w-full bg-white rounded-2xl border border-gray-100 p-5 text-left hover:border-[#FF6B00] transition-all active:scale-[0.98] shadow-sm"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="font-black text-gray-900">{shop.name}</p>
                    <p className="text-xs text-gray-400">{shop.ownerName}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 mt-1" />
              </div>

              {/* Shop details */}
              <div className="space-y-1.5 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>{shop.address}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Phone className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span>{shop.phone}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <Star className="w-3 h-3 text-yellow-400" />
                    <p className="text-xs font-black text-gray-900">
                      {shop.completionRate}%
                    </p>
                  </div>
                  <p className="text-[10px] text-gray-400">Completion</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-black text-gray-900 mb-0.5">
                    {shop.totalOrders}
                  </p>
                  <p className="text-[10px] text-gray-400">Total Orders</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                  <p className="text-xs font-black text-gray-900 mb-0.5">
                    ₹{shop.pricing?.bwSingle}/pg
                  </p>
                  <p className="text-[10px] text-gray-400">B&W Print</p>
                </div>
              </div>

              {/* Pricing preview */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3">
                {[
                  ['B&W', `₹${shop.pricing?.bwSingle}`],
                  ['Color', `₹${shop.pricing?.colorSingle}`],
                  ['Spiral', `₹${shop.pricing?.spiralBind}`],
                ].map(([label, val]) => (
                  <div key={label} className="flex items-center gap-1">
                    <span className="text-[10px] text-gray-400">{label}:</span>
                    <span className="text-[10px] font-bold text-gray-700">{val}</span>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}