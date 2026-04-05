// src/pages/auth/Unauthorized.tsx
import { useNavigate } from 'react-router-dom'
import { ShieldX } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'

export default function Unauthorized() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-500 mb-8">You don't have permission to view this page.</p>
        <Button onClick={() => navigate(user?.role === 'vendor' ? '/vendor' : '/')}>
          Go to My Dashboard
        </Button>
      </div>
    </div>
  )
}
