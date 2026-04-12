// ─── User & Auth ─────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'vendor'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  college?: string   // students only
  shopName?: string  // vendors only
  address?: string
  createdAt: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'printing'
  | 'ready'
  | 'delivered'
  | 'rejected'
  | 'cancelled'

export interface PrintOptions {
  colorMode: 'bw' | 'color'
  pageSize: 'A4' | 'A3'
  sides: 'single' | 'double'
  copies: number
  binding: 'none' | 'spiral' | 'hard' | 'tape'
  paperQuality: 'standard' | 'premium'
}

export interface DocumentFile {
  id?: string
  name: string
  size: number
  type: string
  pages: number
  fileUrl?: string
}

export interface Order {
  id: string
  studentId: string
  vendorId?: string
  status: OrderStatus
  options: PrintOptions
  documents: DocumentFile[]
  totalPages: number
  totalPrice: number
  notes?: string
  createdAt: string
  updatedAt: string
  student?: Pick<User, 'name' | 'email' | 'phone'>
}

// ─── Cart ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string
  files: DocumentFile[]
  options: PrintOptions
  price: number
}

// ─── Vendor Pricing ──────────────────────────────────────────────────────────

export interface VendorPricing {
  bwSingle: number
  bwDouble: number
  colorSingle: number
  colorDouble: number
  spiralBind: number
  hardBind: number
  tapeBind: number
  premiumPaper: number
  deliveryFee: number
}

// ─── Shop ─────────────────────────────────────────────────────────────────────

export interface Shop {
  _id: string
  name: string
  ownerName: string
  phone: string
  address: string
  totalOrders: number
  completedOrders: number
  completionRate: number
  memberSince: string
  pricing: VendorPricing
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export interface PaymentBreakdown {
  totalAmount: number
  upfrontAmount: number
  platformFee: number
  amountPaid: number
  remainingAmount: number
}

export interface Payment {
  _id: string
  order: string
  razorpayOrderId: string
  razorpayPaymentId?: string
  status: 'created' | 'paid' | 'failed' | 'refunded' | 'partially_refunded'
  totalAmount: number
  upfrontAmount: number
  platformFee: number
  amountPaid: number
  remainingAmount: number
  refundAmount?: number
  refundedAt?: string
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export interface WalletTransaction {
  _id: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  orderId?: string
  status: 'pending' | 'completed' | 'failed'
  createdAt: string
}

export interface Wallet {
  _id: string
  user: string
  balance: number
  transactions: WalletTransaction[]
}
