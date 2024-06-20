import { useCallback } from 'react'

import { Thread } from '@janhq/core'
import { Button } from '@janhq/joi'
import { motion as m } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import { MoreHorizontalIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import useThreads from '@/hooks/useThreads'

import ModalCleanThread from '../ModalCleanThread'
import ModalDeleteThread from '../ModalDeleteThread'
import ModalEditTitleThread from '../ModalEditTitleThread'

import { editMessageAtom } from '@/helpers/atoms/ChatMessage.atom'
import { getActiveThreadIdAtom } from '@/helpers/atoms/Thread.atom'

type Props = {
  thread: Thread
}

const ThreadItem: React.FC<Props> = ({ thread }) => {
  const activeThreadId = useAtomValue(getActiveThreadIdAtom)
  const setEditMessage = useSetAtom(editMessageAtom)
  const { setActiveThread } = useThreads()

  const onThreadClicked = useCallback(
    (thread: Thread) => {
      setActiveThread(thread.id)
      setEditMessage('')
    },
    [setActiveThread, setEditMessage]
  )

  return (
    <m.div
      key={thread.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ ease: 'linear', duration: 0.2 }}
      layoutId={thread.id}
      className="group/message relative mb-1 flex cursor-pointer flex-col hover:rounded-lg hover:bg-[hsla(var(--left-panel-menu-hover))]"
      onClick={() => onThreadClicked(thread)}
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
      <div className="group/icon text-[hsla(var(--text-secondary)] invisible absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-md px-0.5 group-hover/message:visible">
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
        <div className="absolute inset-0 left-0 h-full w-full rounded-lg bg-[hsla(var(--left-panel-icon-active-bg))]" />
      )}
    </m.div>
  )
}

export default ThreadItem
