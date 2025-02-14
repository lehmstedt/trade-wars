import { CountryPairPriceProvider } from '@/domain/CountryPairPriceProvider'
import { ForListingCountries } from '@/domain/drivingPorts/ForListingCountries'
import { ForListingResourcePrices } from '@/domain/drivingPorts/ForListingResourcePrices'
import { ForListingResources } from '@/domain/drivingPorts/ForListingResources'
import { ForMakingTrade } from '@/domain/drivingPorts/ForMakingTrade'
import { ForValidatingTrade } from '@/domain/drivingPorts/ForValidatingTrade'
import { Country } from '@/domain/entities/Country'
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
    const playerCountry = new Country('Player')
    playerCountry.setResource(iron, 12)
    playerCountry.setResource(charcoal, 240)
    const anotherCountry = new Country('Great-Britain')
    anotherCountry.setResource(iron, 30)
    anotherCountry.setResource(whool, 10)

    this.countryRepository = new InMemoryCountryRepository([playerCountry, anotherCountry])
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

  buildForListingCountries(): ForListingCountries {
    return new ForListingCountries(this.countryRepository)
  }
}
