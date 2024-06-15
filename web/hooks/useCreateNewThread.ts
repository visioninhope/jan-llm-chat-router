import { Thread, Model } from '@janhq/core'
import { atom, useSetAtom } from 'jotai'

import useCortex from './useCortex'

import {
  threadsAtom,
  isGeneratingResponseAtom,
} from '@/helpers/atoms/Thread.atom'

const createNewThreadAtom = atom(null, (get, set, newThread: Thread) => {
  // add the new thread on top of the thread list to the state
  const threads = get(threadsAtom)
  set(threadsAtom, [newThread, ...threads])
})

export const useCreateNewThread = () => {
  const createNewThread = useSetAtom(createNewThreadAtom)
  const setIsGeneratingResponse = useSetAtom(isGeneratingResponseAtom)
  const { createThread } = useCortex()

  const requestCreateNewThread = async (model: Model) => {
    // Stop generating if any
    setIsGeneratingResponse(false)
    // stopInference()

    // const defaultModel = model ?? recommendedModel ?? downloadedModels[0]
    // console.log(defaultModel)
    // modify assistant tools when experimental on, retieval toggle enabled in default
    // const assistantTools: AssistantTool = {
    //   type: 'retrieval',
    //   enabled: true,
    //   settings: {}, // TODO: NamH assistant.tools && assistant.tools[0].settings,
    // }

    // const overriddenSettings =
    //   defaultModel?.settings?.ctx_len && defaultModel.settings.ctx_len > 2048
    //     ? { ctx_len: 2048 }
    //     : {}

    // const overriddenParameters =
    //   defaultModel?.parameters?.max_tokens && defaultModel.parameters.max_tokens
    //     ? { max_tokens: 2048 }
    //     : {}

    // const createdAt = Date.now()
    // const assistantInfo: ThreadAssistantInfo = {
    //   assistant_id: assistant.id,
    //   assistant_name: assistant.name,
    //   tools: experimentalEnabled ? [assistantTools] : assistant.tools,
    //   model: {
    //     id: defaultModel?.id ?? '*',
    //     // settings: { ...defaultModel?.settings, ...overriddenSettings } ?? {},
    //     // parameters:
    //     //   { ...defaultModel?.parameters, ...overriddenParameters } ?? {},
    //     engine: defaultModel?.engine,
    //   },
    //   instructions: assistant.instructions,
    // }

    const createdThread = await createThread()
    // const thread: Thread = {
    //   id: createdThread.id,
    //   object: 'thread',
    //   // title: 'New Thread',
    //   assistants: [assistantInfo],
    //   created_at: createdAt,
    //   metadata: null,
    //   tool_resources: null,
    // }

    // add the new thread on top of the thread list to the state
    createNewThread(createdThread)

    // setSelectedModel(defaultModel)
    // setThreadModelParams(thread.id, {
    //   ...defaultModel?.settings,
    //   ...defaultModel?.parameters,
    //   ...overriddenSettings,
    // })

    // Delete the file upload state
    // setFileUpload([])
    // Update thread metadata
    // await updateThreadMetadata(thread)

    // setActiveThread(thread)
  }

  return {
    requestCreateNewThread,
  }
}
