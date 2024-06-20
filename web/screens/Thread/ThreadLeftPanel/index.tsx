import { useCallback } from 'react'

import { Thread } from '@janhq/core'

import { Button } from '@janhq/joi'
import { motion as m } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  GalleryHorizontalEndIcon,
  MoreHorizontalIcon,
  PenSquareIcon,
} from 'lucide-react'

import { twMerge } from 'tailwind-merge'

import LeftPanelContainer from '@/containers/LeftPanelContainer'
import { toaster } from '@/containers/Toast'

import useThreads from '@/hooks/useThreads'

import ModalCleanThread from './ModalCleanThread'
import ModalDeleteThread from './ModalDeleteThread'
import ModalEditTitleThread from './ModalEditTitleThread'

import { assistantsAtom } from '@/helpers/atoms/Assistant.atom'
import { editMessageAtom } from '@/helpers/atoms/ChatMessage.atom'

import { selectedModelAtom } from '@/helpers/atoms/Model.atom'
import { getActiveThreadIdAtom, threadsAtom } from '@/helpers/atoms/Thread.atom'

const ThreadLeftPanel: React.FC = () => {
  const { createThread, setActiveThread } = useThreads()
  const selectedModel = useAtomValue(selectedModelAtom)

  const threads = useAtomValue(threadsAtom)
  const activeThreadId = useAtomValue(getActiveThreadIdAtom)
  const assistants = useAtomValue(assistantsAtom)
  const setEditMessage = useSetAtom(editMessageAtom)

  const onThreadClick = useCallback(
    (thread: Thread) => {
      setActiveThread(thread.id)
      setEditMessage('')
    },
    [setActiveThread, setEditMessage]
  )

  const onCreateThreadClicked = useCallback(async () => {
    if (assistants.length === 0) {
      toaster({
        title: 'No assistant available.',
        description: `Could not create a new thread. Please add an assistant.`,
        type: 'error',
      })
      return
    }
    if (!selectedModel) return
    createThread(selectedModel.id, assistants[0])
  }, [createThread, selectedModel, assistants])

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
          <Button
            className="mb-2"
            data-testid="btn-create-thread"
            onClick={onCreateThreadClicked}
            theme="icon"
          >
            <PenSquareIcon
              size={16}
              className="cursor-pointer text-[hsla(var(--text-secondary))]"
            />
          </Button>

          {threads.map((thread) => (
            <div
              key={thread.id}
              className={twMerge(
                `group/message relative mb-1 flex cursor-pointer flex-col transition-all hover:rounded-lg hover:bg-[hsla(var(--left-panel-menu-hover))]`
              )}
              onClick={() => onThreadClick(thread)}
            >
              <div className="relative z-10 p-2">
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
                <div className="invisible absolute -right-1 z-50 w-40 overflow-hidden rounded-lg border border-[hsla(var(--app-border))] bg-[hsla(var(--app-bg))] shadow-lg group-hover/icon:visible">
                  <ModalEditTitleThread thread={thread} />
                  <ModalCleanThread threadId={thread.id} />
                  <ModalDeleteThread id={thread.id} title={thread.title} />
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
