import { useCallback } from 'react'

import { useSetAtom } from 'jotai'

import { toaster } from '@/containers/Toast'

import useCortex from './useCortex'

import {
  configuredModelsAtom,
  downloadedModelsAtom,
  removeDownloadedModelAtom,
} from '@/helpers/atoms/Model.atom'

const useModels = () => {
  const setDownloadedModels = useSetAtom(downloadedModelsAtom)
  const setConfiguredModels = useSetAtom(configuredModelsAtom)
  const removeDownloadedModel = useSetAtom(removeDownloadedModelAtom)
  const {
    fetchModels,
    stopModel: cortexStopModel,
    deleteModel: cortexDeleteModel,
  } = useCortex()

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

  const deleteModel = useCallback(
    async (modelId: string) => {
      await cortexDeleteModel(modelId)
      removeDownloadedModel(modelId)

      toaster({
        title: 'Model Deletion Successful',
        description: `Model ${modelId} has been successfully deleted.`,
        type: 'success',
      })
    },
    [removeDownloadedModel, cortexDeleteModel]
  )

  return { getModels, stopModel, deleteModel }
}

export default useModels
