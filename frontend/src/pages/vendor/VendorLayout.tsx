// src/pages/vendor/VendorLayout.tsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Printer, LayoutDashboard, Package, DollarSign, LogOut, User, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/vendor',         label: 'Dashboard', icon: LayoutDashboard, exact: true  },
  { to: '/vendor/orders',  label: 'Orders',    icon: Package,          exact: false },
  { to: '/vendor/pricing', label: 'Pricing',   icon: DollarSign,       exact: false },
]

export default function VendorLayout() {
  const { user, logout }  = useAuth()
  const navigate           = useNavigate()
  const [open, setOpen]    = useState(false)

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex">

      {/* ── Desktop Sidebar ── */}
      <aside className="hidden md:flex w-56 bg-gray-900 flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="p-5 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <Printer className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="font-black text-white text-sm">Printify</div>
              <div className="text-[10px] text-gray-500 font-medium">Vendor Panel</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#FF6B00] text-white'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-300" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate">
                {user?.shopName || user?.name}
              </div>
              <div className="text-[10px] text-gray-500">Vendor</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-gray-900 z-50">
        <div className="flex items-center justify-between px-4 h-13 py-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <Printer className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-white text-sm">Vendor Panel</span>
          </div>
          <button onClick={() => setOpen(o => !o)} className="text-gray-400 p-1">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown menu */}
        {open && (
          <div className="bg-gray-800 border-t border-gray-700 p-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.exact}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold ${
                    isActive ? 'bg-[#FF6B00] text-white' : 'text-gray-400'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-red-400"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 md:ml-56 p-6 pt-20 md:pt-6 min-h-screen">
        <Outlet />
      </main>

    </div>
  )
}
