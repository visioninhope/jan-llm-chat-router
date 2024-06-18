import { useCallback } from 'react'

import {
  ChatCompletionMessageParam,
  Message,
  MessageContent,
  TextContentBlock,
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
import { activeModelsAtom } from '@/helpers/atoms/Model.atom'
import {
  activeThreadAtom,
  isGeneratingResponseAtom,
} from '@/helpers/atoms/Thread.atom'

const useSendMessage = () => {
  const addNewMessage = useSetAtom(addNewMessageAtom)
  const { createMessage, streamChatMessages, updateMessage } = useCortex()
  const updateMessageState = useSetAtom(updateMessageAtom)
  const setIsGeneratingResponse = useSetAtom(isGeneratingResponseAtom)

  const setCurrentPrompt = useSetAtom(currentPromptAtom)
  const setEditPrompt = useSetAtom(editPromptAtom)

  const activeThread = useAtomValue(activeThreadAtom)
  const activeModels = useAtomValue(activeModelsAtom)
  const currentMessages = useAtomValue(getCurrentChatMessagesAtom)
  const { startModel } = useActiveModel()

  const sendMessage = useCallback(
    async (message: string) => {
      if (!activeThread) {
        console.error('No active thread')
        return
      }

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
        messages.unshift(systemMessage)

        const stream = await streamChatMessages(modelId, messages)

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

        let assistantResponse: string = ''
        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || ''
          assistantResponse += content
          const messageContent: MessageContent = {
            type: 'text',
            text: {
              value: assistantResponse,
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
        setIsGeneratingResponse(false)
      } catch (err) {
        console.error(err)
      }
    },
    [
      activeThread,
      activeModels,
      currentMessages,
      setCurrentPrompt,
      setEditPrompt,
      setIsGeneratingResponse,
      updateMessage,
      updateMessageState,
      addNewMessage,
      createMessage,
      startModel,
      streamChatMessages,
    ]
  )

  return { sendMessage }
}

export default useSendMessage
