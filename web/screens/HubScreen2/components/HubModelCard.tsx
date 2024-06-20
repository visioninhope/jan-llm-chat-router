import React from 'react'

import { Button } from '@janhq/joi'

const HubModelCard: React.FC = () => {
  return (
    <div className="flex flex-row justify-between border-b-[1px] border-[hsla(var(--app-border))] pb-3 pt-4 last:border-b-0">
      <div className="flex flex-col gap-2">
        <span>Liam3</span>
        <span>Model 1 Subtitle</span>
      </div>
      <div className="flex flex-col items-end gap-2">
        <Button>Download</Button>
        <span>253 4.07gb</span>
      </div>
    </div>
  )
}

export default HubModelCard
