import { CountryNotFoundError } from '@/domain/Errors'
import type { CountryId } from '@/domain/entities/Country'
import { Tariff } from '@/domain/entities/Tariff'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'

export class ForListingTariffs {
  forListingCountryTariffs: ICountryPort
  forListingExistingResources: IResourcePort

  constructor(forListingCountryTariffs: ICountryPort, forListingExistingResources: IResourcePort) {
    this.forListingCountryTariffs = forListingCountryTariffs
    this.forListingExistingResources = forListingExistingResources
  }

  async execute(id: CountryId): Promise<Tariff[]> {
    const country = await this.forListingCountryTariffs.getById(id)

    if (!country) {
      throw new CountryNotFoundError()
    }

    const resources = await this.forListingExistingResources.list()

    return resources.map(
      (resource) => new Tariff(resource.name, country.getTariffOnResource(resource))
    )
  }
}
