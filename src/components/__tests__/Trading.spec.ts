import { Country } from '@/domain/Country'
import { describe, expect, it } from 'vitest'

describe('Trading', () => {
  it('should exchange resources between countries', () => {
    const countryA = new Country()
    const countryB = new Country()

    const resourceA = 'a'
    const resourceAQty = 1
    countryA.setResource(resourceA, resourceAQty)

    const resourceB = 'b'
    const resourceBQty = 2
    countryB.setResource(resourceB, resourceBQty)

    countryA.tradeWith(countryB, resourceA, resourceAQty, resourceB, resourceBQty)

    expect(countryA.getResourceQty(resourceA)).toEqual(0)
    expect(countryA.getResourceQty(resourceB)).toEqual(resourceBQty)

    expect(countryB.getResourceQty(resourceA)).toEqual(resourceAQty)
    expect(countryB.getResourceQty(resourceB)).toEqual(0)
  })
})
