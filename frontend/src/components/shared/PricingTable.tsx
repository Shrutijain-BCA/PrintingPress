// src/components/shared/PricingTable.tsx
import Card from '../ui/Card'

const rows = [
  ['B&W Single Side', '₹0.50/page'],
  ['B&W Double Side', '₹0.80/page'],
  ['Color Single Side', '₹5.00/page'],
  ['Color Double Side', '₹8.00/page'],
  ['Spiral Binding', '₹30'],
  ['Hard Binding', '₹150'],
  ['Tape Binding', '₹20'],
  ['Premium Paper (80 GSM)', '+₹0.20/page'],
  ['Delivery', '₹30/order'],
]

export default function PricingTable() {
  return (
    <Card padding="sm">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1 mb-2">
        Pricing Guide
      </p>
      <div className="divide-y divide-gray-50">
        {rows.map(([label, price]) => (
          <div key={label} className="flex justify-between items-center px-1 py-2.5">
            <span className="text-sm text-gray-600">{label}</span>
            <span className="text-sm font-bold text-gray-900">{price}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}
