import { Country } from '@/domain/Country'
import { Resource } from '@/domain/Resource'
import { describe, expect, it } from 'vitest'

describe('Trading', () => {
  it('should exchange resources between countries', () => {
    const countryA = new Country()
    const countryB = new Country()

    const resourceA = new Resource('a', 1)
    countryA.setResource(resourceA)

    const resourceB = new Resource('b', 2)
    countryB.setResource(resourceB)

    countryA.tradeWith(countryB, resourceA.name, resourceA.qty, resourceB.name, resourceB.qty)

    expect(countryA.getResourceQty(resourceA.name)).toEqual(0)
    expect(countryA.getResourceQty(resourceB.name)).toEqual(resourceB.qty)

    expect(countryB.getResourceQty(resourceA.name)).toEqual(resourceA.qty)
    expect(countryB.getResourceQty(resourceB.name)).toEqual(0)
  })
})
