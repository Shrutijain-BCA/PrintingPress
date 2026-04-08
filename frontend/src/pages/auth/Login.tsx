// src/pages/auth/Login.tsx
import { useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { Printer, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import { Zap, IndianRupee, Package } from "lucide-react";

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
          <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-md shadow-lg">
            <img
              src="/logo.jpg"
              alt="Queue Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-5xl font-black tracking-tight mb-3">Queue</h1>
          <p className="text-xl text-orange-100 font-semibold">Queue From Anywhere.</p>
          <div className="mt-12 grid grid-cols-3 gap-4">
            {[
              { icon: Zap, label: "Fast" },
              { icon: IndianRupee, label: "Cheap" },
              { icon: Package, label: "Reliable" }
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">
                <Icon className="w-6 h-6 mb-1 text-orange-200" />
                <div className="text-sm font-bold text-orange-100">{label}</div>
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

          <div className="mt-8 p-5 bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl text-center">
            <img
              src="/krmu-logo.jpg"
              alt="KR Mangalam University"
              className="w-12 h-12 mx-auto mb-2 object-contain"
            />
            <p className="text-xs font-bold text-orange-800">Academic Project</p>
            <a
              href="https://www.krmangalam.edu.in"
              target="_blank"
              className="text-xs text-orange-700 font-medium hover:underline"
            >
              KR Mangalam University
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
