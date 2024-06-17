import { useCallback } from 'react'

import { ThreadMessage, ContentType } from '@janhq/core'
import { useAtomValue, useSetAtom } from 'jotai'
import {
  RefreshCcw,
  CopyIcon,
  Trash2Icon,
  CheckIcon,
  PencilIcon,
} from 'lucide-react'

import { useClipboard } from '@/hooks/useClipboard'
import useCortex from '@/hooks/useCortex'

import {
  deleteMessageAtom,
  editMessageAtom,
  getCurrentChatMessagesAtom,
} from '@/helpers/atoms/ChatMessage.atom'

const MessageToolbar = ({ message }: { message: ThreadMessage }) => {
  const deleteMessage = useSetAtom(deleteMessageAtom)
  const setEditMessage = useSetAtom(editMessageAtom)
  const messages = useAtomValue(getCurrentChatMessagesAtom)
  const clipboard = useClipboard({ timeout: 1000 })
  const { deleteMessage: deleteCortexMessage } = useCortex()

  const onDeleteClick = useCallback(
    async (threadId: string, messageId: string) => {
      await deleteCortexMessage(threadId, messageId)
      deleteMessage(messageId)
    },
    [deleteMessage, deleteCortexMessage]
  )

  if (message.status === 'in_progress') return null

  return (
    <div className="flex flex-row items-center">
      <div className="flex gap-1 bg-[hsla(var(--app-bg))]">
        {message.role === 'user' &&
          message.content[0]?.type === ContentType.Text && (
            <div
              className="cursor-pointer rounded-lg border border-[hsla(var(--app-border))] p-2"
              onClick={() => setEditMessage(message.id)}
            >
              <PencilIcon
                size={14}
                className="text-[hsla(var(--text-secondary))]"
              />
            </div>
          )}

        {message.id === messages[messages.length - 1]?.id &&
          messages[messages.length - 1].content[0]?.type !==
            ContentType.Pdf && (
            <div
              className="cursor-pointer rounded-lg border border-[hsla(var(--app-border))] p-2"
              onClick={() => {}}
            >
              <RefreshCcw
                size={14}
                className="text-[hsla(var(--text-secondary))]"
              />
            </div>
          )}

        <div
          className="cursor-pointer rounded-lg border border-[hsla(var(--app-border))] p-2"
          onClick={() => {
            clipboard.copy(message.content[0]?.text?.value ?? '')
          }}
        >
          {clipboard.copied ? (
            <CheckIcon size={14} className="text-[hsla(var(--success-bg))]" />
          ) : (
            <CopyIcon
              size={14}
              className="text-[hsla(var(--text-secondary))]"
            />
          )}
        </div>
        <div
          className="cursor-pointer rounded-lg border border-[hsla(var(--app-border))] p-2"
          onClick={() => onDeleteClick(message.thread_id, message.id)}
        >
          <Trash2Icon
            size={14}
            className="text-[hsla(var(--text-secondary))]"
          />
        </div>
      </div>
    </div>
  )
}

export default MessageToolbar
