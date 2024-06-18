import { useEffect, useRef } from 'react'

import { Thread, Model, MessageContent, Message } from '@janhq/core'

import { atom, useAtomValue, useSetAtom } from 'jotai'

import { currentPromptAtom, editPromptAtom } from '@/containers/Providers/Jotai'

// import { ThreadMessageBuilder } from '@/utils/threadMessageBuilder'

import { loadModelErrorAtom, useActiveModel } from './useActiveModel'

import useCortex from './useCortex'

import {
  addNewMessageAtom,
  deleteMessageAtom,
  updateMessageAtom,
  getCurrentChatMessagesAtom,
  queuedMessageAtom,
} from '@/helpers/atoms/ChatMessage.atom'
import { selectedModelAtom } from '@/helpers/atoms/Model.atom'
import {
  activeThreadAtom,
  isGeneratingResponseAtom,
} from '@/helpers/atoms/Thread.atom'

export default function useSendChatMessage() {
  const activeThread = useAtomValue(activeThreadAtom)
  const addNewMessage = useSetAtom(addNewMessageAtom)
  const setCurrentPrompt = useSetAtom(currentPromptAtom)
  const deleteMessage = useSetAtom(deleteMessageAtom)
  const setEditPrompt = useSetAtom(editPromptAtom)
  // const updateThreadWaiting = useSetAtom(updateThreadWaitingForResponseAtom)
  const updateMessageState = useSetAtom(updateMessageAtom)
  const currentMessages = useAtomValue(getCurrentChatMessagesAtom)
  const selectedModel = useAtomValue(selectedModelAtom)
  const { activeModel, startModel } = useActiveModel()
  const loadModelFailed = useAtomValue(loadModelErrorAtom)

  const modelRef = useRef<Model | undefined>()
  const loadModelFailedRef = useRef<string | undefined>()

  // const [fileUpload, setFileUpload] = useAtom(fileUploadAtom)
  const setIsGeneratingResponse = useSetAtom(isGeneratingResponseAtom)
  const activeThreadRef = useRef<Thread | undefined>()
  const setQueuedMessage = useSetAtom(queuedMessageAtom)

  const selectedModelRef = useRef<Model | undefined>()
  const { createMessage, streamChatMessages, updateMessage } = useCortex()

  useEffect(() => {
    modelRef.current = activeModel
  }, [activeModel])

  useEffect(() => {
    loadModelFailedRef.current = loadModelFailed
  }, [loadModelFailed])

  useEffect(() => {
    activeThreadRef.current = activeThread
  }, [activeThread])

  useEffect(() => {
    selectedModelRef.current = selectedModel
  }, [selectedModel])

  // const resendChatMessage = async (currentMessage: ThreadMessage) => {
  //   if (!activeThreadRef.current) {
  //     console.error('No active thread')
  //     return
  //   }

  //   const requestBuilder = new MessageRequestBuilder(
  //     MessageRequestType.Thread,
  //     activeThreadRef.current.assistants[0].model ?? selectedModelRef.current,
  //     activeThreadRef.current,
  //     currentMessages
  //   ).removeLastAssistantMessage()

  //   const modelId =
  //     selectedModelRef.current?.id ??
  //     activeThreadRef.current.assistants[0].model.id

  //   if (modelRef.current?.id !== modelId) {
  //     const error = await startModel(modelId).catch((error: Error) => error)
  //     if (error) {
  //       // updateThreadWaiting(activeThreadRef.current.id, false)
  //       return
  //     }
  //   }

  //   setIsGeneratingResponse(true)

  //   if (currentMessage.role !== 'user') {
  //     // Delete last response before regenerating
  //     deleteMessage(currentMessage.id ?? '')
  //     if (activeThreadRef.current) {
  //       // await extensionManager
  //       //   .get<ConversationalExtension>(ExtensionTypeEnum.Conversational)
  //       //   ?.writeMessages(
  //       //     activeThreadRef.current.id,
  //       //     currentMessages.filter((msg) => msg.id !== currentMessage.id)
  //       //   )
  //     }
  //   }
  //   // Process message request with Assistants tools
  //   const request = await ToolManager.instance().process(
  //     requestBuilder.build(),
  //     activeThreadRef.current.assistants?.flatMap(
  //       (assistant) => assistant.tools ?? []
  //     ) ?? []
  //   )

  //   const engine =
  //     requestBuilder.model?.engine ?? selectedModelRef.current?.engine ?? ''

  //   EngineManager.instance().get(engine)?.inference(request)
  // }

  // Define interface extending Array prototype
  const sendChatMessage = async (message: string) => {
    // if (!message || message.trim().length === 0) return
    // if (!activeThreadRef.current) {
    //   console.error('No active thread')
    //   return
    // }
    // // if (engineParamsUpdate) setReloadModel(true)
    // // const runtimeParams = toRuntimeParams(activeModelParams)
    // // const settingParams = toSettingParams(activeModelParams)
    // const prompt = message.trim()
    // // updateThreadWaiting(activeThreadRef.current.id, true)
    // setCurrentPrompt('')
    // setEditPrompt('')
    // // let base64Blob = fileUpload[0]
    // //   ? await getBase64(fileUpload[0].file)
    // //   : undefined
    // // if (base64Blob && fileUpload[0]?.type === 'image') {
    // //   // Compress image
    // //   base64Blob = await compressImage(base64Blob, 512)
    // // }
    // const modelRequest =
    //   selectedModelRef?.current ?? activeThreadRef.current.assistants[0].model
    // // Fallback support for previous broken threads
    // // if (activeThreadRef.current?.assistants[0]?.model?.id === '*') {
    // //   activeThreadRef.current.assistants[0].model = {
    // //     id: modelRequest.id,
    // //     settings: modelRequest.settings,
    // //     parameters: modelRequest.parameters,
    // //   }
    // // }
    // // if (runtimeParams.stream == null) {
    // //   runtimeParams.stream = true
    // // }
    // // Build Message Request
    // // const requestBuilder = new MessageRequestBuilder(
    // //   MessageRequestType.Thread,
    // //   {
    // //     ...modelRequest,
    // //     // settings: settingParams,
    // //     // parameters: runtimeParams,
    // //   },
    // //   activeThreadRef.current,
    // //   currentMessages
    // // )
    // // requestBuilder.pushMessage(prompt, undefined, fileUpload[0]?.type)
    // // Build Thread Message to persist
    // // const threadMessageBuilder = new ThreadMessageBuilder(
    // //   requestBuilder
    // // ).pushMessage(prompt, undefined, fileUpload)
    // // const newMessage = threadMessageBuilder.build()
    // const userMsg = await createMessage(activeThreadRef.current.id, {
    //   role: 'user',
    //   content: prompt,
    // })
    // // Push to states
    // addNewMessage(userMsg)
    // // Start Model if not started
    // const modelId =
    //   selectedModelRef.current?.id ??
    //   activeThreadRef.current.assistants[0].model.id
    // if (modelRef.current?.id !== modelId) {
    //   setQueuedMessage(true)
    //   const error = await startModel(modelId).catch((error: Error) => error)
    //   setQueuedMessage(false)
    //   if (error) {
    //     // updateThreadWaiting(activeThreadRef.current.id, false)
    //     return
    //   }
    // }
    // setIsGeneratingResponse(true)
    // // Process message request with Assistants tools
    // // const request = await ToolManager.instance().process(
    // //   requestBuilder.build(),
    // //   activeThreadRef.current.assistants?.flatMap(
    // //     (assistant) => assistant.tools ?? []
    // //   ) ?? []
    // // )
    // const stream = await streamChatMessages(modelId, request.messages ?? [])
    // const createdMessage = await createMessage(request.threadId, {
    //   role: 'assistant',
    //   content: '',
    // })
    // const responseMessage: Message = {
    //   id: createdMessage.id,
    //   thread_id: request.threadId,
    //   type: request.type,
    //   assistant_id: request.assistantId,
    //   role: 'assistant',
    //   content: [],
    //   status: 'in_progress',
    //   created: createdMessage.created_at,
    //   object: 'thread.message',
    //   metadata: undefined,
    // }
    // addNewMessage(responseMessage)
    // let assistantResponse: string = ''
    // for await (const chunk of stream) {
    //   const content = chunk.choices[0]?.delta?.content || ''
    //   assistantResponse += content
    //   const messageContent: MessageContent = {
    //     type: 'text',
    //     text: {
    //       value: assistantResponse,
    //       annotations: [],
    //     },
    //   }
    //   responseMessage.content = [messageContent]
    //   updateMessageState(
    //     responseMessage.id,
    //     responseMessage.thread_id,
    //     responseMessage.content,
    //     responseMessage.status
    //   )
    // }
    // // TODO: NamH update the message directly instead of emitting event
    // responseMessage.status = 'completed'
    // updateMessageState(
    //   responseMessage.id,
    //   responseMessage.thread_id,
    //   responseMessage.content,
    //   responseMessage.status
    // )
    // updateMessage(request.threadId, responseMessage.id, {
    //   content: responseMessage.content,
    // })
    // setIsGeneratingResponse(false)
  }

  return {
    sendChatMessage,
  }
}
