import { Resource } from '@/domain/Resource'
import { describe, expect, it } from 'vitest'

describe('Resource', () => {
  it('should start existing with a name and a quantity', () => {
    const name = 'a'
    const qty = 1
    const resource = new Resource(name, qty)

    expect(resource.name).toEqual(name)
    expect(resource.qty).toEqual(qty)
  })
})
