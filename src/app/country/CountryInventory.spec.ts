import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Country } from '@/domain/entities/Country'
import ThePlayerCountry from '@/app/country/CountryInventory.vue'

describe('CountryInventory', () => {
  it('should display its current resource inventories', () => {
    const country = new Country()
    const resourceA = 'a'
    const resAQty = 1
    const resourceB = 'b'
    const resBQty = 2

    country.setResource(resourceA, resAQty)
    country.setResource(resourceB, resBQty)

    const wrapper = mount(ThePlayerCountry, {
      props: {
        country
      }
    })

    expect(wrapper.vm.inventories).toContainEqual({ name: resourceA, qty: resAQty })
    expect(wrapper.vm.inventories).toContainEqual({ name: resourceB, qty: resBQty })
  })
})
