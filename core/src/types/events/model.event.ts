export const ModelLoadingEvents = [
  'starting',
  'stopping',
  'started',
  'stopped',
  'starting-failed',
  'stopping-failed',
]
export type ModelLoadingEvent = (typeof ModelLoadingEvents)[number]

export interface ModelState {
  loadingEvent: ModelLoadingEvent
  modelId: string
}
