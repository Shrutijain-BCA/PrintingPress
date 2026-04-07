// src/components/ui/Spinner.tsx
export default function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const s = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size]
  return (
    <div className={`${s} border-4 border-orange-200 border-t-[#FF6B00] rounded-full animate-spin`} />
  )
}

export function PageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFF8F0]">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-3 text-sm text-gray-400 font-medium">Loading…</p>
      </div>
    </div>
  )
}
