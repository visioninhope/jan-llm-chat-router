import { useCallback, useEffect, useRef } from 'react'

import { DownloadState2 } from '@janhq/core'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useAtomValue, useSetAtom } from 'jotai'

import { downloadStateListAtom } from '@/hooks/useDownloadState'

import { hostAtom } from '@/helpers/atoms/AppConfig.atom'

const DownloadEventListener: React.FC = () => {
  const host = useAtomValue(hostAtom)
  const isRegistered = useRef(false)
  const abortController = useRef(new AbortController())
  const setDownloadStateList = useSetAtom(downloadStateListAtom)

  const subscribeDownloadEvent = useCallback(async () => {
    if (isRegistered.current) return
    await fetchEventSource(`${host}events/download`, {
      onmessage(ev) {
        if (!ev.data) return
        if (typeof ev.data === 'string') return
        try {
          const downloadEvent = JSON.parse(ev.data) as DownloadState2[]
          setDownloadStateList(downloadEvent)
        } catch (err) {
          console.error(err)
        }
      },
      signal: abortController.current.signal,
    })
    isRegistered.current = true
  }, [host, setDownloadStateList])

  const unsubscribeDownloadEvent = useCallback(() => {
    abortController.current.abort()
    isRegistered.current = false
  }, [])

  useEffect(() => {
    subscribeDownloadEvent()
    return () => {
      unsubscribeDownloadEvent()
    }
  }, [subscribeDownloadEvent, unsubscribeDownloadEvent])

  return null
}

export default DownloadEventListener
