// src/pages/student/Wallet.tsx
import { useState, useEffect } from 'react'
import { Wallet as WalletIcon, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react'
import { api } from '../../utils/api'
import Spinner from '../../components/ui/Spinner'
import type { Wallet as WalletType, WalletTransaction } from '../../types'
import { formatDate } from '../../utils/format'

export default function Wallet() {
  const [wallet, setWallet]   = useState<WalletType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')

  const fetchWallet = () => {
    setLoading(true)
    api.get<{ data: { wallet: WalletType } }>('/payments/wallet')
      .then(res => setWallet(res.data.wallet))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchWallet() }, [])

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
        <p className="text-red-500 font-semibold">{error}</p>
      </div>
    )
  }

  const transactions = wallet?.transactions?.slice().reverse() || []

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Wallet</h1>
          <p className="text-sm text-gray-400 mt-1">Refunds and credits</p>
        </div>
        <button
          onClick={fetchWallet}
          className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <RefreshCw className="w-4 h-4 text-gray-400" />
        </button>
      </div>

      {/* Balance card */}
      <div
        className="rounded-2xl p-6 mb-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #FF6B00 0%, #e55f00 100%)' }}
      >
        <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-8" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <WalletIcon className="w-5 h-5 text-orange-200" />
            <p className="text-orange-100 text-sm font-bold">Available Balance</p>
          </div>
          <p className="text-4xl font-black text-white mb-1">
            ₹{wallet?.balance?.toFixed(2) || '0.00'}
          </p>
          <p className="text-orange-100 text-xs">
            Use this balance on your next order
          </p>
        </div>
      </div>

      {/* Transactions */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Transaction History</h2>
        </div>

        {transactions.length === 0 ? (
          <div className="py-16 text-center">
            <WalletIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 font-medium text-sm">No transactions yet</p>
            <p className="text-gray-300 text-xs mt-1">
              Refunds will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {transactions.map((txn: WalletTransaction) => (
              <div key={txn._id} className="flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  txn.type === 'credit' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                  {txn.type === 'credit'
                    ? <ArrowDownLeft className="w-5 h-5 text-green-500" />
                    : <ArrowUpRight  className="w-5 h-5 text-red-400" />
                  }
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">
                    {txn.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDate(txn.createdAt)}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-right flex-shrink-0">
                  <p className={`font-black text-base ${
                    txn.type === 'credit' ? 'text-green-500' : 'text-red-400'
                  }`}>
                    {txn.type === 'credit' ? '+' : '-'}₹{txn.amount.toFixed(2)}
                  </p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    txn.status === 'completed'
                      ? 'bg-green-50 text-green-600'
                      : 'bg-yellow-50 text-yellow-600'
                  }`}>
                    {txn.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}