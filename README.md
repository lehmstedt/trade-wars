# trade-wars

## What is this ?
This is a game about trade wars. The features intended to be implemented are :
- [x] Trading
- [ ] Tariffs
- [ ] Embargos
- [ ] Military wars
- [ ] Evolving resource production productivity
- [ ] Technological trees and dependencies

## Why this ?
This is a sandbox project demonstrating what can be done in TDD with a Clean and Hexagonal architecture, leveraging Domain Driven Design

## What is the current state ?

- [x] Dropdown for resource selection instead of free text
- [x] Prevent trades without needed quantities available
- [x] Resource price calculated from another resource quantity
- [x] Tariffs (crud)
- [x] Use responses instead of exceptions
- [ ] Move and adapt all uses cases in test dir
- [ ] Inside vs outside price with tariffs
- [ ] Trade at the price of outside price with tariff
- [ ] Reuse of tariff resources for country development (to be analyzed)
- [ ] Trade with more than one country
- [ ] Resource production with a fixed production rate by country
- [ ] Embargos
- [ ] Wars
- [ ] Refactor trade validator and trade validation into one trade entity
- [ ] Fully implement Hexagonal architecture by replacing the god mod Game object by driving ports

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
