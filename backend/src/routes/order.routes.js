// src/routes/order.routes.js
const express  = require('express')
const { body } = require('express-validator')
const router   = express.Router()

const orderController = require('../controllers/order.controller')
const { protect, restrictTo } = require('../middleware/auth')
const validate = require('../middleware/validate')

// All order routes require login
router.use(protect)

const createOrderRules = [
  body('documentIds').isArray({ min: 1 }).withMessage('At least one document is required'),
  body('printOptions.colorMode').isIn(['bw', 'color']).withMessage('Invalid color mode'),
  body('printOptions.pageSize').isIn(['A4', 'A3']).withMessage('Invalid page size'),
  body('printOptions.sides').isIn(['single', 'double']).withMessage('Invalid sides option'),
  body('printOptions.copies').isInt({ min: 1 }).withMessage('Copies must be at least 1'),
  body('printOptions.binding').isIn(['none', 'spiral', 'hard', 'tape']).withMessage('Invalid binding'),
  body('printOptions.paperQuality').isIn(['standard', 'premium']).withMessage('Invalid paper quality'),
]

// Student routes
router.post('/',          restrictTo('student'), createOrderRules, validate, orderController.createOrder)
router.get('/',           restrictTo('student'), orderController.getMyOrders)
router.get('/:id',        orderController.getOrder)   // both student & vendor
router.patch('/:id/cancel', restrictTo('student'), orderController.cancelOrder)

module.exports = router
