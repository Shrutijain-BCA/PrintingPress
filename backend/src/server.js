// src/server.js
require('dotenv').config()

const express = require('express')
const cors    = require('cors')
const morgan  = require('morgan')
const path    = require('path')

const connectDB = require('./config/db')

// ── Routes ────────────────────────────────────────────────────────────────────
const authRoutes     = require('./routes/auth.routes')
const documentRoutes = require('./routes/document.routes')
const orderRoutes    = require('./routes/order.routes')
const vendorRoutes   = require('./routes/vendor.routes')

// ── App setup ─────────────────────────────────────────────────────────────────
const app = express()

// Connect MongoDB
connectDB()

// ── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'https://printing-press-six.vercel.app',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/documents', documentRoutes)
app.use('/api/orders',    orderRoutes)
app.use('/api/vendor',    vendorRoutes)

// ── Health check ─────────────────────────────────────────────────────────────
app.get(process.env.NODE_ENV, (_req, res) => {
  res.json({ success: true, message: 'Printify API is running 🖨️', env: process.env.NODE_ENV })
})

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('💥 Error:', err.message)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  })
})

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)
})

module.exports = app
