export interface PrimeVueConfiguration {

}
export declare function usePrimeVue(): {
  config: PrimeVueConfiguration;
};

declare const plugin: Plugin;
export default plugin;

declare module 'vue/types/vue' {
  interface Vue {
    $primevue: {
      config: PrimeVueConfiguration;
    };
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $primevue: {
      config: PrimeVueConfiguration;
    };
  }
}
