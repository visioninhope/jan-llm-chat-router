import { useCallback } from 'react'

import { SettingComponentProps } from '@janhq/core'
import { useAtomValue } from 'jotai'

import { activeModelAtom } from '@/hooks/useActiveModel'

import useModels from '@/hooks/useModels'

import SettingComponentBuilder from '../../../../containers/ModelSetting/SettingComponent'

import { activeThreadAtom } from '@/helpers/atoms/Thread.atom'

type Props = {
  componentData: SettingComponentProps[]
}

const AssistantSetting: React.FC<Props> = ({ componentData }) => {
  const activeThread = useAtomValue(activeThreadAtom)
  const activeModel = useAtomValue(activeModelAtom)
  const { stopModel } = useModels()

  const onValueChanged = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!activeThread) return
      const shouldReloadModel =
        componentData.find((x) => x.key === key)?.requireModelReload ?? false
      if (shouldReloadModel) {
        if (activeModel) stopModel(activeModel.id)
      }

      if (
        activeThread.assistants[0].tools &&
        (key === 'chunk_overlap' || key === 'chunk_size')
      ) {
        if (
          activeThread.assistants[0].tools[0]?.settings.chunk_size <
          activeThread.assistants[0].tools[0]?.settings.chunk_overlap
        ) {
          activeThread.assistants[0].tools[0].settings.chunk_overlap =
            activeThread.assistants[0].tools[0].settings.chunk_size
        }
        if (
          key === 'chunk_size' &&
          value < activeThread.assistants[0].tools[0].settings.chunk_overlap
        ) {
          activeThread.assistants[0].tools[0].settings.chunk_overlap = value
        } else if (
          key === 'chunk_overlap' &&
          value > activeThread.assistants[0].tools[0].settings.chunk_size
        ) {
          activeThread.assistants[0].tools[0].settings.chunk_size = value
        }
      }
    },
    [activeModel, activeThread, componentData, stopModel]
  )

  if (!activeThread) return null
  if (componentData.length === 0) return null

  return (
    <SettingComponentBuilder
      componentProps={componentData}
      onValueUpdated={onValueChanged}
    />
  )
}

export default AssistantSetting
