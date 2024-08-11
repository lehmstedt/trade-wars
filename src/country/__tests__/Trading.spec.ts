import { Country } from '@/country/Country'
import { describe, expect, it, test } from 'vitest'

describe('Trading', () => {
  test('a country should send a resource to another country when it has enough qty in stock', () => {
    const countryA = new Country()
    const countryB = new Country()
    const resource = 'r'

    const countryAQty = 2
    countryA.setResource(resource, countryAQty)

    const countryBQty = 3
    countryB.setResource(resource, countryBQty)

    const qtyToSend = 1
    countryA.sendResource(countryB, resource, qtyToSend)

    expect(countryA.getResourceQty(resource)).toEqual(countryAQty - qtyToSend)
    expect(countryB.getResourceQty(resource)).toEqual(countryBQty + qtyToSend)
  })
  it('should exchange resources when receiving and offering quantities are available', () => {
    const countryA = new Country()
    const countryB = new Country()

    const resourceA = 'a'
    const resourceB = 'b'

    countryA.setResource(resourceA, 10)
    countryB.setResource(resourceB, 1)
    const countryAResourceAQty = countryA.getResourceQty(resourceA)
    const countryAResourceBQty = countryA.getResourceQty(resourceB)

    countryB.setResource(resourceB, 9)
    countryB.setResource(resourceA, 2)
    const countryBResourceAQty = countryB.getResourceQty(resourceA)
    const countryBResourceBQty = countryB.getResourceQty(resourceB)

    const resourceAToOfferQty = 1
    const resourceBToReceiveQty = 2
    countryA.tradeWith(countryB, resourceA, resourceAToOfferQty, resourceB, resourceBToReceiveQty)

    expect(countryA.getResourceQty(resourceA)).toEqual(countryAResourceAQty - resourceAToOfferQty)
    expect(countryA.getResourceQty(resourceB)).toEqual(countryAResourceBQty + resourceBToReceiveQty)

    expect(countryB.getResourceQty(resourceA)).toEqual(countryBResourceAQty + resourceAToOfferQty)
    expect(countryB.getResourceQty(resourceB)).toEqual(countryBResourceBQty - resourceBToReceiveQty)
  })
})
