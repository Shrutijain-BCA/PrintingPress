// src/pages/student/Home.tsx
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, Palette, BookOpen, Book, Zap, Shield, Clock, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import PricingTable from '../../components/shared/PricingTable'

const services = [
  { icon: FileText,  label: 'B&W Print',    sub: '₹0.50/page', color: 'bg-gray-100',    iconColor: 'text-gray-700' },
  { icon: Palette,   label: 'Color Print',   sub: '₹5/page',    color: 'bg-red-50',      iconColor: 'text-red-500'  },
  { icon: BookOpen,  label: 'Spiral Bind',   sub: '₹30/book',   color: 'bg-blue-50',     iconColor: 'text-blue-500' },
  { icon: Book,      label: 'Hard Bind',     sub: '₹150/book',  color: 'bg-purple-50',   iconColor: 'text-purple-500' },
]

const whyUs = [
  { icon: Zap,    title: 'Ready in minutes',  desc: 'Most orders fulfilled in under 30 mins', bg: 'bg-yellow-50', color: 'text-yellow-500' },
  { icon: Shield, title: 'Secure uploads',    desc: 'Files deleted after printing',            bg: 'bg-green-50',  color: 'text-green-500'  },
  { icon: Clock,  title: 'Order anytime',     desc: 'Pick up when ready — no waiting',         bg: 'bg-blue-50',   color: 'text-blue-500'   },
]

export default function Home() {
  const navigate = useNavigate()
  const { user }  = useAuth()
  const hour      = new Date().getHours()
  const greeting  = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="px-4 pt-6 pb-24 md:pb-10 space-y-8">

      {/* Greeting */}
      <div>
        <p className="text-sm text-gray-500">{greeting},</p>
        <h1 className="text-2xl font-black text-gray-900">{user?.name?.split(' ')[0]} 👋</h1>
        {user?.college && <p className="text-xs text-gray-400 mt-0.5">{user.college}</p>}
      </div>

      {/* Hero CTA */}
      <div
        onClick={() => navigate('/upload')}
        className="bg-[#FF6B00] rounded-2xl p-6 cursor-pointer active:scale-[0.98] transition-transform relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute right-6 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-8" />
        <div className="relative z-10">
          <p className="text-orange-100 text-xs font-bold uppercase tracking-wider mb-1">Get started</p>
          <h2 className="text-white text-2xl font-black mb-4 leading-tight">
            Print Your<br />Documents
          </h2>
          <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3">
            <Upload className="w-4 h-4 text-[#FF6B00]" />
            <span className="text-sm font-semibold text-gray-700 flex-1">Upload files to begin</span>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Services */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-3">Services</h2>
        <div className="grid grid-cols-2 gap-3">
          {services.map(s => (
            <button
              key={s.label}
              onClick={() => navigate('/upload')}
              className="flex items-center gap-3 bg-white rounded-2xl p-4 border border-gray-100 hover:border-orange-200 transition-all active:scale-[0.97] text-left"
            >
              <div className={`w-9 h-9 ${s.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <s.icon className={`w-4 h-4 ${s.iconColor}`} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{s.label}</div>
                <div className="text-xs text-gray-400">{s.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-3">Why Queue?</h2>
        <div className="space-y-2.5">
          {whyUs.map(w => (
            <div key={w.title} className="flex items-center gap-4 bg-white rounded-2xl p-4 border border-gray-100">
              <div className={`w-9 h-9 ${w.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                <w.icon className={`w-4 h-4 ${w.color}`} />
              </div>
              <div>
                <div className="font-bold text-gray-900 text-sm">{w.title}</div>
                <div className="text-xs text-gray-400">{w.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section>
        <h2 className="text-base font-black text-gray-900 mb-3">Pricing</h2>
        <PricingTable />
      </section>

    </div>
  )
}
