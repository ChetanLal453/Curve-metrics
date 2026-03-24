'use client'

import React, { useEffect, useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import ReactDOM from 'react-dom'

interface CarouselDropZoneProps {
  carouselId: string
  slideIndex: number
  isEditor: boolean
  isVisible: boolean
  onDrop: () => void
  carouselRect: DOMRect | null
}

const CarouselDropZone: React.FC<CarouselDropZoneProps> = ({
  carouselId,
  slideIndex,
  isEditor,
  isVisible,
  onDrop,
  carouselRect
}) => {
  const droppableId = `carousel:${carouselId}:${slideIndex}`

  const { setNodeRef, isOver } = useDroppable({
    id: droppableId,
    disabled: !isEditor || !isVisible || !carouselRect,
  })

  // Handle drop effect
  useEffect(() => {
    if (isOver) {
      onDrop()
    }
  }, [isOver, onDrop])

  if (!isEditor || !isVisible || !carouselRect) {
    return null
  }

  const dropZoneElement = (
    <div
      ref={setNodeRef}
      className="fixed z-[9999] pointer-events-auto"
      style={{
        left: carouselRect.left,
        top: carouselRect.top,
        width: carouselRect.width,
        height: carouselRect.height,
      }}
    >
      {/* Visual feedback when dragging over */}
      {isOver && (
        <div className="absolute inset-0 bg-blue-100/80 border-4 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
          <div className="bg-white px-6 py-4 rounded-lg shadow-2xl text-blue-600 font-bold text-lg border-2 border-blue-300">
            🎯 Drop to add to carousel slide
          </div>
        </div>
      )}
    </div>
  )

  return ReactDOM.createPortal(dropZoneElement, document.body)
}

export default CarouselDropZone