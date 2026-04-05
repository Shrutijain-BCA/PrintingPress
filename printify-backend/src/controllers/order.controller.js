// src/controllers/order.controller.js
const Order    = require('../models/Order')
const Document = require('../models/Document')
const Pricing  = require('../models/Pricing')
const User     = require('../models/User')
const { calculatePrice } = require('../utils/pricing')
const { success, error } = require('../utils/response')

// ── Create order (student) ────────────────────────────────────────────────────
exports.createOrder = async (req, res) => {
  try {
    const { documentIds, printOptions, notes, deliveryType } = req.body

    if (!documentIds || documentIds.length === 0)
      return error(res, 'At least one document is required.', 400)

    // Fetch documents and verify ownership
    const docs = await Document.find({
      _id: { $in: documentIds },
      user: req.user._id,
    })

    if (docs.length !== documentIds.length)
      return error(res, 'One or more documents not found or not yours.', 404)

    // Find a vendor (for now pick the first active vendor — in production use location/rating)
    const vendor = await User.findOne({ role: 'vendor', isActive: true })

    // Get vendor pricing if vendor exists
    let pricing = null
    if (vendor) {
      pricing = await Pricing.findOne({ vendor: vendor._id })
    }

    const totalPages = docs.reduce((sum, d) => sum + d.pageCount, 0)
    const totalPrice = calculatePrice(printOptions, totalPages, pricing || undefined)

    const order = await Order.create({
      student:      req.user._id,
      vendor:       vendor?._id,
      documents:    docs.map(d => ({ document: d._id, fileName: d.fileName, pageCount: d.pageCount })),
      printOptions,
      totalPages,
      totalPrice,
      notes,
      deliveryType: deliveryType || 'pickup',
      statusHistory: [{ status: 'pending', updatedBy: req.user._id }],
    })

    const populated = await order.populate(['student', 'vendor'])
    return success(res, { order: populated }, 'Order placed successfully', 201)
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get student's own orders ───────────────────────────────────────────────────
exports.getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query

    const filter = { student: req.user._id }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate('vendor', 'name shopName phone')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    const total = await Order.countDocuments(filter)

    return success(res, {
      orders,
      pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / limit) },
    })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get single order ──────────────────────────────────────────────────────────
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      $or: [{ student: req.user._id }, { vendor: req.user._id }],
    }).populate('student vendor')

    if (!order) return error(res, 'Order not found.', 404)
    return success(res, { order })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Cancel order (student) ────────────────────────────────────────────────────
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, student: req.user._id })
    if (!order) return error(res, 'Order not found.', 404)

    if (!['pending'].includes(order.status))
      return error(res, 'Only pending orders can be cancelled.', 400)

    order.status = 'cancelled'
    order.statusHistory.push({ status: 'cancelled', updatedBy: req.user._id })
    await order.save()

    return success(res, { order }, 'Order cancelled')
  } catch (err) {
    return error(res, err.message)
  }
}
