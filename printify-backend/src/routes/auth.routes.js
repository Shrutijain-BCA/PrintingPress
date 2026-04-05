// src/routes/auth.routes.js
const express  = require('express')
const { body } = require('express-validator')
const router   = express.Router()

const authController = require('../controllers/auth.controller')
const { protect }    = require('../middleware/auth')
const validate       = require('../middleware/validate')

// ── Validation rules ──────────────────────────────────────────────────────────

const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['student', 'vendor']).withMessage('Role must be student or vendor'),
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
]

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters'),
]

// ── Routes ────────────────────────────────────────────────────────────────────

router.post('/register', registerRules, validate, authController.register)
router.post('/login',    loginRules,    validate, authController.login)

// Protected
router.get('/me',              protect, authController.getMe)
router.put('/profile',         protect, authController.updateProfile)
router.put('/change-password', protect, changePasswordRules, validate, authController.changePassword)

module.exports = router
