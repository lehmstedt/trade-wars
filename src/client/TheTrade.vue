<script setup lang="ts">
import { Country } from '@/domain/entities/Country'
import { computed, ref, watch, type Ref } from 'vue'
import { Resource } from '@/domain/entities/Resource'
import { TradeRequest } from '@/domain/entities/TradeRequest'
import { TradeValidation, TradeValidationStatus } from '@/domain/entities/TradeValidation'
import type { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import type { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'

interface Props {
  playerCountry: Country
  otherCountry: Country
  resources: Resource[]
  forValidatingTrade: ForValidatingTrade
  forMakingTrade: ForMakingTrade
}

const props = defineProps<Props>()

const emit = defineEmits(['tradeMade'])

const soldResource = ref(props.resources[0])
const soldQuantity = ref(1)
const currency = ref(props.resources[0])
const validation: Ref<TradeValidation | null> = ref(null)

const tradeRequest = computed(
  () =>
    new TradeRequest(
      props.playerCountry,
      props.otherCountry,
      soldResource.value,
      soldQuantity.value,
      currency.value
    )
)

watch(tradeRequest, async (newRequest) => {
  validation.value = await props.forValidatingTrade.execute(newRequest)
})

async function trade() {
  await props.forMakingTrade.execute(tradeRequest.value)
  emit('tradeMade')
}
</script>
<template>
  <div class="row">
    <div class="column">
      <h1>Trade</h1>
      <h2>Resource to ask</h2>
      <select v-model="soldResource">
        <option v-for="resource in resources" :key="resource.name" :value="resource">
          {{ resource.name }}
        </option>
      </select>
      <input v-model="soldQuantity" placeholder="Qty" type="number" />

      <h2>Resource to offer</h2>
      <select v-model="currency">
        <option v-for="resource in resources" :key="resource.name" :value="resource">
          {{ resource.name }}
        </option>
      </select>
      <p>Price in {{ currency.name }} : {{ validation?.price?.toFixed(2) }}</p>
      <button :disabled="!validation?.isValid" @click="trade">Trade</button>
      <p v-if="validation?.status">{{ TradeValidationStatus[validation.status] }}</p>
    </div>
  </div>
</template>
