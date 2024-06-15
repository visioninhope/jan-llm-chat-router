import { useCallback } from 'react'

import { useSetAtom } from 'jotai'

import useCortex from './useCortex'

import {
  configuredModelsAtom,
  downloadedModelsAtom,
} from '@/helpers/atoms/Model.atom'

const useModels = () => {
  const setDownloadedModels = useSetAtom(downloadedModelsAtom)
  const setConfiguredModels = useSetAtom(configuredModelsAtom)
  const { fetchModels } = useCortex()

  const getModels = useCallback(() => {
    const getDownloadedModels = async () => {
      const models = await fetchModels()
      setDownloadedModels(models)
      setConfiguredModels(models)
    }
    getDownloadedModels()
  }, [setDownloadedModels, setConfiguredModels, fetchModels])

  return { getModels }
}

export default useModels
