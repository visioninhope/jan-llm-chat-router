import { useCallback, useEffect, useRef } from 'react'

import { ModelEvent } from '@janhq/core'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAtomValue } from 'jotai'

import { hostAtom } from '@/helpers/atoms/AppConfig.atom'

const ModelEventListener: React.FC = () => {
  const host = useAtomValue(hostAtom)
  const abortController = useRef<AbortController | null>(null)

  const subscribeModelEvent = useCallback(async () => {
    if (abortController.current) return
    abortController.current = new AbortController()

    await fetchEventSource(`${host}events/model`, {
      onmessage(ev) {
        if (!ev.data || ev.data === '') return
        try {
          const modelEvent = JSON.parse(ev.data) as ModelEvent[]
          console.log('New model event:', modelEvent)
        } catch (err) {
          console.error(err)
        }
      },
      signal: abortController.current.signal,
    })
    console.log('Model event subscribed')
  }, [host])

  const unsubscribeModelEvent = useCallback(() => {
    if (!abortController.current) return

    abortController.current.abort()
    abortController.current = null
    console.log('Model event unsubscribed')
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
