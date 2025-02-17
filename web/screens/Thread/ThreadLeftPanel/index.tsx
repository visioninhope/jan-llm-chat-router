import { useCallback, useEffect, useState } from 'react'

import { Thread } from '@janhq/core'

import { Button } from '@janhq/joi'
import { motion as m } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import { GalleryHorizontalEndIcon, MoreHorizontalIcon } from 'lucide-react'

import { twMerge } from 'tailwind-merge'

import LeftPanelContainer from '@/containers/LeftPanelContainer'

import { useCreateNewThread } from '@/hooks/useCreateNewThread'
import useRecommendedModel from '@/hooks/useRecommendedModel'
import useSetActiveThread from '@/hooks/useSetActiveThread'

import ModalCleanThread from './ModalCleanThread'
import ModalDeleteThread from './ModalDeleteThread'
import ModalEditTitleThread from './ModalEditTitleThread'

import { assistantsAtom } from '@/helpers/atoms/Assistant.atom'
import { editMessageAtom } from '@/helpers/atoms/ChatMessage.atom'

import {
  getActiveThreadIdAtom,
  threadDataReadyAtom,
  threadsAtom,
} from '@/helpers/atoms/Thread.atom'

const ThreadLeftPanel = () => {
  const threads = useAtomValue(threadsAtom)
  const activeThreadId = useAtomValue(getActiveThreadIdAtom)
  const { setActiveThread } = useSetActiveThread()
  const assistants = useAtomValue(assistantsAtom)
  const threadDataReady = useAtomValue(threadDataReadyAtom)
  const { requestCreateNewThread } = useCreateNewThread()
  const setEditMessage = useSetAtom(editMessageAtom)
  const { recommendedModel, downloadedModels } = useRecommendedModel()

  const [contextMenu, setContextMenu] = useState<{
    visible: boolean
    thread?: Thread
  }>({
    visible: false,
    thread: undefined,
  })

  const onThreadClick = useCallback(
    (thread: Thread) => {
      setActiveThread(thread)
      setEditMessage('')
    },
    [setActiveThread, setEditMessage]
  )

  /**
   * Auto create thread
   * This will create a new thread if there are assistants available
   * and there are no threads available
   */
  useEffect(() => {
    if (
      threadDataReady &&
      assistants.length > 0 &&
      threads.length === 0 &&
      (recommendedModel || downloadedModels[0])
    ) {
      const model = recommendedModel || downloadedModels[0]
      requestCreateNewThread(assistants[0], model)
    } else if (threadDataReady && !activeThreadId) {
      setActiveThread(threads[0])
    }
  }, [
    assistants,
    threads,
    threadDataReady,
    requestCreateNewThread,
    activeThreadId,
    setActiveThread,
    recommendedModel,
    downloadedModels,
  ])

  const onContextMenu = (event: React.MouseEvent, thread: Thread) => {
    event.preventDefault()
    setContextMenu({
      visible: true,
      thread,
    })
  }

  const closeContextMenu = () => {
    setContextMenu({
      visible: false,
      thread: undefined,
    })
  }

  return (
    <LeftPanelContainer>
      {threads.length === 0 ? (
        <div className="p-2 text-center">
          <GalleryHorizontalEndIcon
            size={16}
            className="text-[hsla(var(--text-secondary)] mx-auto mb-3"
          />
          <h2 className="font-medium">No Thread History</h2>
        </div>
      ) : (
        <div className="p-3">
          {threads.map((thread) => (
            <div
              key={thread.id}
              className={twMerge(
                `group/message relative mb-1 flex cursor-pointer flex-col transition-all hover:rounded-lg hover:bg-[hsla(var(--left-panel-menu-hover))]`
              )}
              onClick={() => {
                onThreadClick(thread)
              }}
              onContextMenu={(e) => onContextMenu(e, thread)}
              onMouseLeave={closeContextMenu}
            >
              <div className="relative z-10 break-all p-2">
                <h1
                  className={twMerge(
                    'line-clamp-1 pr-2 font-medium group-hover/message:pr-6',
                    activeThreadId && 'font-medium'
                  )}
                >
                  {thread.title}
                </h1>
              </div>
              <div
                className={twMerge(
                  `group/icon text-[hsla(var(--text-secondary)] invisible absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-md px-0.5 group-hover/message:visible`
                )}
              >
                <Button theme="icon" className="mt-2">
                  <MoreHorizontalIcon />
                </Button>
                <div
                  className={twMerge(
                    'invisible absolute -right-1 z-50 w-40 overflow-hidden rounded-lg border border-[hsla(var(--app-border))] bg-[hsla(var(--app-bg))] shadow-lg group-hover/icon:visible',
                    contextMenu.visible &&
                      contextMenu.thread?.id === thread.id &&
                      'visible'
                  )}
                >
                  <ModalEditTitleThread
                    thread={thread}
                    closeContextMenu={closeContextMenu}
                  />
                  <ModalCleanThread
                    threadId={thread.id}
                    closeContextMenu={closeContextMenu}
                  />
                  <ModalDeleteThread
                    threadId={thread.id}
                    closeContextMenu={closeContextMenu}
                  />
                </div>
              </div>
              {activeThreadId === thread.id && (
                <m.div
                  className="absolute inset-0 left-0 h-full w-full rounded-lg bg-[hsla(var(--left-panel-icon-active-bg))]"
                  layoutId="active-thread"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </LeftPanelContainer>
  )
}

export default ThreadLeftPanel
