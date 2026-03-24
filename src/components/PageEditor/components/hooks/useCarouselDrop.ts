import { useState, useRef, useEffect } from 'react'

interface UseCarouselDropProps {
  carouselId: string
  slideIndex: number
  isEditor: boolean
  onDrop: (componentType: string, position: { x: number; y: number }) => void
}

export const useCarouselDrop = ({
  carouselId,
  slideIndex,
  isEditor,
  onDrop
}: UseCarouselDropProps) => {
  const carouselRef = useRef<HTMLDivElement>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    if (!isEditor || !carouselRef.current) return

    const handleDragOver = (e: DragEvent) => {
      if (!isCarouselDrag(e)) return
      
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(true)
    }

    const handleDragLeave = (e: DragEvent) => {
      if (!isCarouselDrag(e)) return
      
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
    }

    const handleDrop = (e: DragEvent) => {
      if (!isCarouselDrag(e)) return
      
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)

      // Get the dragged component type from dataTransfer
      const componentType = e.dataTransfer?.getData('component/type')
      if (componentType) {
        const rect = carouselRef.current!.getBoundingClientRect()
        const position = {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        }
        onDrop(componentType, position)
      }
    }

    const carouselElement = carouselRef.current

    // Add event listeners
    carouselElement.addEventListener('dragover', handleDragOver)
    carouselElement.addEventListener('dragleave', handleDragLeave)
    carouselElement.addEventListener('drop', handleDrop)

    return () => {
      carouselElement.removeEventListener('dragover', handleDragOver)
      carouselElement.removeEventListener('dragleave', handleDragLeave)
      carouselElement.removeEventListener('drop', handleDrop)
    }
  }, [isEditor, carouselId, slideIndex, onDrop])

  const isCarouselDrag = (e: DragEvent): boolean => {
    // Check if this is a component drag (not file or text)
    const types = e.dataTransfer?.types || []
    return types.includes('component/type')
  }

  return {
    carouselRef,
    isDragOver
  }
}