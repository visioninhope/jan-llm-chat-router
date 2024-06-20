import React from 'react'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from './Carousel'
import SliderItem from './SliderItem'

const data = [
  {
    title: 'Model 1',
    subTitle: 'Model 1 Subtitle',
    image: 'https://via.placeholder.com/150',
    isLocal: false,
    subImage: 'https://via.placeholder.com/150',
  },
  {
    title: 'Model 2',
    subTitle: 'Model 1 Subtitle',
    image: 'https://via.placeholder.com/150',
    isLocal: true,
    subImage: 'https://via.placeholder.com/150',
  },
  {
    title: 'Model ',
    subTitle: 'Model 1 Subtitle',
    image: 'https://via.placeholder.com/150',
    isLocal: false,
    subImage: 'https://via.placeholder.com/150',
  },
  {
    title: 'Model 4',
    subTitle: 'Model 1 Subtitle',
    image: 'https://via.placeholder.com/150',
    isLocal: true,
    subImage: 'https://via.placeholder.com/150',
  },
  {
    title: 'Model 5',
    subTitle: 'Model 1 Subtitle',
    image: 'https://via.placeholder.com/150',
    isLocal: false,
    subImage: 'https://via.placeholder.com/150',
  },
]

const Slider: React.FC = () => {
  return (
    <Carousel
      opts={{
        align: 'start',
      }}
      className="my-12"
    >
      <CarouselContent>
        {data.map((item, index) => (
          <CarouselItem className="grid grid-cols-2 gap-4 px-16" key={index}>
            <SliderItem />
            <SliderItem />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

export default Slider
