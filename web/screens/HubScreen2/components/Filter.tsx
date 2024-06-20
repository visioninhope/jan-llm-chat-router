import React from 'react'

import { Button } from '@janhq/joi'
import { Settings2 } from 'lucide-react'

const Filter: React.FC = () => {
  return (
    <div className="sticky top-0 flex flex-col justify-between gap-2 bg-[hsla(var(--app-bg))] pb-6 pt-4 md:flex-row">
      <div className="flex gap-[6px]">
        <Button>All</Button>
        <Button>On-device model</Button>
        <Button>Cloud model</Button>
      </div>
      <div className="flex gap-[6px]">
        <Button>Most popular</Button>
        <Button>
          <Settings2 size={16} />
        </Button>
      </div>
    </div>
  )
}

export default Filter
