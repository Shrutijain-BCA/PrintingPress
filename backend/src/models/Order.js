// src/models/Order.js
const mongoose = require('mongoose')

const printOptionsSchema = new mongoose.Schema(
  {
    colorMode:    { type: String, enum: ['bw', 'color'],                              default: 'bw'       },
    pageSize:     { type: String, enum: ['A4', 'A3'],                                 default: 'A4'       },
    sides:        { type: String, enum: ['single', 'double'],                         default: 'single'   },
    copies:       { type: Number, min: 1,                                             default: 1          },
    binding:      { type: String, enum: ['none', 'spiral', 'hard', 'tape'],           default: 'none'     },
    paperQuality: { type: String, enum: ['standard', 'premium'],                      default: 'standard' },
  },
  { _id: false }
)

const orderDocumentSchema = new mongoose.Schema(
  {
    document:  { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
    fileName:  { type: String, required: true },
    pageCount: { type: Number, required: true },
  },
  { _id: false }
)

const statusHistorySchema = new mongoose.Schema(
  {
    status:    { type: String, required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note:      { type: String },
    at:        { type: Date, default: Date.now },
  },
  { _id: false }
)

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true }, // e.g. ORD-2024-00001

    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vendor:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    documents:    [orderDocumentSchema],
    printOptions: { type: printOptionsSchema, required: true },

    totalPages: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'printing', 'ready', 'delivered', 'rejected', 'cancelled'],
      default: 'pending',
    },

    statusHistory: [statusHistorySchema],

    notes:          { type: String },          // student notes
    rejectionReason:{ type: String },          // vendor rejection reason
    deliveryType:   { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
  },
  { timestamps: true }
)

// Auto-generate order number before save
orderSchema.pre('save', async function (next) {
  if (this.orderNumber) return next()
  const count = await mongoose.model('Order').countDocuments()
  const pad   = String(count + 1).padStart(5, '0')
  this.orderNumber = `ORD-${new Date().getFullYear()}-${pad}`
  next()
})

module.exports = mongoose.model('Order', orderSchema)
