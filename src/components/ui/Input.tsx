// src/components/ui/Input.tsx
import { InputHTMLAttributes, forwardRef } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = '', ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`
          w-full px-4 py-3 rounded-xl border-2 font-medium text-sm
          text-gray-900 placeholder-gray-400 bg-gray-50 focus:bg-white
          transition-colors outline-none
          ${error ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-[#FF6B00]'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
export default Input
