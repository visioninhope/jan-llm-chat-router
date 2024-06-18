'use client'

import { useEffect } from 'react'

import { useAtomValue, useSetAtom } from 'jotai'

import { MainViewState } from '@/constants/screens'

import useThreads from '@/hooks/useThreads'

import { mainViewStateAtom, showLeftPanelAtom } from '@/helpers/atoms/App.atom'
import { assistantsAtom } from '@/helpers/atoms/Assistant.atom'
import { selectedModelAtom } from '@/helpers/atoms/Model.atom'

const KeyListener: React.FC = () => {
  const setShowLeftPanel = useSetAtom(showLeftPanelAtom)
  const setMainViewState = useSetAtom(mainViewStateAtom)
  const { createThread } = useThreads()
  const assistants = useAtomValue(assistantsAtom)
  const selectedModel = useAtomValue(selectedModelAtom)

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const prefixKey = isMac ? e.metaKey : e.ctrlKey

      if (e.key === 'n' && prefixKey) {
        if (!selectedModel) return
        createThread(selectedModel.id, assistants[0])
        setMainViewState(MainViewState.Thread)
        return
      }

      if (e.key === 'b' && prefixKey) {
        setShowLeftPanel((showLeftSideBar) => !showLeftSideBar)
        return
      }

      if (e.key === ',' && prefixKey) {
        setMainViewState(MainViewState.Settings)
        return
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [
    assistants,
    selectedModel,
    createThread,
    setMainViewState,
    setShowLeftPanel,
  ])

  return null
}

export default KeyListener
