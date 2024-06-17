import { useEffect, useRef } from 'react'

import { Model } from '@janhq/core'

import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai'

import { toaster } from '@/containers/Toast'

import useCortex from './useCortex'
import { LAST_USED_MODEL_ID } from './useRecommendedModel'

import { downloadedModelsAtom } from '@/helpers/atoms/Model.atom'
import { activeThreadAtom } from '@/helpers/atoms/Thread.atom'

export const activeModelAtom = atom<Model | undefined>(undefined)
export const loadModelErrorAtom = atom<string | undefined>(undefined)

type ModelState = {
  state: string
  loading: boolean
  model?: Model
}

export const stateModelAtom = atom<ModelState>({
  state: 'start',
  loading: false,
  model: undefined,
})

const pendingModelLoadAtom = atom<boolean>(false)

export function useActiveModel() {
  const [activeModel, setActiveModel] = useAtom(activeModelAtom)
  const activeThread = useAtomValue(activeThreadAtom)
  const [stateModel, setStateModel] = useAtom(stateModelAtom)
  const downloadedModels = useAtomValue(downloadedModelsAtom)
  const setLoadModelError = useSetAtom(loadModelErrorAtom)
  const [pendingModelLoad, setPendingModelLoad] = useAtom(pendingModelLoadAtom)

  const downloadedModelsRef = useRef<Model[]>([])
  const { startModel: startCortexModel } = useCortex()

  useEffect(() => {
    downloadedModelsRef.current = downloadedModels
  }, [downloadedModels])

  const startModel = async (modelId: string, abortable: boolean = true) => {
    if (
      (activeModel && activeModel.id === modelId) ||
      (stateModel.model?.id === modelId && stateModel.loading)
    ) {
      console.debug(`Model ${modelId} is already initialized. Ignore..`)
      return Promise.resolve()
    }
    setPendingModelLoad(true)

    let model = downloadedModelsRef?.current.find((e) => e.id === modelId)

    setLoadModelError(undefined)

    setActiveModel(undefined)

    setStateModel({ state: 'start', loading: true, model })

    if (!model) {
      toaster({
        title: `Model ${modelId} not found!`,
        description: `Please download the model first.`,
        type: 'warning',
      })
      setStateModel(() => ({
        state: 'start',
        loading: false,
        model: undefined,
      }))

      return Promise.reject(`Model ${modelId} not found!`)
    }

    /// Apply thread model settings
    if (activeThread?.assistants[0]?.model.id === modelId) {
      model = {
        ...model,
        settings: {
          ...model.settings,
          ...activeThread.assistants[0].model.settings,
        },
      }
    }

    localStorage.setItem(LAST_USED_MODEL_ID, model.id)
    try {
      await startCortexModel(modelId)
      setActiveModel(model)
      setStateModel(() => ({
        state: 'stop',
        loading: false,
        model,
      }))
      toaster({
        title: 'Success!',
        description: `Model ${model.id} has been started.`,
        type: 'success',
      })
    } catch (err) {
      setStateModel(() => ({
        state: 'start',
        loading: false,
        model,
      }))

      if (!pendingModelLoad && abortable) {
        return Promise.reject(new Error('aborted'))
      }

      toaster({
        title: 'Failed!',
        description: `Model ${model.id} failed to start.`,
        type: 'error',
      })
      setLoadModelError(err)
      return Promise.reject(err)
    }

    // const engine = EngineManager.instance().get(model.engine)
    // return engine
    //   ?.loadModel(model)
    //   .then(() => {
    //     setActiveModel(model)
    //     setStateModel(() => ({
    //       state: 'stop',
    //       loading: false,
    //       model,
    //     }))
    //     toaster({
    //       title: 'Success!',
    //       description: `Model ${model.id} has been started.`,
    //       type: 'success',
    //     })
    //   })
    //   .catch((error) => {
    //     setStateModel(() => ({
    //       state: 'start',
    //       loading: false,
    //       model,
    //     }))
    //
    //     if (!pendingModelLoad && abortable) {
    //       return Promise.reject(new Error('aborted'))
    //     }
    //
    //     toaster({
    //       title: 'Failed!',
    //       description: `Model ${model.id} failed to start.`,
    //       type: 'error',
    //     })
    //     setLoadModelError(error)
    //     return Promise.reject(error)
    //   })
  }

  // const stopInference = useCallback(async () => {
  //   // Loading model
  //   if (stateModel.loading) {
  //     stopModel()
  //     return
  //   }
  // }, [stateModel, stopModel])

  return { activeModel, startModel, stateModel }
}
