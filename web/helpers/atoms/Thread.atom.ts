import { ModelRuntimeParams, ModelSettingParams, Thread } from '@janhq/core'

import { atom } from 'jotai'

import { configuredModelsAtom, selectedModelAtom } from './Model.atom'

/**
 * Stores the current active thread id.
 */
const activeThreadIdAtom = atom<string | undefined>(undefined)

export const getActiveThreadIdAtom = atom((get) => get(activeThreadIdAtom))

export const setActiveThreadIdAtom = atom(
  null,
  (get, set, threadId: string | undefined) => {
    const thread = get(threadsAtom).find((t) => t.id === threadId)
    if (!thread) return

    set(activeThreadIdAtom, threadId)
    const modelId = thread.assistants[0]?.model
    if (!modelId) return

    const model = get(configuredModelsAtom).find((m) => m.id === modelId)
    if (!model) return
    console.debug('Set selected model:', model)
    set(selectedModelAtom, model)
  }
)

export const waitingToSendMessage = atom<boolean | undefined>(undefined)

export const isGeneratingResponseAtom = atom<boolean | undefined>(undefined)

/**
 * Stores all threads for the current user
 */
export const threadsAtom = atom<Thread[]>([])

export const deleteThreadAtom = atom(null, (_get, set, threadId: string) => {
  set(threadsAtom, (threads) => threads.filter((c) => c.id !== threadId))
})

export const activeThreadAtom = atom<Thread | undefined>((get) =>
  get(threadsAtom).find((c) => c.id === get(getActiveThreadIdAtom))
)

/**
 * Store model params at thread level settings
 */
export const threadModelParamsAtom = atom<Record<string, ModelParams>>({})

export type ModelParams = ModelRuntimeParams | ModelSettingParams

export const setThreadModelParamsAtom = atom(
  null,
  (get, set, threadId: string, params: ModelParams) => {
    const currentState = { ...get(threadModelParamsAtom) }
    currentState[threadId] = params
    set(threadModelParamsAtom, currentState)
  }
)
