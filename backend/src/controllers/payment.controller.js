// src/controllers/payment.controller.js
const Razorpay = require('razorpay')
const crypto   = require('crypto')

const Payment = require('../models/Payment')
const Order   = require('../models/Order')
const Wallet  = require('../models/Wallet')
const { success, error } = require('../utils/response')

// Initialize Razorpay
const razorpay = new Razorpay({
  RAZORPAY_KEY_ID:     process.env.RAZORPAY_KEY_ID,
  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
})

// ── Create Razorpay Order ─────────────────────────────────────────────────────
exports.createPaymentOrder = async (req, res) => {
  try {
    const { orderId } = req.body

    const order = await Order.findOne({ _id: orderId, student: req.user._id })
    if (!order) return error(res, 'Order not found.', 404)

    if (order.paymentStatus === 'paid')
      return error(res, 'Order already paid.', 400)

    // Calculate amounts
    const totalAmount    = order.totalPrice
    const platformFee    = Math.round(totalAmount * 0.10 * 100) / 100  // 10%
    const upfrontAmount  = Math.round(totalAmount * 0.50 * 100) / 100  // 50%
    const amountPaid     = upfrontAmount + platformFee
    const remainingAmount = totalAmount - upfrontAmount

    // Create Razorpay order (amount in paise)
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(amountPaid * 100),
      currency: 'INR',
      receipt:  `order_${order._id}`,
      notes: {
        orderId:    order._id.toString(),
        studentId:  req.user._id.toString(),
      },
    })

    // Save payment record
    const payment = await Payment.create({
      order:           order._id,
      student:         req.user._id,
      razorpayOrderId: razorpayOrder.id,
      totalAmount,
      upfrontAmount,
      platformFee,
      amountPaid,
      remainingAmount,
      status:          'created',
    })

    return success(res, {
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
      paymentId:       payment._id,
      breakdown: {
        totalAmount,
        upfrontAmount,
        platformFee,
        amountPaid,
        remainingAmount,
      },
      key: process.env.RAZORPAY_KEY_ID,
    }, 'Payment order created')

  } catch (err) {
    return error(res, err.message)
  }
}

// ── Verify Payment ────────────────────────────────────────────────────────────
exports.verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, orderId } = req.body

    // Verify signature
    const body      = razorpayOrderId + '|' + razorpayPaymentId
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    if (expected !== razorpaySignature)
      return error(res, 'Payment verification failed. Invalid signature.', 400)

    // Update payment record
    const payment = await Payment.findOneAndUpdate(
      { razorpayOrderId },
      {
        razorpayPaymentId,
        razorpaySignature,
        status: 'paid',
      },
      { new: true }
    )

    // Update order payment status
    await Order.findByIdAndUpdate(orderId, {
      paymentStatus: 'paid',
      status:        'pending',  // now visible to vendor
    })

    return success(res, { payment }, 'Payment verified successfully')

  } catch (err) {
    return error(res, err.message)
  }
}

// ── Process Refund ────────────────────────────────────────────────────────────
exports.processRefund = async (orderId, reason, cancelledByStudent = false) => {
  const payment = await Payment.findOne({ order: orderId, status: 'paid' })
  if (!payment) return

  // Calculate refund amount
  // If cancelled by student before approval → refund upfront only (platform fee kept)
  // If rejected by vendor → full refund (upfront + platform fee)
  const refundAmount = cancelledByStudent
    ? payment.upfrontAmount
    : payment.amountPaid

  // Razorpay refund
  try {
    const refund = await razorpay.payments.refund(payment.razorpayPaymentId, {
      amount: Math.round(refundAmount * 100), // paise
      notes:  { reason },
    })

    // Update payment record
    payment.status       = 'refunded'
    payment.refundId     = refund.id
    payment.refundAmount = refundAmount
    payment.refundReason = reason
    payment.refundedAt   = new Date()
    await payment.save()

  } catch {
    // If Razorpay refund fails in test mode, still credit wallet
  }

  // Credit student wallet
  const wallet = await Wallet.getOrCreate(payment.student)
  await wallet.credit(
    refundAmount,
    reason,
    orderId
  )

  return refundAmount
}

// ── Get Payment Details ───────────────────────────────────────────────────────
exports.getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params

    const payment = await Payment.findOne({
      order:   orderId,
      student: req.user._id,
    })

    if (!payment) return error(res, 'Payment not found.', 404)
    return success(res, { payment })

  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get Wallet ────────────────────────────────────────────────────────────────
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.getOrCreate(req.user._id)
    return success(res, { wallet })
  } catch (err) {
    return error(res, err.message)
  }
}