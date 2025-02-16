import { CountryNotFoundError, ResourceNotFoundError } from '@/domain/Errors'
import type { ICountryPort } from '@/domain/drivenPorts/ICountryPort'
import type { CountryId } from '@/domain/entities/Country'
import type { IResourcePort } from '@/domain/drivenPorts/IResourcePort'

export class ForSettingTariff {
  forSettingTariffOnCountry: ICountryPort
  forCheckingIfTariffResourceIsExisting: IResourcePort
  constructor(
    forSettingTariffOnCountry: ICountryPort,
    forCheckingIfTariffResourceIsExisting: IResourcePort
  ) {
    this.forSettingTariffOnCountry = forSettingTariffOnCountry
    this.forCheckingIfTariffResourceIsExisting = forCheckingIfTariffResourceIsExisting
  }

  async execute(countryId: CountryId, rate: number, resourceName: string) {
    const country = await this.forSettingTariffOnCountry.getById(countryId)

    if (!country) {
      throw new CountryNotFoundError()
    }

    const resource = await this.forCheckingIfTariffResourceIsExisting.getByName(resourceName)
    if (!resource) {
      throw new ResourceNotFoundError()
    }

    country.setTariff(rate, resource)

    await this.forSettingTariffOnCountry.save(country)
  }
}
