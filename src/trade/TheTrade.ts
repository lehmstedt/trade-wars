import { Country } from '@/country/Country'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import Trade from './TheTrade.vue'

describe('Trade', () => {
  it('should prevent from making a trade when there is not enought resource quantity available', () => {
    const playerCountry = new Country()
    playerCountry.setResource('a', 1)

    const otherCountry = new Country()
    playerCountry.setResource('b', 1)

    const resourceToAsk = 'b'
    const resourceToAskQty = 1
    const resourceToOffer = 'a'
    const resourceToOfferQty = 2

    const wrapper = shallowMount(Trade, {
      props: {
        playerCountry,
        otherCountry,
        resourceToAsk,
        resourceToAskQty,
        resourceToOffer,
        resourceToOfferQty
      }
    })

    expect(wrapper.vm.isCurrentTradeValid).toBe(false)
  })

  it('should enable trade when there is enough resource quantity available', () => {
    const playerCountry = new Country()
    playerCountry.setResource('a', 2)

    const otherCountry = new Country()
    otherCountry.setResource('b', 3)

    const resourceToAsk = 'b'
    const resourceToAskQty = 2
    const resourceToOffer = 'a'
    const resourceToOfferQty = 1

    const wrapper = shallowMount(Trade, {
      props: {
        playerCountry,
        otherCountry,
        resourceToAsk,
        resourceToAskQty,
        resourceToOffer,
        resourceToOfferQty
      }
    })

    expect(wrapper.vm.isCurrentTradeValid).toEqual(true)
    expect(wrapper.vm.playerCountry.getResourceQty('a')).toEqual(2)
    expect(wrapper.vm.otherCountry.getResourceQty('b')).toEqual(3)

    wrapper.vm.trade()

    expect(wrapper.vm.isCurrentTradeValid).toEqual(false)

    expect(wrapper.vm.playerCountry.getResourceQty('a')).toEqual(1)
    expect(wrapper.vm.otherCountry.getResourceQty('b')).toEqual(1)
  })
})
