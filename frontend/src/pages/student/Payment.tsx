// src/pages/student/Payment.tsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShieldCheck, CreditCard, Wallet, AlertCircle } from 'lucide-react'
import { api } from '../../utils/api'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import type { PaymentBreakdown } from '../../types'

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function Payment() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { user }  = useAuth()
  const { files, options, price, shopId } = location.state || {}

  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [, setBreakdown] = useState<PaymentBreakdown | null>(null)

  // Calculate breakdown instantly from price
  const totalAmount    = price || 0
  const platformFee    = Math.round(totalAmount * 0.10 * 100) / 100
  const upfrontAmount  = Math.round(totalAmount * 0.50 * 100) / 100
  const amountToPay    = upfrontAmount + platformFee
  const remainingAmount = totalAmount - upfrontAmount

  const loadRazorpay = (): Promise<boolean> => {
    return new Promise(resolve => {
      if (window.Razorpay) { resolve(true); return }
      const script    = document.createElement('script')
      script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload   = () => resolve(true)
      script.onerror  = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async () => {
    setLoading(true)
    setError('')

    try {
      // Step 1 — Create order in backend first
      const orderRes = await api.post<{ data: { order: any } }>('/orders', {
        documentIds:  files?.map((f: any) => f._id).filter(Boolean),
        printOptions: options,
        shopId,
        deliveryType: 'pickup',
      })

      const order = orderRes.data.order

      // Step 2 — Create Razorpay payment order
      const paymentRes = await api.post<{ data: any }>('/payments/create-order', {
        orderId: order._id,
      })

      const paymentData = paymentRes.data
      setBreakdown(paymentData.breakdown)

      // Step 3 — Load Razorpay script
      const loaded = await loadRazorpay()
      if (!loaded) {
        setError('Failed to load payment gateway. Please check your internet connection.')
        setLoading(false)
        return
      }

      // Step 4 — Open Razorpay checkout
      const rzpOptions = {
        key:         paymentData.key,
        amount:      paymentData.amount,
        currency:    paymentData.currency,
        name:        'Printify',
        description: `Print Order - ${files?.length} file(s)`,
        order_id:    paymentData.razorpayOrderId,
        prefill: {
          name:    user?.name,
          email:   user?.email,
          contact: user?.phone || '',
        },
        theme: { color: '#FF6B00' },
        handler: async (response: any) => {
          try {
            // Step 5 — Verify payment
            await api.post('/payments/verify', {
              razorpayOrderId:   response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId:           order._id,
            })

            // Step 6 — Navigate to orders
            navigate('/orders', {
              state: { paymentSuccess: true }
            })
          } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Payment verification failed')
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false)
            setError('Payment cancelled. Your order is saved — you can pay later.')
          },
        },
      }

      const rzp = new window.Razorpay(rzpOptions)
      rzp.open()

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Payment</h1>
        <p className="text-sm text-gray-400 mt-1">
          Pay securely via Razorpay
        </p>
      </div>

      {error && (
        <div className="mb-5 flex items-start gap-3 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Payment breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4 shadow-sm">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Payment Breakdown
          </p>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            ['Total Print Cost',  `₹${totalAmount.toFixed(2)}`,   'text-gray-900'],
            ['50% Upfront',       `₹${upfrontAmount.toFixed(2)}`, 'text-gray-900'],
            ['Platform Fee (10%)',`₹${platformFee.toFixed(2)}`,   'text-gray-900'],
            ['Remaining at pickup',`₹${remainingAmount.toFixed(2)}`,'text-gray-500'],
          ].map(([label, val, color]) => (
            <div key={label} className="flex justify-between items-center px-5 py-3.5">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-bold ${color}`}>{val}</span>
            </div>
          ))}
        </div>
        <div className="px-5 py-4 bg-[#FF6B00]">
          <div className="flex justify-between items-center">
            <span className="text-white font-bold">Pay Now</span>
            <span className="text-white font-black text-xl">
              ₹{amountToPay.toFixed(2)}
            </span>
          </div>
          <p className="text-orange-100 text-xs mt-1">
            Remaining ₹{remainingAmount.toFixed(2)} paid at pickup
          </p>
        </div>
      </div>

      {/* What you're ordering */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
          Order Summary
        </p>
        <div className="grid grid-cols-3 gap-2">
          {[
            ['Files',   String(files?.length || 0)],
            ['Color',   options?.colorMode === 'bw' ? 'B&W' : 'Color'],
            ['Copies',  String(options?.copies || 1)],
            ['Size',    options?.pageSize || 'A4'],
            ['Sides',   options?.sides === 'single' ? 'Single' : 'Double'],
            ['Binding', options?.binding === 'none' ? 'None' : options?.binding],
          ].map(([k, v]) => (
            <div key={k} className="bg-gray-50 rounded-xl p-2.5">
              <p className="text-[10px] text-gray-400 uppercase font-bold">{k}</p>
              <p className="text-xs font-bold text-gray-900 mt-0.5 capitalize">{v}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security note */}
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-2xl px-4 py-3 mb-6">
        <ShieldCheck className="w-5 h-5 text-green-500 flex-shrink-0" />
        <p className="text-xs text-green-700 font-semibold">
          Payments are secured by Razorpay. Your card details are never stored.
        </p>
      </div>

      {/* Pay button */}
      <Button
        size="lg"
        className="w-full mb-3"
        onClick={handlePayment}
        loading={loading}
      >
        <CreditCard className="w-5 h-5" />
        Pay ₹{amountToPay.toFixed(2)} via Razorpay
      </Button>

      {/* Wallet note */}
      <div className="flex items-center gap-2 justify-center">
        <Wallet className="w-4 h-4 text-gray-400" />
        <p className="text-xs text-gray-400 font-medium">
          Refunds go to your Printify wallet
        </p>
      </div>
    </div>
  )
}