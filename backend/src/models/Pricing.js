// src/models/Pricing.js
const mongoose = require('mongoose')

const pricingSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    bwSingle:     { type: Number, default: 0.50 },
    bwDouble:     { type: Number, default: 0.80 },
    colorSingle:  { type: Number, default: 5.00 },
    colorDouble:  { type: Number, default: 8.00 },
    spiralBind:   { type: Number, default: 30.00 },
    hardBind:     { type: Number, default: 150.00 },
    tapeBind:     { type: Number, default: 20.00 },
    premiumPaper: { type: Number, default: 0.20 },
    deliveryFee:  { type: Number, default: 30.00 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Pricing', pricingSchema)
