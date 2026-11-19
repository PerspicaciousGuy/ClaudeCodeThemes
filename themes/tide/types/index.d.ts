export type TideLevel = number

declare module 'claude-code' {
  interface PluginState {
    tide: { level: Shaped<number> }
  }
}
