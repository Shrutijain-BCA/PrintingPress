// src/models/Payment.js
const mongoose = require('mongoose')

const paymentSchema = new mongoose.Schema(
  {
    order:              { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
    student:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Razorpay details
    razorpayOrderId:    { type: String, required: true },   // created by backend
    razorpayPaymentId:  { type: String },                   // returned after payment
    razorpaySignature:  { type: String },                   // for verification

    // Amount breakdown
    totalAmount:        { type: Number, required: true },   // full print cost
    upfrontAmount:      { type: Number, required: true },   // 50% of total
    platformFee:        { type: Number, required: true },   // 10% of total
    amountPaid:         { type: Number, required: true },   // upfront + platform fee
    remainingAmount:    { type: Number, required: true },   // 50% paid at pickup

    // Status
    status: {
      type: String,
      enum: ['created', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'created',
    },

    // Refund details
    refundId:     { type: String },
    refundAmount: { type: Number },
    refundReason: { type: String },
    refundedAt:   { type: Date },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Payment', paymentSchema)