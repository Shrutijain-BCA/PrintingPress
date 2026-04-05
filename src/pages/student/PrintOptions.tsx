// src/pages/student/PrintOptions.tsx
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ShoppingCart, ChevronRight } from 'lucide-react'
import { useCart } from '../../context/CartContext'
import { calculatePrice } from '../../utils/pricing'
import type { PrintOptions as Opts, DocumentFile } from '../../types'

/* ── Helpers ─────────────────────────────────────────────────────────────── */

function Chip({
  label, sub, active, onClick,
}: { label: string; sub?: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-3 rounded-xl border-2 text-sm font-semibold transition-all active:scale-95 text-left ${
        active
          ? 'border-[#FF6B00] bg-orange-50 text-[#FF6B00]'
          : 'border-gray-200 text-gray-700 hover:border-gray-300 bg-white'
      }`}
    >
      <div>{label}</div>
      {sub && (
        <div className={`text-xs mt-0.5 ${active ? 'text-orange-400' : 'text-gray-400'}`}>
          {sub}
        </div>
      )}
    </button>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 mb-3 overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}

/* ── Component ───────────────────────────────────────────────────────────── */

export default function PrintOptions() {
  const navigate       = useNavigate()
  const location       = useLocation()
  const { addItem }    = useCart()
  const files: DocumentFile[] = location.state?.files || []

  const [opts, setOpts] = useState<Opts>({
    colorMode: 'bw', pageSize: 'A4', sides: 'single',
    copies: 1, binding: 'none', paperQuality: 'standard',
  })

  const set = <K extends keyof Opts>(k: K, v: Opts[K]) =>
    setOpts(o => ({ ...o, [k]: v }))

  const totalPages = files.reduce((s, f) => s + (f.pages || 0), 0)
  const price      = calculatePrice(opts, totalPages)

  const handleAddToCart = () => {
    addItem(files, opts, price)
    navigate('/cart')
  }

  return (
    <div className="px-4 pt-6 pb-32 md:pb-10">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Print Options</h1>
        <p className="text-sm text-gray-400 mt-1">
          {files.length} file{files.length > 1 ? 's' : ''} · {totalPages} pages
        </p>
      </div>

      <Section title="Color Mode">
        <div className="flex gap-3">
          <Chip label="Black & White" sub="₹0.50–0.80/page" active={opts.colorMode === 'bw'}    onClick={() => set('colorMode', 'bw')} />
          <Chip label="Color"         sub="₹5–8/page"        active={opts.colorMode === 'color'} onClick={() => set('colorMode', 'color')} />
        </div>
      </Section>

      <Section title="Page Size">
        <div className="flex gap-3">
          <Chip label="A4" sub="Standard" active={opts.pageSize === 'A4'} onClick={() => set('pageSize', 'A4')} />
          <Chip label="A3" sub="2× price" active={opts.pageSize === 'A3'} onClick={() => set('pageSize', 'A3')} />
        </div>
      </Section>

      <Section title="Print Sides">
        <div className="flex gap-3">
          <Chip label="Single Sided"               active={opts.sides === 'single'} onClick={() => set('sides', 'single')} />
          <Chip label="Double Sided" sub="Eco 🌱"  active={opts.sides === 'double'} onClick={() => set('sides', 'double')} />
        </div>
      </Section>

      <Section title="Paper Quality">
        <div className="flex gap-3">
          <Chip label="Standard" sub="70 GSM"        active={opts.paperQuality === 'standard'} onClick={() => set('paperQuality', 'standard')} />
          <Chip label="Premium"  sub="+₹0.20/page"   active={opts.paperQuality === 'premium'}  onClick={() => set('paperQuality', 'premium')} />
        </div>
      </Section>

      <Section title="Binding">
        <div className="grid grid-cols-2 gap-3">
          {([
            { v: 'none',   label: 'No Binding',     sub: 'Free' },
            { v: 'tape',   label: 'Tape Binding',   sub: '₹20'  },
            { v: 'spiral', label: 'Spiral Binding', sub: '₹30'  },
            { v: 'hard',   label: 'Hard Binding',   sub: '₹150' },
          ] as const).map(b => (
            <Chip
              key={b.v} label={b.label} sub={b.sub}
              active={opts.binding === b.v}
              onClick={() => set('binding', b.v)}
            />
          ))}
        </div>
      </Section>

      <Section title="Copies">
        <div className="flex items-center gap-4">
          <button
            onClick={() => set('copies', Math.max(1, opts.copies - 1))}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-lg flex items-center justify-center transition-colors"
          >−</button>
          <span className="text-2xl font-black text-gray-900 w-10 text-center">{opts.copies}</span>
          <button
            onClick={() => set('copies', opts.copies + 1)}
            className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 font-black text-lg flex items-center justify-center transition-colors"
          >+</button>
        </div>
      </Section>

      {/* Sticky checkout bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 md:static md:border-0 md:bg-transparent md:p-0 md:mt-2">
        <div className="max-w-3xl mx-auto">
          <div className="bg-[#FF6B00] rounded-2xl px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-white font-black text-xl">₹{price.toFixed(2)}</p>
              <p className="text-orange-100 text-xs">{totalPages} pages × {opts.copies} {opts.copies === 1 ? 'copy' : 'copies'}</p>
            </div>
            <button
              onClick={handleAddToCart}
              className="bg-white text-[#FF6B00] font-bold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-orange-50 transition-colors active:scale-95 text-sm"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
