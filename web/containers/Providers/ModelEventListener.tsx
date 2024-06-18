import { useCallback, useEffect, useRef } from 'react'

import {
  EmptyModelEvent,
  ModelEvent,
  ModelStatus,
  StatusAndEvent,
} from '@janhq/core'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAtomValue, useSetAtom } from 'jotai'

import { toaster } from '../Toast'

import { hostAtom } from '@/helpers/atoms/AppConfig.atom'
import { activeModelsAtom } from '@/helpers/atoms/Model.atom'

function ModelEventListener() {
  const setActiveModels = useSetAtom(activeModelsAtom)
  const host = useAtomValue(hostAtom)
  const abortController = useRef<AbortController | null>(null)

  const handleModelEvent = useCallback((modelEvent: ModelEvent) => {
    switch (modelEvent.event) {
      case 'started':
        toaster({
          title: 'Success!',
          description: `Model ${modelEvent.model} has been started.`,
          type: 'success',
        })
        break

      case 'starting-failed':
        toaster({
          title: 'Failed!',
          description: `Model ${modelEvent.model} failed to start.`,
          type: 'error',
        })
        break

      case 'stopped':
        toaster({
          title: 'Success!',
          description: `Model ${modelEvent.model} has been stopped.`,
          type: 'success',
        })
        break

      case 'stopping-failed':
        toaster({
          title: 'Failed!',
          description: `Model ${modelEvent.model} failed to stop.`,
          type: 'error',
        })
        break

      default:
        break
    }
  }, [])

  const subscribeModelEvent = useCallback(async () => {
    if (abortController.current) return
    abortController.current = new AbortController()

    await fetchEventSource(`${host}events/model`, {
      onmessage(ev) {
        if (!ev.data || ev.data === '') return
        try {
          const modelEvent = JSON.parse(ev.data) as StatusAndEvent

          const runningModels: ModelStatus[] = []
          Object.values(modelEvent.status).forEach((value) => {
            runningModels.push(value)
          })
          setActiveModels(runningModels)

          if (modelEvent.event === EmptyModelEvent) return
          handleModelEvent(modelEvent.event as ModelEvent)
        } catch (err) {
          console.error(err)
        }
      },
      signal: abortController.current.signal,
    })
  }, [host, setActiveModels, handleModelEvent])

  const unsubscribeModelEvent = useCallback(() => {
    if (!abortController.current) return

    abortController.current.abort()
    abortController.current = null
  }, [])

  useEffect(() => {
    subscribeModelEvent()
    return () => {
      unsubscribeModelEvent()
    }
  }, [subscribeModelEvent, unsubscribeModelEvent])

  return null
}

export default ModelEventListener
