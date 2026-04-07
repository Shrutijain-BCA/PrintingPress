// src/components/layout/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { PageSpinner } from '../ui/Spinner'
import type { UserRole } from '../../types'

interface Props {
  children: React.ReactNode
  role?: UserRole
}

export default function ProtectedRoute({ children, role }: Props) {
  const { isAuthenticated, isLoading, user } = useAuth()
  const location = useLocation()

  if (isLoading) return <PageSpinner />

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user?.role !== role) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}
