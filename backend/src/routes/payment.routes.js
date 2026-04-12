// src/routes/payment.routes.js
const express = require('express')
const router  = express.Router()

const paymentController = require('../controllers/payment.controller')
const { protect, restrictTo } = require('../middleware/auth')

// All payment routes require login
router.use(protect)

// Student only
router.post('/create-order',     restrictTo('student'), paymentController.createPaymentOrder)
router.post('/verify',           restrictTo('student'), paymentController.verifyPayment)
router.get('/wallet',            restrictTo('student'), paymentController.getWallet)
router.get('/order/:orderId',    restrictTo('student'), paymentController.getPaymentDetails)

module.exports = router