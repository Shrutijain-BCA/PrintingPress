// src/components/ui/Card.tsx
import { HTMLAttributes, ReactNode } from 'react'

interface Props extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'sm' | 'md' | 'lg'
}

const paddingMap = { sm: 'p-4', md: 'p-5', lg: 'p-6' }

export default function Card({
  children,
  padding = 'md',
  className = '',
  ...props
}: Props) {
  return (
    <div
      className={`bg-white rounded-2xl border border-gray-100 ${paddingMap[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
