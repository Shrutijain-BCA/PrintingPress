// src/pages/vendor/VendorPricing.tsx
import { useState, useEffect } from 'react'
import { Save, Check } from 'lucide-react'
import { api } from '../../utils/api'
import Spinner from '../../components/ui/Spinner'
import type { VendorPricing } from '../../types'

const fields: { key: keyof VendorPricing; label: string; unit: string }[] = [
  { key: 'bwSingle',     label: 'B&W Single Side',        unit: '₹/page'       },
  { key: 'bwDouble',     label: 'B&W Double Side',        unit: '₹/page'       },
  { key: 'colorSingle',  label: 'Color Single Side',      unit: '₹/page'       },
  { key: 'colorDouble',  label: 'Color Double Side',      unit: '₹/page'       },
  { key: 'spiralBind',   label: 'Spiral Binding',         unit: '₹/book'       },
  { key: 'hardBind',     label: 'Hard Binding',           unit: '₹/book'       },
  { key: 'tapeBind',     label: 'Tape Binding',           unit: '₹/book'       },
  { key: 'premiumPaper', label: 'Premium Paper (80 GSM)', unit: '₹/page extra' },
  { key: 'deliveryFee',  label: 'Delivery Fee',           unit: '₹/order'      },
]

const DEFAULTS: VendorPricing = {
  bwSingle: 0.5, bwDouble: 0.8, colorSingle: 5, colorDouble: 8,
  spiralBind: 30, hardBind: 150, tapeBind: 20, premiumPaper: 0.2, deliveryFee: 30,
}

export default function VendorPricing() {
  const [pricing, setPricing]   = useState<VendorPricing>(DEFAULTS)
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    api.get<{ data: { pricing: VendorPricing } }>('/vendor/pricing')
      .then(res => setPricing(res.data.pricing))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  const update = (k: keyof VendorPricing, v: string) =>
    setPricing(p => ({ ...p, [k]: parseFloat(v) || 0 }))

  const handleSave = async () => {
    setSaving(true); setError('')
    try {
      await api.put('/vendor/pricing', pricing)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save pricing')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="flex justify-center pt-20"><Spinner size="lg" /></div>

  const samplePrice = (pricing.bwSingle * 20) + pricing.spiralBind

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Pricing Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Students see these rates when placing orders</p>
      </div>

      {error && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">{error}</div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Your Rates</p>
        </div>
        <div className="divide-y divide-gray-50">
          {fields.map(f => (
            <div key={f.key} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="font-semibold text-gray-900 text-sm">{f.label}</p>
                <p className="text-xs text-gray-400">{f.unit}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-gray-400 text-sm font-bold">₹</span>
                <input
                  type="number" step="0.01" min="0"
                  value={pricing[f.key]}
                  onChange={e => update(f.key, e.target.value)}
                  className="w-24 px-3 py-2 text-right text-sm font-bold text-gray-900 border-2 border-gray-200 rounded-xl focus:border-[#FF6B00] focus:outline-none transition-colors"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
        <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">Live Preview</p>
        <p className="text-sm text-orange-800">
          20-page B&W single-sided + spiral binding = <strong>₹{samplePrice.toFixed(2)}</strong>
        </p>
      </div>

      <button onClick={handleSave} disabled={saving}
        className={`w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60 ${
          saved ? 'bg-green-500 text-white' : 'bg-gray-900 text-white hover:bg-gray-800'
        }`}
      >
        {saving ? <Spinner size="sm" /> : saved ? <><Check className="w-5 h-5" /> Saved!</> : <><Save className="w-5 h-5" /> Save Pricing</>}
      </button>
    </div>
  )
}
