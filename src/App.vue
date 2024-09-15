<script setup lang="ts">
import { Country } from './country/Country'
import Trade from './trade/TheTrade.vue'

const playerCountry = new Country()

playerCountry.setResource('Iron', 12)
playerCountry.setResource('Charcoal', 240)

const anotherCountry = new Country()
anotherCountry.setResource('Iron', 30)
anotherCountry.setResource('Whool', 10)
</script>

<template>
  <Trade :player-country="playerCountry" :other-country="anotherCountry"></Trade>
</template>
