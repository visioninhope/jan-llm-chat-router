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
  const { fetchModels, stopModel: cortexStopModel } = useCortex()

  const getModels = useCallback(() => {
    const getDownloadedModels = async () => {
      const models = await fetchModels()
      setDownloadedModels(models)
      setConfiguredModels(models)
    }
    getDownloadedModels()
  }, [setDownloadedModels, setConfiguredModels, fetchModels])

  const stopModel = useCallback(
    async (modelId: string) => cortexStopModel(modelId),
    [cortexStopModel]
  )

  return { getModels, stopModel }
}

export default useModels
