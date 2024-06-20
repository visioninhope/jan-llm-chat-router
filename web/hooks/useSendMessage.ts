import { useCallback } from 'react'

import {
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionMessageParam,
  Message,
  MessageContent,
  TextContentBlock,
  Thread,
} from '@janhq/core'

import { useAtomValue, useSetAtom } from 'jotai'

import { currentPromptAtom, editPromptAtom } from '@/containers/Providers/Jotai'

import { useActiveModel } from './useActiveModel'
import useCortex from './useCortex'

import {
  addNewMessageAtom,
  getCurrentChatMessagesAtom,
  updateMessageAtom,
} from '@/helpers/atoms/ChatMessage.atom'
import { activeModelsAtom, selectedModelAtom } from '@/helpers/atoms/Model.atom'
import {
  activeThreadAtom,
  isGeneratingResponseAtom,
  updateThreadTitleAtom,
} from '@/helpers/atoms/Thread.atom'

const useSendMessage = () => {
  const addNewMessage = useSetAtom(addNewMessageAtom)
  const {
    createMessage,
    streamChatMessages,
    updateMessage,
    chatCompletionNonStreaming,
    updateThread,
  } = useCortex()
  const updateMessageState = useSetAtom(updateMessageAtom)
  const setIsGeneratingResponse = useSetAtom(isGeneratingResponseAtom)
  const setCurrentPrompt = useSetAtom(currentPromptAtom)
  const setEditPrompt = useSetAtom(editPromptAtom)

  const updateThreadTitle = useSetAtom(updateThreadTitleAtom)

  const activeThread = useAtomValue(activeThreadAtom)
  const activeModels = useAtomValue(activeModelsAtom)
  const currentMessages = useAtomValue(getCurrentChatMessagesAtom)
  const selectedModel = useAtomValue(selectedModelAtom)

  const { startModel } = useActiveModel()

  const summarizeThread = useCallback(
    async (messages: string[], modelId: string, thread: Thread) => {
      const maxWordForThreadTitle = 10
      const summarizeMessages: ChatCompletionMessageParam[] = [
        {
          role: 'user',
          content: `Summarize in a ${maxWordForThreadTitle}-word title the following conversation:\n\n${messages.join('\n')}`,
        },
      ]

      const summarizeParams: ChatCompletionCreateParamsNonStreaming = {
        messages: summarizeMessages,
        model: modelId,
        max_tokens: 150,
        temperature: 0.5,
      }
      const summarizeStream = await chatCompletionNonStreaming(summarizeParams)
      const summarizedText = (
        summarizeStream.choices[0].message.content ?? 'New Thread'
      ).replace(/"/g, '')

      updateThread({ ...thread, title: summarizedText })
      updateThreadTitle(thread.id, summarizedText)
    },
    [chatCompletionNonStreaming, updateThreadTitle, updateThread]
  )

  const sendMessage = useCallback(
    async (message: string) => {
      if (!activeThread) {
        console.error('No active thread')
        return
      }
      if (!selectedModel) {
        console.error('No selected model')
        return
      }
      if (selectedModel.id !== activeThread.assistants[0].model) {
        alert(
          "Selected model doesn't match active thread assistant model. This is a bug"
        )
        return
      }
      const shouldSummarize = activeThread.title === 'New Thread'
      const modelId = activeThread.assistants[0].model

      setCurrentPrompt('')
      setEditPrompt('')

      const userMessage = await createMessage(activeThread.id, {
        role: 'user',
        content: message,
      })
      // Push to states
      addNewMessage(userMessage)

      try {
        // start model if not yet started
        // TODO: Handle case model is starting up
        if (!activeModels.map((model) => model.model).includes(modelId)) {
          // start model
          await startModel(modelId)
        }

        setIsGeneratingResponse(true)

        // building messages
        const systemMessage: ChatCompletionMessageParam = {
          role: 'system',
          content: activeThread.assistants[0].instructions ?? '',
        }

        const messages: ChatCompletionMessageParam[] = currentMessages
          .map((msg) => {
            switch (msg.role) {
              case 'user':
              case 'assistant':
                return {
                  role: 'user',
                  content: (msg.content[0] as TextContentBlock).text.value,
                }

              // we will need to support other roles in the future
              default:
                break
            }
          })
          .filter((msg) => msg != null) as ChatCompletionMessageParam[]
        messages.push({
          role: 'user',
          content: message,
        })
        messages.unshift(systemMessage)

        let assistantResponseMessage = ''
        if (selectedModel.stream === true) {
          const stream = await streamChatMessages({
            messages,
            ...selectedModel,
            model: selectedModel.id,
            stream: true,
          })

          const assistantMessage = await createMessage(activeThread.id, {
            role: 'assistant',
            content: '',
          })

          const responseMessage: Message = {
            id: assistantMessage.id,
            thread_id: activeThread.id,
            assistant_id: activeThread.id,
            role: 'assistant',
            content: [],
            status: 'in_progress',
            created_at: assistantMessage.created_at,
            metadata: undefined,
            attachments: null,
            completed_at: null,
            incomplete_at: null,
            incomplete_details: null,
            object: 'thread.message',
            run_id: null,
          }

          addNewMessage(responseMessage)

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            assistantResponseMessage += content
            const messageContent: MessageContent = {
              type: 'text',
              text: {
                value: assistantResponseMessage,
                annotations: [],
              },
            }
            responseMessage.content = [messageContent]
            updateMessageState(
              responseMessage.id,
              responseMessage.thread_id,
              responseMessage.content,
              responseMessage.status
            )
          }

          responseMessage.status = 'completed'
          updateMessageState(
            responseMessage.id,
            responseMessage.thread_id,
            responseMessage.content,
            responseMessage.status
          )
          updateMessage(activeThread.id, responseMessage.id, {
            content: responseMessage.content,
          })
        } else {
          const response = await chatCompletionNonStreaming({
            messages,
            ...selectedModel,
            model: selectedModel.id,
            stream: false,
          })

          assistantResponseMessage = response.choices[0].message.content ?? ''
          const assistantMessage = await createMessage(activeThread.id, {
            role: 'assistant',
            content: assistantResponseMessage,
          })

          const responseMessage: Message = {
            id: assistantMessage.id,
            thread_id: activeThread.id,
            assistant_id: activeThread.id,
            role: 'assistant',
            content: [
              {
                type: 'text',
                text: {
                  value: assistantResponseMessage,
                  annotations: [],
                },
              },
            ],
            status: 'completed',
            created_at: assistantMessage.created_at,
            metadata: undefined,
            attachments: null,
            completed_at: null,
            incomplete_at: null,
            incomplete_details: null,
            object: 'thread.message',
            run_id: null,
          }

          addNewMessage(responseMessage)
        }

        setIsGeneratingResponse(false)

        if (!shouldSummarize) return
        // summarize if needed
        const textMessages: string[] = messages
          .map((msg) => {
            if (typeof msg.content === 'string') return msg.content
          })
          .filter((msg) => msg != null) as string[]
        textMessages.push(assistantResponseMessage)
        summarizeThread(textMessages, modelId, activeThread)
      } catch (err) {
        console.error(err)
      }
    },
    [
      activeThread,
      activeModels,
      currentMessages,
      selectedModel,
      setCurrentPrompt,
      setEditPrompt,
      setIsGeneratingResponse,
      updateMessage,
      updateMessageState,
      addNewMessage,
      createMessage,
      startModel,
      chatCompletionNonStreaming,
      streamChatMessages,
      summarizeThread,
    ]
  )

  return { sendMessage }
}

export default useSendMessage
