import { Fragment, useCallback, useMemo } from 'react'

import { SettingComponentProps, SliderComponentProps } from '@janhq/core'
import { Accordion, AccordionItem } from '@janhq/joi'
import { useAtomValue } from 'jotai'

import EngineSetting from '@/containers/EngineSetting'
import ModelSetting from '@/containers/ModelSetting'

import { getConfigurationsData } from '@/utils/componentSettings'
import { toRuntimeParams, toSettingParams } from '@/utils/modelParam'

import PromptTemplateSetting from '../PromptTemplateSetting'

import { selectedModelAtom } from '@/helpers/atoms/Model.atom'

const ModelSettingContainer: React.FC = () => {
  const selectedModel = useAtomValue(selectedModelAtom)

  const modelSettings = useMemo(() => {
    const model = selectedModel
    if (!model) return
    // runtime setting
    const modelRuntimeParams = toRuntimeParams(model)
    const componentDataRuntimeSetting = getConfigurationsData(
      modelRuntimeParams,
      model
    )

    // engine setting
    const modelEngineParams = toSettingParams(model)
    const componentDataEngineSetting = getConfigurationsData(
      modelEngineParams,
      model
    ).filter((x) => x.key !== 'prompt_template' && x.key !== 'embedding')

    const promptTemplateSettings = getConfigurationsData(
      modelEngineParams,
      model
    ).filter((x) => x.key === 'prompt_template')

    // the max value of max token has to follow context length
    const maxTokens = componentDataRuntimeSetting.find(
      (x) => x.key === 'max_tokens'
    )
    const contextLength = componentDataEngineSetting.find(
      (x) => x.key === 'ctx_len'
    )
    if (maxTokens && contextLength) {
      // replace maxToken to componentDataRuntimeSetting
      const updatedComponentDataRuntimeSetting: SettingComponentProps[] =
        componentDataRuntimeSetting.map((settingComponentProps) => {
          if (settingComponentProps.key !== 'max_tokens')
            return settingComponentProps
          const contextLengthValue = Number(contextLength.controllerProps.value)
          const maxTokenValue = Number(
            settingComponentProps.controllerProps.value
          )
          const controllerProps =
            settingComponentProps.controllerProps as SliderComponentProps
          const sliderProps: SliderComponentProps = {
            ...controllerProps,
            max: contextLengthValue,
            value: Math.min(maxTokenValue, contextLengthValue),
          }

          const updatedSettingProps: SettingComponentProps = {
            ...settingComponentProps,
            controllerProps: sliderProps,
          }
          return updatedSettingProps
        })

      return {
        runtimeSettings: updatedComponentDataRuntimeSetting,
        engineSettings: componentDataEngineSetting,
        promptTemplateSettings: promptTemplateSettings,
      }
    }

    return {
      runtimeSettings: componentDataRuntimeSetting,
      engineSettings: componentDataEngineSetting,
      promptTemplateSettings: promptTemplateSettings,
    }
  }, [selectedModel])

  const onValueChanged = useCallback(
    (key: string, value: string | number | boolean) => {
      // // TODO: NamH check if we need to stop the model
      // stopModel(activeThread.assistants[0].model)
      // updateModelParameter(activeThread, {
      //   params: { [key]: value },
      // })
      // if (
      //   activeThread.assistants[0].model.parameters.max_tokens &&
      //   activeThread.assistants[0].model.settings.ctx_len
      // ) {
      //   if (
      //     key === 'max_tokens' &&
      //     Number(value) > activeThread.assistants[0].model.settings.ctx_len
      //   ) {
      //     updateModelParameter(activeThread, {
      //       params: {
      //         max_tokens: activeThread.assistants[0].model.settings.ctx_len,
      //       },
      //     })
      //   }
      //   if (
      //     key === 'ctx_len' &&
      //     Number(value) < activeThread.assistants[0].model.parameters.max_tokens
      //   ) {
      //     updateModelParameter(activeThread, {
      //       params: {
      //         max_tokens: activeThread.assistants[0].model.settings.ctx_len,
      //       },
      //     })
      //   }
      // }
    },
    []
  )

  if (!modelSettings) return null

  return (
    <Fragment>
      <Accordion defaultValue={[]}>
        {modelSettings.runtimeSettings.length !== 0 && (
          <AccordionItem
            title="Inference Parameters"
            value="Inference Parameters"
          >
            <ModelSetting
              componentProps={modelSettings.runtimeSettings}
              onValueChanged={onValueChanged}
            />
          </AccordionItem>
        )}

        {modelSettings.promptTemplateSettings.length !== 0 && (
          <AccordionItem title="Model Parameters" value="Model Parameters">
            <PromptTemplateSetting
              componentData={modelSettings.promptTemplateSettings}
            />
          </AccordionItem>
        )}

        {modelSettings.engineSettings.length !== 0 && (
          <AccordionItem title="Engine Parameters" value="Engine Parameters">
            <EngineSetting
              componentData={modelSettings.engineSettings}
              onValueChanged={onValueChanged}
            />
          </AccordionItem>
        )}
      </Accordion>
    </Fragment>
  )
}

export default ModelSettingContainer
