<script setup lang="ts">
import { Country } from '@/domain/entities/Country'
import CountryInventory from '@/app/country/CountryInventory.vue'
import { computed, ref } from 'vue'

const props = defineProps({
  playerCountry: {
    default: new Country(),
    type: Country
  },
  otherCountry: {
    default: new Country(),
    type: Country
  },
  resourceToAsk: {
    default: '',
    type: String
  },
  resourceToAskQty: {
    default: 0,
    type: Number
  },
  resourceToOffer: {
    default: '',
    type: String
  },
  resourceToOfferQty: {
    default: 0,
    type: Number
  }
})

const emit = defineEmits(['tradeMade'])

const playerCountry = ref<Country>(props.playerCountry)
const componentKey = ref(0)
const otherCountry = ref<Country>(props.otherCountry)
const resourceToAsk = ref(props.resourceToAsk)
const resourceToAskQty = ref(props.resourceToAskQty)
const resourceToOffer = ref(props.resourceToOffer)
const resourceToOfferQty = ref(props.resourceToOfferQty)

const isCurrentTradeValid = computed(
  () =>
    playerCountry.value.canTrade(resourceToOffer.value, resourceToOfferQty.value) &&
    otherCountry.value.canTrade(resourceToAsk.value, resourceToAskQty.value)
)

function trade() {
  playerCountry.value.tradeWith(
    otherCountry.value,
    resourceToOffer.value,
    resourceToOfferQty.value,
    resourceToAsk.value,
    resourceToAskQty.value
  )
  componentKey.value++
  emit('tradeMade')

}

defineExpose({ isCurrentTradeValid, trade, playerCountry, otherCountry })
</script>
<template>
  <CountryInventory
    :country="playerCountry"
    name="The player country"
    :key="componentKey"
  ></CountryInventory>
  <CountryInventory
    :country="otherCountry"
    name="Great-Britain"
    :key="componentKey"
  ></CountryInventory>

  <h2>Resource to ask</h2>
  <input v-model="resourceToAsk" placeholder="Name" />
  <input v-model="resourceToAskQty" placeholder="Qty" type="number" />

  <h2>Resource to offer</h2>
  <input v-model="resourceToOffer" placeholder="Name" />
  <input v-model="resourceToOfferQty" placeholder="Qty" type="number" />
  <button :disabled="!isCurrentTradeValid" @click="trade">Trade</button>
</template>
