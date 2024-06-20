import { useCallback } from 'react'

import { Assistant } from '@janhq/core'
import { useSetAtom } from 'jotai'

import { toaster } from '@/containers/Toast'

import useCortex from './useCortex'

import {
  cleanChatMessageAtom,
  deleteChatMessageAtom,
} from '@/helpers/atoms/ChatMessage.atom'

import { setThreadMessagesAtom } from '@/helpers/atoms/ChatMessage.atom'
import {
  deleteThreadAtom,
  setActiveThreadIdAtom,
  threadsAtom,
} from '@/helpers/atoms/Thread.atom'

const useThreads = () => {
  const setThreads = useSetAtom(threadsAtom)
  const setActiveThreadId = useSetAtom(setActiveThreadIdAtom)
  const setThreadMessage = useSetAtom(setThreadMessagesAtom)
  const deleteMessages = useSetAtom(deleteChatMessageAtom)
  const deleteThreadState = useSetAtom(deleteThreadAtom)
  const cleanMessages = useSetAtom(cleanChatMessageAtom)
  const {
    fetchThreads,
    createThread,
    fetchMessages,
    deleteThread: deleteCortexThread,
    cleanThread: cleanCortexThread,
  } = useCortex()

  const getThreadList = useCallback(async () => {
    const threads = await fetchThreads()
    setThreads(threads)
  }, [setThreads, fetchThreads])

  const setActiveThread = useCallback(
    async (threadId: string) => {
      const messages = await fetchMessages(threadId)
      setThreadMessage(threadId, messages)
      setActiveThreadId(threadId)
    },
    [fetchMessages, setThreadMessage, setActiveThreadId]
  )

  const createNewThread = useCallback(
    async (modelId: string, assistant: Assistant) => {
      assistant.model = modelId
      const thread = await createThread(assistant)
      setThreads((threads) => [thread, ...threads])
      setActiveThread(thread.id)
    },
    [createThread, setActiveThread, setThreads]
  )

  const deleteThread = useCallback(
    async (threadId: string) => {
      try {
        await deleteCortexThread(threadId)
        deleteThreadState(threadId)
        deleteMessages(threadId)
      } catch (err) {
        console.error(err)
      }
    },
    [deleteMessages, deleteCortexThread, deleteThreadState]
  )

  const cleanThread = useCallback(
    async (threadId: string) => {
      await cleanCortexThread(threadId)
      cleanMessages(threadId)
    },
    [cleanCortexThread, cleanMessages]
  )

  return {
    getThreadList,
    createThread: createNewThread,
    setActiveThread,
    deleteThread,
    cleanThread,
  }
}

export default useThreads
