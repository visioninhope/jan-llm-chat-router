import { useCallback } from 'react'

import { useSetAtom } from 'jotai'

import useCortex from './useCortex'

import { assistantsAtom } from '@/helpers/atoms/Assistant.atom'

const useAssistants = () => {
  const setAssistants = useSetAtom(assistantsAtom)
  const { fetchAssistants } = useCortex()

  const getAssistantList = useCallback(async () => {
    const assistants = await fetchAssistants()
    setAssistants(assistants)
  }, [fetchAssistants, setAssistants])

  const createAssistant = useCallback(async (assistant: object) => {
    throw new Error('not implemented')
  }, [])

  return { getAssistantList, createAssistant }
}

export default useAssistants
