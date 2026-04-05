// src/routes/vendor.routes.js
const express  = require('express')
const { body } = require('express-validator')
const router   = express.Router()

const vendorController = require('../controllers/vendor.controller')
const { protect, restrictTo } = require('../middleware/auth')
const validate = require('../middleware/validate')

// All vendor routes require login + vendor role
router.use(protect, restrictTo('vendor'))

const statusRules = [
  body('status')
    .isIn(['accepted', 'printing', 'ready', 'delivered', 'rejected'])
    .withMessage('Invalid status'),
]

const pricingRules = [
  body('bwSingle').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('bwDouble').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('colorSingle').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('colorDouble').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('spiralBind').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('hardBind').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('tapeBind').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('premiumPaper').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
  body('deliveryFee').optional().isFloat({ min: 0 }).withMessage('Invalid price'),
]

// Dashboard
router.get('/dashboard', vendorController.getDashboard)

// Orders
router.get('/orders',              vendorController.getOrders)
router.get('/orders/:id',          vendorController.getOrder)
router.patch('/orders/:id/status', statusRules, validate, vendorController.updateOrderStatus)

// Pricing
router.get('/pricing',  vendorController.getPricing)
router.put('/pricing',  pricingRules, validate, vendorController.updatePricing)

module.exports = router
