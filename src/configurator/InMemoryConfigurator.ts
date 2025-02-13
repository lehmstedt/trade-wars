import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
import { ForListingResourcePrices } from '@/domain/drivingPorts/ForListingResourcePrices'
import { ForListingResources } from '@/domain/drivingPorts/ForListingResources'
import { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'
import { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import type { Country } from '@/domain/entities/Country'
import { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'

export class InMemoryConfigurator {
  countryRepository: InMemoryCountryRepository
  resourceRepository: InMemoryResourceRepository

  constructor() {
    const iron = new Resource('Iron')
    const charcoal = new Resource('Charcoal')
    const whool = new Resource('Whool')
    this.countryRepository = new InMemoryCountryRepository()
    this.resourceRepository = new InMemoryResourceRepository([iron, charcoal, whool])
  }

  buildForValidatingTrade(countries: Country[], resources: Resource[]): ForValidatingTrade {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForValidatingTrade(
      this.countryRepository,
      this.resourceRepository,
      new CountryPairPriceProvider()
    )
  }

  buildForMakingTrade(countries: Country[], resources: Resource[]): ForMakingTrade {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForMakingTrade(
      this.countryRepository,
      this.resourceRepository,
      new CountryPairPriceProvider()
    )
  }

  buildForListingResourcePrices(
    countries: Country[],
    resources: Resource[]
  ): ForListingResourcePrices {
    this.countryRepository.set(countries)
    this.resourceRepository.set(resources)
    return new ForListingResourcePrices(this.countryRepository, this.resourceRepository)
  }

  buildForListingResources(): ForListingResources {
    return new ForListingResources(this.resourceRepository)
  }
}
