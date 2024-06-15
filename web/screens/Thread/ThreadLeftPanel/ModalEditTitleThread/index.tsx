import { useCallback, memo, useState } from 'react'

import { Thread } from '@janhq/core'
import { Modal, ModalClose, Button, Input } from '@janhq/joi'
import { PencilIcon } from 'lucide-react'

type Props = {
  thread: Thread
}

const ModalEditTitleThread: React.FC<Props> = ({ thread }) => {
  const [title, setTitle] = useState(thread.title)

  const onUpdateTitle = useCallback(() => {
    // TODO: NamH update title
    console.log(title)
  }, [title])

  return (
    <Modal
      title="Edit title thread"
      trigger={
        <div
          className="flex cursor-pointer items-center space-x-2 px-4 py-2 hover:bg-[hsla(var(--dropdown-menu-hover-bg))]"
          onClick={(e) => e.stopPropagation()}
        >
          <PencilIcon size={16} className="text-[hsla(var(--secondary))]" />
          <span className="text-bold text-[hsla(var(--secondary))]">
            Edit title
          </span>
        </div>
      }
      content={
        <form className="mt-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <div className="mt-4 flex justify-end gap-x-2">
            <ModalClose asChild onClick={(e) => e.stopPropagation()}>
              <Button theme="ghost">Cancel</Button>
            </ModalClose>
            <ModalClose asChild>
              <Button
                type="submit"
                onClick={onUpdateTitle}
                disabled={title.length === 0}
              >
                Save
              </Button>
            </ModalClose>
          </div>
        </form>
      }
    />
  )
}

export default memo(ModalEditTitleThread)
