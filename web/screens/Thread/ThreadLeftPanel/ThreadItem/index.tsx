import { useCallback } from 'react'

import { Thread } from '@janhq/core'
import { motion as m } from 'framer-motion'
import { useAtomValue, useSetAtom } from 'jotai'
import { MoreHorizontalIcon } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import useThreads from '@/hooks/useThreads'

import ModalCleanThread from '../ModalCleanThread'
import ModalDeleteThread from '../ModalDeleteThread'
import ModalEditTitleThread from '../ModalEditTitleThread'

import TypingAnimated from '../TypingAnimated'

import { editMessageAtom } from '@/helpers/atoms/ChatMessage.atom'
import {
  getActiveThreadIdAtom,
  getThreadIdsShouldAnimateTitleAtom,
} from '@/helpers/atoms/Thread.atom'

type Props = {
  thread: Thread
}

const ThreadItem: React.FC<Props> = ({ thread }) => {
  const activeThreadId = useAtomValue(getActiveThreadIdAtom)
  const getThreadIdsShouldAnimateTitle = useAtomValue(
    getThreadIdsShouldAnimateTitleAtom
  )
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
      animate={{ opacity: 1, height: '28px' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ ease: 'linear', duration: 0.2 }}
      layoutId={thread.id}
      className={twMerge(
        'group relative mt-1 flex h-[28px] cursor-pointer items-center justify-between rounded-lg pl-2 first:mt-0 hover:bg-[hsla(var(--left-panel-menu-hover))]',
        `${activeThreadId === thread.id && 'text-primary bg-[hsla(var(--left-panel-icon-active-bg))] font-medium'}`
      )}
      onClick={() => onThreadClicked(thread)}
    >
      {getThreadIdsShouldAnimateTitle.includes(thread.id) ? (
        <TypingAnimated text={thread.title} speed={20} />
      ) : (
        <span className="line-clamp-1">{thread.title}</span>
      )}
      <div
        className={twMerge(
          'absolute bottom-0 right-0 top-0 flex w-[42px] items-center justify-end rounded-r-md',
          `${activeThreadId === thread.id ? 'bg-gradient-to-l from-[#dadbde] via-[#dadbde] via-65%' : 'from-[#dadbde] via-[#dadbde] via-65% group-hover:bg-gradient-to-l'}`
        )}
      >
        <div
          className={twMerge(
            'group/icon  mr-1 flex h-[20px] w-[20px] items-center justify-center rounded-md bg-[#DDCAC6] group-hover:visible',
            `${activeThreadId === thread.id ? 'visible' : 'invisible'}`
          )}
        >
          <MoreHorizontalIcon size={18} />
          <div className="invisible absolute right-3 top-5 z-50 w-40 overflow-hidden rounded-lg border border-[hsla(var(--app-border))] bg-[hsla(var(--app-bg))] shadow-lg group-hover/icon:visible">
            <ModalEditTitleThread thread={thread} />
            <ModalCleanThread threadId={thread.id} />
            <ModalDeleteThread id={thread.id} title={thread.title} />
          </div>
        </div>
      </div>
    </m.div>
  )
}

export default ThreadItem
