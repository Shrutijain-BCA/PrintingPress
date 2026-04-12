// src/controllers/vendor.controller.js
const Order   = require('../models/Order')
const Pricing = require('../models/Pricing')
const { processRefund } = require('./payment.controller')
const { success, error } = require('../utils/response')

// ── Get all incoming orders ───────────────────────────────────────────────────
exports.getOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query

    const filter = { vendor: req.user._id }
    if (status) filter.status = status

    const orders = await Order.find(filter)
      .populate('student', 'name email phone college')
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
    const order = await Order.findOne({ _id: req.params.id, vendor: req.user._id })
      .populate('student', 'name email phone college')
    if (!order) return error(res, 'Order not found.', 404)
    return success(res, { order })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Update order status ───────────────────────────────────────────────────────
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, rejectionReason } = req.body

    const VALID_TRANSITIONS = {
      pending:  ['accepted', 'rejected'],
      accepted: ['printing'],
      printing: ['ready'],
      ready:    ['delivered'],
    }

    const order = await Order.findOne({ _id: req.params.id, vendor: req.user._id })
    if (!order) return error(res, 'Order not found.', 404)

    const allowed = VALID_TRANSITIONS[order.status]
    if (!allowed || !allowed.includes(status))
      return error(res, `Cannot transition from "${order.status}" to "${status}".`, 400)

    order.status = status
    order.statusHistory.push({ status, updatedBy: req.user._id, note })

    if (status === 'rejected') {
      if (rejectionReason) order.rejectionReason = rejectionReason

      // Process full refund to student wallet
      if (order.paymentStatus === 'paid') {
        await processRefund(
          order._id,
          `Order rejected by shop. Full refund credited to wallet.`,
          false  // not cancelled by student so full refund
        )
        order.paymentStatus = 'refunded'
      }
    }

    await order.save()
    const populated = await order.populate('student', 'name email phone')

    return success(res, { order: populated }, `Order ${status}`)
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Dashboard stats ───────────────────────────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const [totalOrders, pendingOrders, todayOrders, revenueAgg, recentOrders] =
      await Promise.all([
        Order.countDocuments({ vendor: vendorId }),
        Order.countDocuments({ vendor: vendorId, status: { $in: ['pending', 'accepted', 'printing', 'ready'] } }),
        Order.countDocuments({ vendor: vendorId, createdAt: { $gte: today } }),
        Order.aggregate([
          { $match: { vendor: vendorId, status: 'delivered', createdAt: { $gte: today } } },
          { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]),
        Order.find({ vendor: vendorId })
          .populate('student', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
      ])

    const todayRevenue = revenueAgg[0]?.total || 0

    return success(res, {
      stats: { totalOrders, pendingOrders, todayOrders, todayRevenue },
      recentOrders,
    })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get pricing ───────────────────────────────────────────────────────────────
exports.getPricing = async (req, res) => {
  try {
    let pricing = await Pricing.findOne({ vendor: req.user._id })
    if (!pricing) pricing = await Pricing.create({ vendor: req.user._id })
    return success(res, { pricing })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Update pricing ────────────────────────────────────────────────────────────
exports.updatePricing = async (req, res) => {
  try {
    const fields = ['bwSingle','bwDouble','colorSingle','colorDouble','spiralBind','hardBind','tapeBind','premiumPaper','deliveryFee']
    const update = {}
    fields.forEach(f => { if (req.body[f] !== undefined) update[f] = req.body[f] })

    const pricing = await Pricing.findOneAndUpdate(
      { vendor: req.user._id },
      update,
      { new: true, upsert: true }
    )
    return success(res, { pricing }, 'Pricing updated')
  } catch (err) {
    return error(res, err.message)
  }
}
