import React from 'react'
import { Slide } from '@/types/page-editor'

interface CarouselEditorControlsProps {
  slides: Slide[]
  onAddSlide: () => void
  onRemoveSlide: (slideId: string) => void
}

const CarouselEditorControls: React.FC<CarouselEditorControlsProps> = ({
  slides,
  onAddSlide,
  onRemoveSlide
}) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button
          onClick={onAddSlide}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
        >
          ➕ Add Slide
        </button>

        {slides.length > 1 && (
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => onRemoveSlide(slide.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs"
                title={`Remove slide ${index + 1}`}
              >
                ❌ Remove Slide {index + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-600">
        <p>Slides: {slides.length}</p>
        <p>Drag components from the library into slides to add content.</p>
      </div>
    </div>
  )
}

export default CarouselEditorControls
