import React from 'react'

import { Button } from '@janhq/joi'

const SliderItem: React.FC = () => {
  return (
    <div className="flex justify-between rounded-2xl border border-[hsla(var(--app-border))] p-4">
      <div className="flex flex-col gap-1.5">
        <span>title</span>
        <div className="flex items-center gap-1.5">
          <div className="h-5 w-5 rounded-full bg-green-400" />
          <span>subtitle</span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-4">
        <div className="h-12 w-12 rounded-full bg-red-400" />
        <Button>Set up</Button>
      </div>
    </div>
  )
}

export default SliderItem
