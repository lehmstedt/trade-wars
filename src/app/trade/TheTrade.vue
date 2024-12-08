<script setup lang="ts">
import { Country } from '@/domain/entities/Country'
import { computed, ref } from 'vue'
import { Resource } from '@/domain/entities/Resource';

interface Props {
  playerCountry: Country
  otherCountry: Country
  resources: Resource[]
}

const props = defineProps<Props>()

const emit = defineEmits(['tradeMade'])

const playerCountry = ref(props.playerCountry)
const otherCountry = ref(props.otherCountry)
const componentKey = ref(0)
const resourceToAsk = ref('')
const resourceToAskQty = ref(1)
const resourceToOffer = ref('')
const resourceToOfferQty = ref(1)

const isCurrentTradeValid = computed(
  () =>
    playerCountry.value.canTrade(resourceToOffer.value, resourceToOfferQty.value) &&
    otherCountry.value.canTrade(resourceToAsk.value, resourceToAskQty.value)
)

function trade() {
  props.playerCountry.tradeWith(
    props.otherCountry,
    resourceToOffer.value,
    resourceToOfferQty.value,
    resourceToAsk.value,
    resourceToAskQty.value
  )
  componentKey.value++
  emit('tradeMade')

}

</script>
<template>

  <div class="row">
    <div class="column">
      <h1>Trade</h1>
      <h2>Resource to ask</h2>
      <select v-model="resourceToAsk">
        <option v-for="resource in resources" :key="resource.name">{{ resource.name }}</option>
      </select>
      <input v-model="resourceToAskQty" placeholder="Qty" type="number" />

      <h2>Resource to offer</h2>
      <select v-model="resourceToOffer">
        <option v-for="resource in resources" :key="resource.name">{{ resource.name }}</option>
      </select>
      <input v-model="resourceToOfferQty" placeholder="Qty" type="number" />
      <button :disabled="!isCurrentTradeValid" @click="trade">Trade</button>
    </div>
  </div>






</template>
