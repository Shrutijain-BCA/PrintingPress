// src/routes/shop.routes.js
const express = require('express')
const router  = express.Router()

const shopController = require('../controllers/shop.controller')
const { protect }    = require('../middleware/auth')

// All shop routes require login
router.use(protect)

router.get('/',     shopController.getShops)
router.get('/:id',  shopController.getShop)

module.exports = router