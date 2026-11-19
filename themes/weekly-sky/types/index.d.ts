export type SkyStage = number

declare module 'claude-code' {
  interface PluginState {
    'weekly-sky': { stage: Shaped<number> }
  }
}
