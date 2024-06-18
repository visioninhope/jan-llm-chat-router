import React, { useCallback, useState } from 'react'

import { TextArea } from '@janhq/joi'
import { useAtomValue } from 'jotai'

import { useDebouncedCallback } from 'use-debounce'

import useUpdateInstruction from '@/hooks/useUpdateInstruction'

import { activeThreadAtom } from '@/helpers/atoms/Thread.atom'

type Props = {
  instructions: string
}

const AssistantSettingContainer: React.FC<Props> = ({
  instructions: assistantInstructions,
}) => {
  const [instructions, setInstructions] = useState(assistantInstructions)
  const activeThread = useAtomValue(activeThreadAtom)
  const { updateInstruction } = useUpdateInstruction()

  const debounced = useDebouncedCallback(async () => {
    updateInstruction(instructions)
  }, 500)

  const onInstructionChanged = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setInstructions(e.target.value)
      debounced()
    },
    [debounced]
  )

  if (!activeThread) return null

  return (
    <div className="flex flex-col space-y-4 p-4">
      <label
        id="assistant-instructions"
        className="mb-2 inline-block font-bold"
      >
        Instructions
      </label>
      <TextArea
        id="assistant-instructions"
        placeholder="Eg. You are a helpful assistant."
        value={instructions}
        onChange={onInstructionChanged}
      />
    </div>
  )
}

export default AssistantSettingContainer
