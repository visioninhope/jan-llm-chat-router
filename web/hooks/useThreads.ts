import { useCallback } from 'react'

import { Assistant } from '@janhq/core'
import { useSetAtom } from 'jotai'

import { toaster } from '@/containers/Toast'

import useCortex from './useCortex'

import { deleteChatMessageAtom as deleteChatMessagesAtom } from '@/helpers/atoms/ChatMessage.atom'

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
  const deleteMessages = useSetAtom(deleteChatMessagesAtom)
  const deleteThreadState = useSetAtom(deleteThreadAtom)
  const {
    fetchThreads,
    createThread,
    fetchMessages,
    deleteThread: deleteCortexThread,
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
    async (threadId: string, title: string) => {
      try {
        await deleteCortexThread(threadId)
        deleteThreadState(threadId)
        deleteMessages(threadId)

        // TODO: Handle case: if empty thread then create new thread and set it as active
        // else then set active thread id as the first thread in the list
        // has to be done outside of this hook

        toaster({
          title: 'Thread successfully deleted.',
          description: `Thread ${title} has been successfully deleted.`,
          type: 'success',
        })
      } catch (err) {
        console.error(err)
      }
    },
    [deleteMessages, deleteCortexThread, deleteThreadState]
  )

  return {
    getThreadList,
    createThread: createNewThread,
    setActiveThread,
    deleteThread,
  }
}

export default useThreads
