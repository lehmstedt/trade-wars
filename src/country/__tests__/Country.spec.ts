import { Country } from '@/country/Country'
import { describe, expect, it } from 'vitest'

describe('Country', () => {
  it('should be assigned resource with a quantity, and return that quantity from resource', () => {
    const country = new Country()

    const resourceName = 'a'
    const resourceQty = 1
    country.setResource(resourceName, resourceQty)

    expect(country.getResourceQty(resourceName)).toEqual(resourceQty)
  })

  it('should receive additional quantity of a resource when it already has', () => {
    const country = new Country()

    const resourceName = 'a'
    const intialQty = 1
    const qtyToReceive = 2
    country.setResource(resourceName, intialQty)
    country.receiveResource(resourceName, qtyToReceive)

    expect(country.getResourceQty(resourceName)).toEqual(intialQty + qtyToReceive)
  })

  it('should be assigned various resources and return the resource qty from resource name', () => {
    const country = new Country()

    const resourceAName = 'a'
    const resourceAQty = 1
    const resourceBName = 'b'
    const resourceBQty = 2

    country.setResource(resourceAName, resourceAQty)
    country.setResource(resourceBName, resourceBQty)

    expect(country.getResourceQty(resourceAName)).toEqual(resourceAQty)
    expect(country.getResourceQty(resourceBName)).toEqual(resourceBQty)
  })

  it('should return 0 when asked the resource quantity, and has never been assigned or received that resource', () => {
    const country = new Country()

    const resource = 'a'
    expect(country.getResourceQty(resource)).toEqual(0)
  })

  it('should receive quantities of different resources various times and return the resource quantity for each', () => {
    const country = new Country()

    const resourceA = 'a'
    const resourceAQty = 1
    const resourceB = 'b'
    const firstResourceBReceivingQty = 2
    const secondResourceBReceivingQty = 3

    country.receiveResource(resourceA, resourceAQty)
    country.receiveResource(resourceB, firstResourceBReceivingQty)
    country.receiveResource(resourceB, secondResourceBReceivingQty)

    expect(country.getResourceQty(resourceA)).toEqual(resourceAQty)
    expect(country.getResourceQty(resourceB)).toEqual(
      firstResourceBReceivingQty + secondResourceBReceivingQty
    )
  })
})
