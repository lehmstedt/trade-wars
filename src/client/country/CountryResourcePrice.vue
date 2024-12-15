<script setup lang="ts">
import { CountryId } from '@/domain/entities/Country';
import type { Resource } from '@/domain/entities/Resource';

interface Props {
    resources: Resource[],
    countryId: CountryId,
    prices: Map<string, Map<string, number>>
}
defineProps<Props>()

</script>
<template>
    <table>
        <tbody>
            <tr>
                <th></th>
                <th v-for="expressedResource in resources" :key="expressedResource.name">{{ expressedResource.name }}
                </th>
            </tr>
            <tr v-for="resource in resources" :key="resource.name">
                <td>{{ resource.name }}</td>
                <td v-for="expressedResource in resources" :key="expressedResource.name">{{
                    prices.get(expressedResource.name)?.get(resource.name)?.toFixed(2) }}</td>
            </tr>
        </tbody>

    </table>
</template>

<style scoped>
table,
th,
td {
    border: 1px solid;
}
</style>