import '@janhq/cortex-node/shims/web'
import { useCallback } from 'react'

import {
  Assistant,
  Model,
  Message,
  Thread,
  MessageCreateParams,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
} from '@janhq/core'

import { Cortex } from '@janhq/cortex-node'

import {
  AssistantCreateParams,
  AssistantUpdateParams,
} from '@janhq/cortex-node/dist/resources/beta/assistants'
import { useAtomValue } from 'jotai'

import { hostAtom } from '@/helpers/atoms/AppConfig.atom'

const useCortex = () => {
  const host = useAtomValue(hostAtom)

  const cortex = new Cortex({
    baseURL: host,
    apiKey: '',
    dangerouslyAllowBrowser: true,
  })

  const fetchAssistants = useCallback(async () => {
    const assistants: Assistant[] = []
    const response = await cortex.beta.assistants.list()
    response.data.forEach((assistant) => {
      assistants.push(assistant)
    })
    return assistants
  }, [cortex.beta.assistants])

  const fetchThreads = useCallback(async () => {
    const threads: Thread[] = []
    for await (const thread of cortex.beta.threads.list()) {
      // @ts-expect-error each thread must have associated assistants
      const assistants = thread['assistants'] as Assistant[]
      if (!assistants || assistants.length === 0) continue

      // @ts-expect-error each thread must have a title, else default to 'New Thread'
      const title: string = thread['title'] ?? 'New Thread'

      threads.push({
        ...thread,
        title: title,
        assistants: assistants,
      })
    }
    return threads
  }, [cortex.beta.threads])

  const fetchModels = useCallback(async () => {
    const models: Model[] = []
    for await (const model of cortex.models.list()) {
      models.push({
        ...model,
        model: model.id,
        // @ts-expect-error each model must have associated files
        files: model['files'],
      })
    }
    return models
  }, [cortex.models])

  const fetchMessages = useCallback(
    async (threadId: string) => {
      try {
        const messages: Message[] = []
        const response = await cortex.beta.threads.messages.list(threadId)
        response.data.forEach((message) => {
          messages.push(message)
        })
        return messages
      } catch (error) {
        return []
      }
    },
    [cortex.beta.threads.messages]
  )

  const startModel = useCallback(
    async (modelId: string, options?: Record<string, unknown>) => {
      await cortex.models.start(modelId, options ?? {})
    },
    [cortex.models]
  )

  const stopModel = useCallback(
    async (modelId: string, options?: Record<string, unknown>) => {
      await cortex.models.stop(modelId, options ?? {})
    },
    [cortex.models]
  )

  const chatCompletionNonStreaming = useCallback(
    async (
      chatCompletionCreateParams: ChatCompletionCreateParamsNonStreaming,
      options?: Record<string, unknown>
      // @ts-expect-error incompatible types
    ) => cortex.chat.completions.create(chatCompletionCreateParams, options),
    [cortex.chat.completions]
  )

  const chatCompletionStreaming = useCallback(
    async (
      chatCompletionCreateParams: ChatCompletionCreateParamsStreaming,
      options?: Record<string, unknown>
      // @ts-expect-error incompatible types
    ) => cortex.chat.completions.create(chatCompletionCreateParams, options),
    [cortex.chat.completions]
  )

  const deleteModel = useCallback(
    async (modelId: string) => {
      await cortex.models.del(modelId)
    },
    [cortex.models]
  )

  const cleanThread = useCallback(
    async (threadId: string) => cortex.beta.threads.clean(threadId),
    [cortex.beta.threads]
  )

  const deleteThread = useCallback(
    async (threadId: string) => {
      await cortex.beta.threads.del(threadId)
    },
    [cortex.beta.threads]
  )

  const updateThread = useCallback(
    async (thread: Thread) => {
      const result = await cortex.beta.threads.update(thread.id, thread)
      console.log(result)
    },
    [cortex.beta.threads]
  )

  const deleteMessage = useCallback(
    async (threadId: string, messageId: string) =>
      cortex.beta.threads.messages.del(threadId, messageId),
    [cortex.beta.threads]
  )

  const createMessage = useCallback(
    async (threadId: string, createMessageParams: MessageCreateParams) => {
      return cortex.beta.threads.messages.create(threadId, createMessageParams)
    },
    [cortex.beta.threads]
  )

  const updateMessage = useCallback(
    async (threadId: string, messageId: string, data: object) => {
      return cortex.beta.threads.messages.update(threadId, messageId, data)
    },
    [cortex.beta.threads]
  )

  const createThread = useCallback(
    async (assistant: Assistant) => {
      const createThreadResponse = await cortex.beta.threads.create({
        // @ts-expect-error customize so that each thread will have an assistant
        assistants: [assistant],
      })
      const thread: Thread = {
        ...createThreadResponse,
        // @ts-expect-error each thread will have a title, else default to 'New Thread'
        title: createThreadResponse.title ?? 'New Thread',
        assistants: [assistant],
      }
      return thread
    },
    [cortex.beta.threads]
  )

  const updateModel = useCallback(
    async (modelId: string, options: Record<string, unknown>) =>
      cortex.models.update(modelId, options),
    [cortex.models]
  )

  const downloadModel = useCallback(
    async (modelId: string) => cortex.models.download(modelId),
    [cortex.models]
  )

  const abortDownload = useCallback(
    async (downloadId: string) => cortex.models.abortDownload(downloadId),
    [cortex.models]
  )

  const createAssistant = useCallback(
    async (createParams: AssistantCreateParams) =>
      cortex.beta.assistants.create(createParams),
    [cortex.beta.assistants]
  )

  const updateAssistant = useCallback(
    async (assistantId: string, updateParams: AssistantUpdateParams) =>
      cortex.beta.assistants.update(assistantId, updateParams),
    [cortex.beta.assistants]
  )

  return {
    fetchAssistants,
    fetchThreads,
    fetchModels,
    fetchMessages,
    startModel,
    stopModel,
    chatCompletionStreaming,
    deleteModel,
    deleteThread,
    deleteMessage,
    cleanThread,
    updateThread,
    createMessage,
    updateMessage,
    createThread,
    downloadModel,
    abortDownload,
    createAssistant,
    updateAssistant,
    updateModel,
    chatCompletionNonStreaming,
  }
}

export default useCortex
