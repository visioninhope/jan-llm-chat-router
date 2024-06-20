import React from 'react'

import Filter from './components/Filter'
import HubModelCard from './components/HubModelCard'
import ModelSearchBar from './components/ModelSearchBar'
import Slider from './components/Slider'

const HubScreen2: React.FC = () => {
  return (
    <div className="h-full w-full overflow-hidden px-1.5">
      <div className="h-full w-full gap-12 overflow-x-hidden rounded-md border border-[hsla(var(--app-border))] bg-[hsla(var(--app-bg))] text-[hsla(var(--text-primary))]">
        <ModelSearchBar />
        <Slider />
        <div className="mx-4 px-12">
          <Filter />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
          <HubModelCard />
        </div>
      </div>
    </div>
  )
}

export default HubScreen2
