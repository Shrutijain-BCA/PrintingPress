// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import ProtectedRoute from './components/layout/ProtectedRoute'

// ── Auth pages ──────────────────────────────────────────────────────────────
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Unauthorized from './pages/auth/Unauthorized'

// ── Student pages ───────────────────────────────────────────────────────────
import StudentLayout from './pages/student/StudentLayout'
import Home from './pages/student/Home'
import Upload from './pages/student/Upload'
import PrintOptions from './pages/student/PrintOptions'
import Cart from './pages/student/Cart'
import Orders from './pages/student/Orders'
import ShopSelector from './pages/student/ShopSelector'
import Payment from './pages/student/Payment'
import Wallet from './pages/student/Wallet'


// ── Vendor pages ────────────────────────────────────────────────────────────
import VendorLayout from './pages/vendor/VendorLayout'
import VendorDashboard from './pages/vendor/VendorDashboard'
import VendorOrders from './pages/vendor/VendorOrders'
import VendorPricing from './pages/vendor/VendorPricing'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Routes>

            {/* ── Public ── */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* ── Student (role: student) ── */}
            <Route
              path="/"
              element={
                <ProtectedRoute role="student">
                  <StudentLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="upload" element={<Upload />} />
              <Route path="print-options" element={<PrintOptions />} />
              <Route path="cart" element={<Cart />} />
              <Route path="orders" element={<Orders />} />
              <Route path="shops" element={<ShopSelector />} />
              <Route path="payment" element={<Payment />} />
              <Route path="wallet" element={<Wallet />} />
            </Route>

            {/* ── Vendor (role: vendor) ── */}
            <Route
              path="/vendor"
              element={
                <ProtectedRoute role="vendor">
                  <VendorLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<VendorDashboard />} />
              <Route path="orders" element={<VendorOrders />} />
              <Route path="pricing" element={<VendorPricing />} />
            </Route>

            {/* ── Fallback ── */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  )
}
