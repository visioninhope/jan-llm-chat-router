import { MessageContent, ThreadMessage } from '@janhq/core'
import { atom } from 'jotai'

import { getActiveThreadIdAtom } from './Thread.atom'

/**
 * Stores all chat messages for all threads
 */
export const chatMessages = atom<Record<string, ThreadMessage[]>>({})

/**
 * Return the chat messages for the current active conversation
 */
export const getCurrentChatMessagesAtom = atom<ThreadMessage[]>((get) => {
  const activeThreadId = get(getActiveThreadIdAtom)
  if (!activeThreadId) return []
  const messages = get(chatMessages)[activeThreadId]
  return messages ?? []
})

// TODO: rename this function to add instead of set
export const setThreadMessagesAtom = atom(
  null,
  (get, set, threadId: string, messages: ThreadMessage[]) => {
    const newData: Record<string, ThreadMessage[]> = {
      ...get(chatMessages),
    }
    newData[threadId] = [...(newData.messages ?? []), ...messages.reverse()]
    set(chatMessages, newData)
  }
)

export const addNewMessageAtom = atom(
  null,
  (get, set, newMessage: ThreadMessage) => {
    const currentMessages = get(chatMessages)[newMessage.thread_id] ?? []
    const updatedMessages = [...currentMessages, newMessage]

    const newData: Record<string, ThreadMessage[]> = {
      ...get(chatMessages),
    }
    newData[newMessage.thread_id] = updatedMessages
    set(chatMessages, newData)
  }
)

export const deleteChatMessageAtom = atom(
  null,
  (get, set, threadId: string) => {
    const newData: Record<string, ThreadMessage[]> = {
      ...get(chatMessages),
    }
    newData[threadId] = []
    set(chatMessages, newData)
  }
)

export const cleanChatMessageAtom = atom(null, (get, set, id: string) => {
  const newData: Record<string, ThreadMessage[]> = {
    ...get(chatMessages),
  }
  newData[id] = []
  set(chatMessages, newData)
})

export const deleteMessageAtom = atom(null, (get, set, id: string) => {
  const newData: Record<string, ThreadMessage[]> = {
    ...get(chatMessages),
  }
  const threadId = get(getActiveThreadIdAtom)
  if (!threadId) return

  newData[threadId] = newData[threadId].filter((e) => e.id !== id)
  set(chatMessages, newData)
})

export const editMessageAtom = atom('')

export const updateMessageAtom = atom(
  null,
  (
    get,
    set,
    id: string,
    conversationId: string,
    text: MessageContent[],
    status: 'in_progress' | 'completed' | 'incomplete'
  ) => {
    const messages = get(chatMessages)[conversationId] ?? []
    const message = messages.find((e) => e.id === id)
    if (message) {
      message.content = text
      message.status = status
      const updatedMessages = [...messages]
      const newData: Record<string, ThreadMessage[]> = {
        ...get(chatMessages),
      }
      newData[conversationId] = updatedMessages
      set(chatMessages, newData)
    }
  }
)
