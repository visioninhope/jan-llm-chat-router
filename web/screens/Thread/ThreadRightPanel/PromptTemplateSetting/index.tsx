import { useCallback } from 'react'

import { SettingComponentProps } from '@janhq/core'

import { useAtomValue } from 'jotai'

import useModels from '@/hooks/useModels'
import useUpdateModelParameters from '@/hooks/useUpdateModelParameters'

import SettingComponent from '../../../../containers/ModelSetting/SettingComponent'

import { activeThreadAtom } from '@/helpers/atoms/Thread.atom'

type Props = {
  componentData: SettingComponentProps[]
}

const PromptTemplateSetting: React.FC<Props> = ({ componentData }) => {
  const activeThread = useAtomValue(activeThreadAtom)

  const { stopModel } = useModels()
  const { updateModelParameter } = useUpdateModelParameters()

  const onValueChanged = useCallback(
    (key: string, value: string | number | boolean) => {
      if (!activeThread) return
      stopModel(activeThread.assistants[0].model)

      updateModelParameter(activeThread, {
        params: { [key]: value },
      })
    },
    [activeThread, stopModel, updateModelParameter]
  )

  return (
    <SettingComponent
      componentProps={componentData}
      onValueUpdated={onValueChanged}
    />
  )
}

export default PromptTemplateSetting
