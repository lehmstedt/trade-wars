# trade-wars

- [ ] Refactor all use cases inside Game
- [ ] Dropdown for resource selection instead of free text
- [ ] Move and adapt all uses cases in test dir
- [ ] Inside vs outside price with tariffs
- [ ] Trade at the price of outside price with tariff
- [ ] Reuse of tariff resources for country development (to be analyzed)
- [x] Prevent trades without needed quantities available
- [ ] Trade with more than one country
- [x] Resource price calculated from another resource quantity
- [ ] Resource production with a fixed production rate by country
- [x] Tariffs (crud)
- [ ] Embargos
- [ ] Wars

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
