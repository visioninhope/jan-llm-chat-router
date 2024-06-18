import { memo, useCallback, useMemo, useState } from 'react'

import { Model } from '@janhq/core'
import { Badge, Button, useClickOutside } from '@janhq/joi'

import { useAtomValue } from 'jotai'
import {
  MoreVerticalIcon,
  PlayIcon,
  StopCircleIcon,
  Trash2Icon,
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { engineHasLogo } from '@/containers/ModelDropdown'

import { useActiveModel } from '@/hooks/useActiveModel'

import useModels from '@/hooks/useModels'

import { toGibibytes } from '@/utils/converter'

import { activeModelsAtom } from '@/helpers/atoms/Model.atom'

type Props = {
  model: Model
}

const ModelItem: React.FC<Props> = ({ model }) => {
  const activeModels = useAtomValue(activeModelsAtom)
  const { startModel, stateModel } = useActiveModel()
  const isActiveModel = stateModel.model?.id === model.id
  const [more, setMore] = useState(false)
  const { stopModel, deleteModel } = useModels()

  const [menu, setMenu] = useState<HTMLDivElement | null>(null)
  const [toggle, setToggle] = useState<HTMLDivElement | null>(null)
  useClickOutside(() => setMore(false), null, [menu, toggle])

  const isModelActived = useMemo(() => {
    return activeModels.map((m) => m.model).includes(model.id)
  }, [activeModels, model.id])

  const onModelActionClick = useCallback(
    (modelId: string) => {
      if (isModelActived) {
        stopModel(modelId)
      } else {
        startModel(modelId)
      }
    },
    [isModelActived, startModel, stopModel]
  )

  const onDeleteModelClicked = useCallback(
    async (modelId: string) => {
      await stopModel(modelId)
      await deleteModel(modelId)
    },
    [stopModel, deleteModel]
  )

  return (
    <div className="border border-b-0 border-[hsla(var(--app-border))] bg-[hsla(var(--tertiary-bg))] p-4 first:rounded-t-lg last:rounded-b-lg last:border-b">
      <div className="flex flex-col items-start justify-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-1/2 gap-x-8">
          {engineHasLogo.map((x) => {
            if (x === model.engine) {
              return (
                <div className="relative overflow-hidden rounded-full" key={x}>
                  <img
                    src={`images/ModelProvider/${x}.svg`}
                    alt="Model Provider"
                    width={24}
                    height={24}
                    className="object-cover"
                  />
                </div>
              )
            }
          })}
          <div className="flex w-full items-center justify-between">
            <h6
              className={twMerge(
                'line-clamp-1 max-w-[200px] font-medium',
                model.engine !== 'cortex.llamacpp' &&
                  'max-w-none text-[hsla(var(--text-secondary))]'
              )}
              title={model.id}
            >
              {model.id}
            </h6>
            {model.engine === 'cortex.llamacpp' && (
              <div className="flex gap-x-8">
                <p
                  className="line-clamp-1 max-w-[120px] text-[hsla(var(--text-secondary))] xl:max-w-none"
                  title={model.id}
                >
                  {model.id}
                </p>
              </div>
            )}
          </div>
        </div>

        {model.engine === 'cortex.llamacpp' && (
          <div className="flex gap-x-4">
            <Badge theme="secondary" className="sm:mr-16">
              {toGibibytes(model.metadata?.size)}
            </Badge>

            <div className="flex items-center gap-x-4">
              {stateModel.loading && stateModel.model?.id === model.id ? (
                <Badge
                  className="inline-flex items-center space-x-2"
                  theme="secondary"
                >
                  <span className="h-2 w-2 rounded-full bg-gray-500" />
                  <span className="capitalize">
                    {stateModel.state === 'start'
                      ? 'Starting...'
                      : 'Stopping...'}
                  </span>
                </Badge>
              ) : isModelActived ? (
                <Badge
                  theme="success"
                  variant="soft"
                  className="inline-flex items-center space-x-2"
                >
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  <span>Active</span>
                </Badge>
              ) : (
                <Badge
                  theme="secondary"
                  className="inline-flex items-center space-x-2"
                >
                  <span className="h-2 w-2 rounded-full bg-gray-500" />
                  <span>Inactive</span>
                </Badge>
              )}
              <div
                className="inline-flex cursor-pointer"
                ref={setToggle}
                onClick={() => {
                  setMore(!more)
                }}
              >
                <Button theme="icon">
                  <MoreVerticalIcon />
                </Button>
                {more && (
                  <div
                    className="absolute right-4 top-10 z-20 w-52 overflow-hidden rounded-lg border border-[hsla(var(--app-border))] bg-[hsla(var(--app-bg))] shadow-lg"
                    ref={setMenu}
                  >
                    <div
                      className={twMerge(
                        'flex items-center space-x-2 px-4 py-2 hover:bg-[hsla(var(--dropdown-menu-hover-bg))]',
                        !isModelActived &&
                          'pointer-events-none cursor-not-allowed opacity-40'
                      )}
                      onClick={() => {
                        onModelActionClick(model.id)
                        setMore(false)
                      }}
                    >
                      {isModelActived ? (
                        <StopCircleIcon
                          size={16}
                          className="text-[hsla(var(--text-secondary))]"
                        />
                      ) : (
                        <PlayIcon
                          size={16}
                          className="text-[hsla(var(--text-secondary))]"
                        />
                      )}
                      <span className="text-bold capitalize">
                        {isActiveModel ? stateModel.state : 'Start'}
                        &nbsp;Model
                      </span>
                    </div>
                    <div
                      className={twMerge(
                        'pointer-events-none flex cursor-pointer items-center space-x-2 px-4 py-2 opacity-40 hover:bg-[hsla(var(--dropdown-menu-hover-bg))]'
                      )}
                      onClick={() => onDeleteModelClicked(model.id)}
                    >
                      <Trash2Icon
                        size={16}
                        className="text-[hsla(var(--destructive-bg))]"
                      />
                      <span className="text-bold text-[hsla(var(--destructive-bg))]">
                        Delete Model
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(ModelItem)
