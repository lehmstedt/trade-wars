import { Country } from '@/domain/Country'
import { Resource } from '@/domain/Resource'
import { describe, expect, it } from 'vitest'

describe('Country', () => {
  it('should be assigned resource with a quantity, and return that quantity from resource', () => {
    const country = new Country()

    const resource = new Resource('a', 1)
    country.setResource(resource)

    expect(country.getResourceQty(resource.name)).toEqual(resource.qty)
  })

  it('should get additional quantity of a resource when it already has', () => {
    const country = new Country()

    const initialResource = new Resource('a', 1)
    country.setResource(initialResource)
    const resourceToReceive = new Resource(initialResource.name, 2)
    const expectedFinalQty = initialResource.qty + resourceToReceive.qty
    country.receiveResource(resourceToReceive)

    expect(country.getResourceQty(initialResource.name)).toEqual(expectedFinalQty)
  })
})
