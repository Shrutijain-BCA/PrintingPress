// src/utils/pricing.js

const DEFAULT_PRICING = {
  bwSingle: 0.5, bwDouble: 0.8,
  colorSingle: 5, colorDouble: 8,
  spiralBind: 30, hardBind: 150, tapeBind: 20,
  premiumPaper: 0.2, deliveryFee: 30,
}

/**
 * Calculate total price for an order.
 * @param {Object} options  - PrintOptions object
 * @param {number} totalPages
 * @param {Object} pricing  - VendorPricing object (optional, uses defaults)
 * @returns {number}
 */
function calculatePrice(options, totalPages, pricing = DEFAULT_PRICING) {
  let pricePerPage =
    options.colorMode === 'bw'
      ? options.sides === 'single' ? pricing.bwSingle : pricing.bwDouble
      : options.sides === 'single' ? pricing.colorSingle : pricing.colorDouble

  if (options.pageSize === 'A3')        pricePerPage *= 2
  if (options.paperQuality === 'premium') pricePerPage += pricing.premiumPaper

  let total = pricePerPage * totalPages * options.copies

  if (options.binding === 'spiral') total += pricing.spiralBind
  if (options.binding === 'hard')   total += pricing.hardBind
  if (options.binding === 'tape')   total += pricing.tapeBind

  return Math.round(total * 100) / 100
}

module.exports = { calculatePrice, DEFAULT_PRICING }
