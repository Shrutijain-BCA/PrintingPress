// src/utils/pricing.ts
import type { PrintOptions, VendorPricing } from '../types'

export const DEFAULT_PRICING: VendorPricing = {
  bwSingle: 0.5,
  bwDouble: 0.8,
  colorSingle: 5,
  colorDouble: 8,
  spiralBind: 30,
  hardBind: 150,
  tapeBind: 20,
  premiumPaper: 0.2,
  deliveryFee: 30,
}

export function calculatePrice(
  options: PrintOptions,
  totalPages: number,
  pricing: VendorPricing = DEFAULT_PRICING
): number {
  let pricePerPage =
    options.colorMode === 'bw'
      ? options.sides === 'single' ? pricing.bwSingle : pricing.bwDouble
      : options.sides === 'single' ? pricing.colorSingle : pricing.colorDouble

  if (options.pageSize === 'A3') pricePerPage *= 2
  if (options.paperQuality === 'premium') pricePerPage += pricing.premiumPaper

  let total = pricePerPage * totalPages * options.copies
  if (options.binding === 'spiral') total += pricing.spiralBind
  if (options.binding === 'hard')   total += pricing.hardBind
  if (options.binding === 'tape')   total += pricing.tapeBind

  return Math.round(total * 100) / 100
}

export function formatINR(amount: number): string {
  return `₹${amount.toFixed(2)}`
}
