// src/controllers/shop.controller.js
const User    = require('../models/User')
const Pricing = require('../models/Pricing')
const Order   = require('../models/Order')
const { success, error } = require('../utils/response')

// ── Get all active print shops ────────────────────────────────────────────────
exports.getShops = async (req, res) => {
  try {
    const shops = await User.find(
      { role: 'vendor', isActive: true },
      'name shopName phone address createdAt'
    )

    // Attach pricing and order stats to each shop
    const shopsWithDetails = await Promise.all(
      shops.map(async (shop) => {
        const pricing = await Pricing.findOne({ vendor: shop._id })
        const totalOrders = await Order.countDocuments({ vendor: shop._id })
        const completedOrders = await Order.countDocuments({
          vendor: shop._id,
          status: 'delivered',
        })

        // Calculate rating based on completion rate
        const completionRate = totalOrders > 0
          ? Math.round((completedOrders / totalOrders) * 100)
          : 100

        return {
          _id:          shop._id,
          name:         shop.shopName || shop.name,
          ownerName:    shop.name,
          phone:        shop.phone,
          address:      shop.address || 'Address not set',
          totalOrders,
          completedOrders,
          completionRate,
          memberSince:  shop.createdAt,
          pricing: pricing || {
            bwSingle:    0.50,
            bwDouble:    0.80,
            colorSingle: 5.00,
            colorDouble: 8.00,
            spiralBind:  30.00,
            hardBind:    150.00,
            tapeBind:    20.00,
            premiumPaper: 0.20,
            deliveryFee: 30.00,
          },
        }
      })
    )

    return success(res, { shops: shopsWithDetails })
  } catch (err) {
    return error(res, err.message)
  }
}

// ── Get single shop details ───────────────────────────────────────────────────
exports.getShop = async (req, res) => {
  try {
    const shop = await User.findOne(
      { _id: req.params.id, role: 'vendor', isActive: true },
      'name shopName phone address createdAt'
    )

    if (!shop) return error(res, 'Shop not found.', 404)

    const pricing = await Pricing.findOne({ vendor: shop._id })
    const totalOrders = await Order.countDocuments({ vendor: shop._id })
    const completedOrders = await Order.countDocuments({
      vendor: shop._id,
      status: 'delivered',
    })

    return success(res, {
      shop: {
        _id:          shop._id,
        name:         shop.shopName || shop.name,
        ownerName:    shop.name,
        phone:        shop.phone,
        address:      shop.address || 'Address not set',
        totalOrders,
        completedOrders,
        memberSince:  shop.createdAt,
        pricing: pricing || {},
      },
    })
  } catch (err) {
    return error(res, err.message)
  }
}