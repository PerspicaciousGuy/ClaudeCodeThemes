export type WeatherIntensity = number

declare module 'claude-code' {
  interface PluginState {
    'weather-mood': { working: Shaped<boolean>; intensity: Shaped<number>; flash: Shaped<boolean> }
  }
}
