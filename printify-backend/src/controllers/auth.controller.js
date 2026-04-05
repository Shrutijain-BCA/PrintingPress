// src/controllers/auth.controller.js
const User        = require('../models/User')
const Pricing     = require('../models/Pricing')
const { signToken } = require('../utils/jwt')
const { success, error } = require('../utils/response')

// ── Register ──────────────────────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, phone, college, shopName } = req.body

    const exists = await User.findOne({ email })
    if (exists) return error(res, 'An account with this email already exists.', 409)

    const user = await User.create({ name, email, password, role, phone, college, shopName })

    // Create default pricing config for vendors
    if (role === 'vendor') {
      await Pricing.create({ vendor: user._id })
    }

    const token = signToken(user._id)
    return success(res, { user, token }, 'Account created successfully', 201)
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Login ─────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    if (!user) return error(res, 'No account found with this email.', 401)

    const isMatch = await user.comparePassword(password)
    if (!isMatch) return error(res, 'Incorrect password.', 401)

    if (!user.isActive) return error(res, 'Your account has been deactivated.', 401)

    const token = signToken(user._id)

    // Remove password from response
    user.password = undefined

    return success(res, { user, token }, 'Logged in successfully')
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get current user ──────────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
    return success(res, { user })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Update profile ────────────────────────────────────────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, college, shopName, address } = req.body

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, college, shopName, address },
      { new: true, runValidators: true }
    )
    return success(res, { user }, 'Profile updated')
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Change password ───────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id).select('+password')
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) return error(res, 'Current password is incorrect.', 400)

    user.password = newPassword
    await user.save()

    return success(res, null, 'Password changed successfully')
  } catch (err) {
    return error(res, err.message)
  }
}
