'use client'

import {
  Fragment,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from 'react'

import { Toaster } from 'react-hot-toast'

import Loader from '@/containers/Loader'
import EventListenerWrapper from '@/containers/Providers/EventListener'
import JotaiWrapper from '@/containers/Providers/Jotai'

import ThemeWrapper from '@/containers/Providers/Theme'

import { setupCoreServices } from '@/services/coreService'

import Umami from '@/utils/umami'

import DataLoader from './DataLoader'

import Responsive from './Responsive'

import { extensionManager } from '@/extension'

const Providers = ({ children }: PropsWithChildren) => {
  const [setupCore, setSetupCore] = useState(false)
  const [activated, setActivated] = useState(false)
  const [settingUp, setSettingUp] = useState(false)

  const setupExtensions = useCallback(async () => {
    // Register all active extensions
    await extensionManager.registerActive()

    setTimeout(async () => {
      extensionManager.load()
      setSettingUp(false)
      setActivated(true)
    }, 500)
  }, [])

  // Services Setup
  useEffect(() => {
    setupCoreServices()
    setSetupCore(true)
    return () => {
      extensionManager.unload()
    }
  }, [])

  useEffect(() => {
    if (setupCore) {
      // Electron
      if (window && window.core?.api) {
        setupExtensions()
      } else {
        // Host
        setActivated(true)
      }
    }
  }, [setupCore, setupExtensions])

  return (
    <ThemeWrapper>
      <JotaiWrapper>
        <Umami />
        {settingUp && <Loader description="Preparing Update..." />}
        {setupCore && activated && (
          <Fragment>
            <DataLoader />
            <EventListenerWrapper />
            <Responsive>{children}</Responsive>
            <Toaster />
          </Fragment>
        )}
      </JotaiWrapper>
    </ThemeWrapper>
  )
}

export default Providers
