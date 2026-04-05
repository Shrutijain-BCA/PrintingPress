// src/pages/auth/Login.tsx
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Printer, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Zap, DollarSign, Package, LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon
  label: string
}

const features: Feature[] = [
  { icon: Zap, label: "Fast" },
  { icon: DollarSign, label: "Cheap" },
  { icon: Package, label: "Reliable" }
];

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated && user) {
    navigate(from || (user.role === 'vendor' ? '/vendor' : '/'), { replace: true })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex">
      {/* Brand panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FF6B00] flex-col justify-center items-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border-2 border-white"
              style={{
                width: `${100 + i * 50}px`,
                height: `${100 + i * 50}px`,
                top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center text-white">
          <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md p-3">
            <img
              src="/QUEUE_20260312_112901_0000.jpg"
              alt="Printify Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <p className="text-xl text-orange-100 font-semibold">Print anything. Instantly.</p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {features.map(({ icon: Icon, label }, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <Icon className="w-6 h-6 text-white" />
                <span className="text-sm font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-9 h-9 bg-[#FF6B00] rounded-xl flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-gray-900">Queue</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8">Sign in to continue</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@college.edu"
              required
            />

            <div className="relative">
              <Input
                label="Password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(s => !s)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
              Sign In <ArrowRight className="w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            No account?{' '}
            <Link to="/register" className="text-[#FF6B00] font-bold hover:underline">
              Create one
            </Link>
          </p>

          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-xl">
            <p className="text-xs font-bold text-orange-800 mb-2">Demo Credentials</p>
            <div className="space-y-1 text-xs text-orange-700 font-medium">
              <p>Student: student@demo.com / demo123</p>
              <p>Vendor:  vendor@demo.com  / demo123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
