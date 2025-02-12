import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
import { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'
import { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import type { Country } from '@/domain/entities/Country'
import type { Resource } from '@/domain/entities/Resource'
import { InMemoryCountryRepository } from '@/infrastructure/InMemoryCountryRepository'
import { InMemoryResourceRepository } from '@/infrastructure/InMemoryResourceRepository'

export class InMemoryConfigurator {
  countryRepository: InMemoryCountryRepository
  resourceRepository: InMemoryResourceRepository

  constructor() {
    this.countryRepository = new InMemoryCountryRepository()
    this.resourceRepository = new InMemoryResourceRepository()
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
}
