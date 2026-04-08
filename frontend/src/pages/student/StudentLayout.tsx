// src/pages/student/StudentLayout.tsx
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Printer, Upload, ShoppingCart, Package, LogOut, User, Home } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

const navLinks = [
  { to: '/',        label: 'Home',   icon: Home,         exact: true },
  { to: '/upload',  label: 'Upload', icon: Upload,        exact: false },
  { to: '/orders',  label: 'Orders', icon: Package,       exact: false },
  { to: '/cart',    label: 'Cart',   icon: ShoppingCart,  exact: false },
]

export default function StudentLayout() {
  const { user, logout } = useAuth()
  const { itemCount }    = useCart()
  const navigate         = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-[#F7F7F7]">

      {/* ── Top Navbar ── */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 h-14 flex items-center justify-between">

          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#FF6B00] rounded-lg flex items-center justify-center">
              <Printer className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-black text-lg text-gray-900">Queue</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  `relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                    isActive ? 'bg-orange-50 text-[#FF6B00]' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                  }`
                }
              >
                <link.icon className="w-4 h-4" />
                {link.label}
                {link.label === 'Cart' && itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* User + logout */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl">
              <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-[#FF6B00]" />
              </div>
              <span className="text-xs font-bold text-gray-700">
                {user?.name.split(' ')[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* ── Page content ── */}
      <main className="max-w-3xl mx-auto">
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-bottom">
        <div className="flex">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.exact}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center py-2.5 text-[10px] font-bold transition-colors relative ${
                  isActive ? 'text-[#FF6B00]' : 'text-gray-400'
                }`
              }
            >
              <div className="relative mb-0.5">
                <link.icon className="w-5 h-5" />
                {link.label === 'Cart' && itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#FF6B00] text-white text-[8px] font-black rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </div>
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}
