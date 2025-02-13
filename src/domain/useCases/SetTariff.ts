import { CountryNotFoundError, ResourceNotFoundError } from '@/domain/Errors'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId } from '@/domain/entities/Country'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'

export class SetTariff {
  countryRepo: ICountryPort
  resourceRepo: IResourcePort
  constructor(countryRepo: ICountryPort, resourceRepo: IResourcePort) {
    this.countryRepo = countryRepo
    this.resourceRepo = resourceRepo
  }

  async execute(countryId: CountryId, rate: number, resourceName: string) {
    const country = await this.countryRepo.getById(countryId)

    if (!country) {
      throw new CountryNotFoundError()
    }

    const resource = await this.resourceRepo.getByName(resourceName)
    if (!resource) {
      throw new ResourceNotFoundError()
    }

    country.setTariff(rate, resource)

    await this.countryRepo.save(country)
  }
}
