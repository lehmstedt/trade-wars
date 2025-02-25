import { TestConfigurator } from '@/configurator/TestConfigurator'
import { Country } from '@/domain/entities/Country'
import { CountryBuilder } from '@/domain/entities/CountryBuilder'
import { Resource } from '@/domain/entities/Resource'
import { describe, expect, it } from 'vitest'

describe('For listing country goals', () => {
  it('should return no goal when country has not', async () => {
    const countryWithoutGoals = new Country('')

    const forListingCountryGoals = new TestConfigurator({
      countries: [countryWithoutGoals]
    }).buildForListingCountryGoals()

    const goals = await forListingCountryGoals.execute(countryWithoutGoals.id)

    expect(goals.length).toBe(0)
  })

  it('should return one goal when country has one', async () => {
    const apple = new Resource('Apple')
    const countryWithGoal = new CountryBuilder().withGoal(apple, 10).build()

    const forListingCountryGoals = new TestConfigurator({
      countries: [countryWithGoal]
    }).buildForListingCountryGoals()

    const goals = await forListingCountryGoals.execute(countryWithGoal.id)

    expect(goals.length).toBe(1)
    expect(goals[0].resource.name).toEqual(apple.name)
    expect(goals[0].quantity).toEqual(10)
  })

  it('should return various goal when country has various ones', async () => {
    const apple = new Resource('Apple')
    const banana = new Resource('Banana')
    const tomato = new Resource('Tomato')
    const countryWithGoal = new CountryBuilder()
      .withGoal(apple, 10)
      .withGoal(banana, 2)
      .withGoal(tomato, 15)
      .build()

    const forListingCountryGoals = new TestConfigurator({
      countries: [countryWithGoal]
    }).buildForListingCountryGoals()

    const goals = await forListingCountryGoals.execute(countryWithGoal.id)

    expect(goals.length).toBe(3)
    expect(goals.find((goal) => goal.resource.name === apple.name)?.quantity).toEqual(10)
    expect(goals.find((goal) => goal.resource.name === banana.name)?.quantity).toEqual(2)
    expect(goals.find((goal) => goal.resource.name === tomato.name)?.quantity).toEqual(15)
  })
})
