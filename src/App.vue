<script setup lang="ts">
import { Country } from './country/Country'
import ThePlayerCountry from './country/ThePlayerCountry.vue'

const country = new Country()

country.setResource('Iron', 12)
country.setResource('Charcoal', 240)
</script>

<template>
  <ThePlayerCountry :country="country"></ThePlayerCountry>
</template>
