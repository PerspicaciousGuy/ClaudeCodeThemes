export type SkySlot = number

declare module 'claude-code' {
  interface PluginState {
    'real-sky': { slot: Shaped<number>; phase: Shaped<number> }
  }
}
