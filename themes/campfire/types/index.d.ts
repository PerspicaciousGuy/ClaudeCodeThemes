export type FireLevel = number

declare module 'claude-code' {
  interface PluginState {
    campfire: { level: Shaped<number>; busy: Shaped<boolean>; wood: Shaped<number> }
  }
}
