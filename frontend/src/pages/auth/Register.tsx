// src/pages/auth/Register.tsx
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Printer, GraduationCap, Store, ArrowRight, ArrowLeft } from 'lucide-react'
import { useAuth, type RegisterPayload } from '../../context/AuthContext'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import type { UserRole } from '../../types'

type Step = 'role' | 'details'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [step, setStep]   = useState<Step>('role')
  const [role, setRole]   = useState<UserRole | null>(null)
  const [form, setForm]   = useState({ name: '', email: '', password: '', phone: '', college: '', shopName: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!role) return
    setError('')
    setLoading(true)
    try {
      await register({ ...form, role } as RegisterPayload)
      navigate(role === 'vendor' ? '/vendor' : '/', { replace: true })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-[#FF6B00] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Printer className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-1">Join Printify today</p>
        </div>

        {/* Step 1 — Role picker */}
        {step === 'role' && (
          <div className="space-y-3">
            <p className="text-center text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">
              I am a…
            </p>

            {([
              {
                value: 'student' as UserRole,
                icon: GraduationCap,
                title: 'Student',
                desc: 'Upload documents & place print orders',
              },
              {
                value: 'vendor' as UserRole,
                icon: Store,
                title: 'Print Shop Owner',
                desc: 'Receive and fulfil print orders',
              },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => { setRole(opt.value); setStep('details') }}
                className="w-full flex items-center gap-4 p-5 bg-white rounded-2xl border-2 border-gray-200 hover:border-[#FF6B00] transition-all group text-left"
              >
                <div className="w-12 h-12 bg-orange-50 group-hover:bg-[#FF6B00] rounded-xl flex items-center justify-center transition-colors flex-shrink-0">
                  <opt.icon className="w-6 h-6 text-[#FF6B00] group-hover:text-white transition-colors" />
                </div>
                <div className="flex-1">
                  <div className="font-bold text-gray-900">{opt.title}</div>
                  <div className="text-sm text-gray-500">{opt.desc}</div>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-[#FF6B00]" />
              </button>
            ))}

            <p className="text-center pt-4 text-sm text-gray-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#FF6B00] font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        )}

        {/* Step 2 — Details */}
        {step === 'details' && (
          <div className="bg-white rounded-2xl border-2 border-gray-100 p-8 shadow-sm">
            <button
              onClick={() => setStep('role')}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                {role === 'student'
                  ? <GraduationCap className="w-5 h-5 text-[#FF6B00]" />
                  : <Store className="w-5 h-5 text-[#FF6B00]" />
                }
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">
                  {role === 'student' ? 'Student Account' : 'Vendor Account'}
                </div>
                <div className="text-xs text-gray-400">Fill in your details</div>
              </div>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm font-semibold rounded-xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input label="Full Name" value={form.name} onChange={e => update('name', e.target.value)} placeholder="Rahul Kumar" required />
              <Input label="Email" type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@college.edu" required />
              <Input label="Password" type="password" value={form.password} onChange={e => update('password', e.target.value)} placeholder="Min. 8 characters" required />
              <Input label="Phone Number" type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="+91 98765 43210" />
              {role === 'student' && (
                <Input label="College Name" value={form.college} onChange={e => update('college', e.target.value)} placeholder="IIT Bombay" />
              )}
              {role === 'vendor' && (
                <Input label="Shop Name" value={form.shopName} onChange={e => update('shopName', e.target.value)} placeholder="Quick Print Co." />
              )}

              <Button type="submit" size="lg" className="w-full mt-2" loading={loading}>
                Create Account <ArrowRight className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
