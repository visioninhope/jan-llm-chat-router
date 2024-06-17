import { Fragment } from 'react'

import { Tooltip, Button, Badge } from '@janhq/joi'

import { useActiveModel } from '@/hooks/useActiveModel'

import useModels from '@/hooks/useModels'

import { toGibibytes } from '@/utils/converter'

const Column = ['Name', 'Size', '']

const TableActiveModel = () => {
  const { stopModel } = useModels()
  const { activeModel, stateModel } = useActiveModel()

  return (
    <div className="m-4 mr-0 w-1/2">
      <div className="overflow-hidden rounded-lg border border-[hsla(var(--app-border))]">
        <table className="w-full px-8">
          <thead className="w-full border-b border-[hsla(var(--app-border))]">
            <tr>
              {Column.map((col, i) => {
                return (
                  <th
                    key={i}
                    className="px-4 py-2 text-left font-normal last:text-center"
                  >
                    {col}
                  </th>
                )
              })}
            </tr>
          </thead>
          {activeModel && (
            <Fragment>
              <tbody>
                <tr>
                  <td
                    className="max-w-[200px] px-4 py-2 font-bold"
                    title={activeModel.name}
                  >
                    <p className="line-clamp-2">{activeModel.name}</p>
                  </td>
                  <td className="px-4 py-2">
                    <Badge theme="secondary">
                      {toGibibytes(activeModel.metadata.size)}
                    </Badge>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <Tooltip
                      trigger={
                        <Button
                          theme={
                            stateModel.state === 'stop'
                              ? 'destructive'
                              : 'primary'
                          }
                          onClick={() => {
                            stopModel(activeModel.id)
                          }}
                        >
                          Stop
                        </Button>
                      }
                      content="The API server is running, stop the model will
                      also stop the server"
                    />
                  </td>
                </tr>
              </tbody>
            </Fragment>
          )}
        </table>
      </div>
    </div>
  )
}

export default TableActiveModel
