import type { IPriceProvider } from '@/domain/IPriceProvider'

export class TestPriceProvider implements IPriceProvider {
  constructor(price: number) {
    this.price = price
  }

  price: number

  getPrice(): number {
    return this.price
  }
}
