import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it } from 'vitest'

const testConfigurator = new TestConfigurator()

describe('Resources', () => {
  it('should list no resource when no resource is existing', async () => {
    const forListingResources = testConfigurator.buildForListingResources([])

    const resourceList = await forListingResources.execute()

    expect(resourceList.length).toEqual(0)
  })

  it('should list one resource when one resource is existing', async () => {
    const forListingResources = testConfigurator.buildForListingResources([
      new Resource('Pinapple')
    ])

    const resourceList = await forListingResources.execute()

    expect(resourceList.length).toEqual(1)
    expect(resourceList[0].name).toEqual('Pinapple')
  })

  it('should list multiple resource when multiple resource are existing, in no specific order', async () => {
    const forListingResources = testConfigurator.buildForListingResources([
      new Resource('Pinapple'),
      new Resource('Banana'),
      new Resource('Pear')
    ])

    const resourceList = await forListingResources.execute()

    expect(resourceList.length).toEqual(3)
    expect(resourceList.find((resource) => resource.name === 'Pinapple')).toBeTruthy()
    expect(resourceList.find((resource) => resource.name === 'Banana')).toBeTruthy()
    expect(resourceList.find((resource) => resource.name === 'Pear')).toBeTruthy()
  })
})
