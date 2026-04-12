// src/models/Wallet.js
const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ['credit', 'debit'], required: true },
    amount:      { type: Number, required: true },
    description: { type: String, required: true },
    orderId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    status:      { type: String, enum: ['pending', 'completed', 'failed'], default: 'completed' },
  },
  { timestamps: true }
)

const walletSchema = new mongoose.Schema(
  {
    user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    balance:      { type: Number, default: 0, min: 0 },
    transactions: [transactionSchema],
  },
  { timestamps: true }
)

// Add money to wallet
walletSchema.methods.credit = async function (amount, description, orderId) {
  this.balance += amount
  this.transactions.push({ type: 'credit', amount, description, orderId })
  await this.save()
  return this
}

// Deduct money from wallet
walletSchema.methods.debit = async function (amount, description, orderId) {
  if (this.balance < amount) throw new Error('Insufficient wallet balance')
  this.balance -= amount
  this.transactions.push({ type: 'debit', amount, description, orderId })
  await this.save()
  return this
}

// Get or create wallet for a user
walletSchema.statics.getOrCreate = async function (userId) {
  let wallet = await this.findOne({ user: userId })
  if (!wallet) wallet = await this.create({ user: userId })
  return wallet
}

module.exports = mongoose.model('Wallet', walletSchema)