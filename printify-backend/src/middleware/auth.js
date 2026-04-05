// src/middleware/auth.js
const { verifyToken } = require('../utils/jwt')
const User            = require('../models/User')
const { error }       = require('../utils/response')

// Verify JWT and attach user to req
const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer '))
      return error(res, 'Not authenticated. Please log in.', 401)

    const token   = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    const user = await User.findById(decoded.id)
    if (!user) return error(res, 'User no longer exists.', 401)
    if (!user.isActive) return error(res, 'Account is deactivated.', 401)

    req.user = user
    next()
  } catch (err) {
    return error(res, 'Invalid or expired token. Please log in again.', 401)
  }
}

// Restrict to specific roles
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return error(res, `Access denied. This route is for ${roles.join('/')} only.`, 403)
  next()
}

module.exports = { protect, restrictTo }
