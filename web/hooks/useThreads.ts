import { useCallback } from 'react'

import { useSetAtom } from 'jotai'

import useCortex from './useCortex'

import {
  ModelParams,
  threadModelParamsAtom,
  threadsAtom,
} from '@/helpers/atoms/Thread.atom'

const useThreads = () => {
  const setThreads = useSetAtom(threadsAtom)
  const setThreadModelRuntimeParams = useSetAtom(threadModelParamsAtom)
  const { fetchThreads } = useCortex()

  const getThreadList = useCallback(async () => {
    const threads = await fetchThreads()
    const threadModelParams: Record<string, ModelParams> = {}

    threads.forEach((thread) => {
      const modelParams = thread.assistants?.[0]?.model?.parameters
      const engineParams = thread.assistants?.[0]?.model?.settings
      threadModelParams[thread.id] = {
        ...modelParams,
        ...engineParams,
      }
    })

    setThreads(threads)
    setThreadModelRuntimeParams(threadModelParams)
  }, [setThreads, setThreadModelRuntimeParams, fetchThreads])

  return { getThreadList }
}

export default useThreads
