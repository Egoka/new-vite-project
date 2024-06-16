import { inject, reactive } from "vue"
import { ObjectPlugin } from "vue"
export const defaultOptions = {}
const PrimeVueSymbol = Symbol()
export function usePrimeVue() {
  const PrimeVue = inject(PrimeVueSymbol)

  if (!PrimeVue) {
    throw new Error("PrimeVue is not installed!")
  }

  return PrimeVue
}
export default {
  install: (app, options) => {
    const configOptions = options ? { ...defaultOptions, ...options } : { ...defaultOptions }
    const PrimeVue = {
      config: reactive(configOptions)
    }

    app.config.globalProperties.$primevue = PrimeVue
    app.provide(PrimeVueSymbol, PrimeVue)
  }
} as ObjectPlugin
