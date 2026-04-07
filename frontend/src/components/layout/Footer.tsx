// src/components/layout/Footer.tsx
import { Printer } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-12 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#FF6B00] rounded-lg flex items-center justify-center">
            <Printer className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="font-black text-gray-900">Printify</span>
        </div>
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} Printify · Fast printing for students
        </p>
      </div>
    </footer>
  )
}
