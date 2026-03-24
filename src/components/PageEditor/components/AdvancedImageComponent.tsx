'use client'

import React, { useState, useRef, useCallback } from 'react'
import * as FaIcons from 'react-icons/fa'

interface AdvancedImageComponentProps {
  src?: string
  alt?: string
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  borderRadius?: number
  shape?: 'default' | 'circle' | 'rounded' | 'square' | 'hexagon' | 'diamond' | 'star' | 'heart' | 'parallelogram' | 'triangle' | 'blob' | 'speech-bubble' | 'cross' | 'custom'
  customShape?: string
  
  showGradientBorder?: boolean
  gradientBorderColors?: string
  gradientBorderDirection?: string
  gradientBorderWidth?: string
  gradientBorderType?: 'linear' | 'radial' | 'conic'
  
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  width?: string
  height?: string
  alignment?: 'left' | 'center' | 'right'
  
  componentPositionX?: string
  componentPositionY?: string
  imageZoom?: number
  
  caption?: string
  captionPosition?: 'bottom' | 'top' | 'overlay'
  captionAlignment?: 'left' | 'center' | 'right'
  showOverlay?: boolean
  overlayColor?: string
  overlayOpacity?: number
  overlayText?: string
  hoverEffect?: 'none' | 'zoom' | 'fade' | 'grayscale' | 'brighten' | 'blur' | 'rotate' | 'flip'
  hoverZoom?: number
  hoverBrightness?: number
  hoverDuration?: number
  filter?: string
  lazyLoad?: boolean
  showLightbox?: boolean
  className?: string
  style?: React.CSSProperties
  onUpdate?: (props: any) => void
  onSelect?: () => void
  [key: string]: any
}

const IMAGE_UPLOAD_URL = '/api/media/upload'

export const advancedImageDefaultProps = {
  src: '',
  alt: 'Image',
  objectFit: 'cover' as const,
  objectPosition: 'center',
  borderRadius: 0,
  shape: 'default' as const,
  customShape: '',
  
  showGradientBorder: false,
  gradientBorderColors: '#7f00ff, #00dbde, #7f00ff',
  gradientBorderDirection: '135deg',
  gradientBorderWidth: '10px',
  gradientBorderType: 'conic' as const,
  
  shadow: 'none' as const,
  width: '100%',
  height: 'auto',
  alignment: 'left' as const,
  
  componentPositionX: '0px',
  componentPositionY: '0px',
  imageZoom: 1,
  
  caption: '',
  captionPosition: 'bottom' as const,
  captionAlignment: 'center' as const,
  showOverlay: false,
  overlayColor: '#000000',
  overlayOpacity: 0.3,
  overlayText: '',
  hoverEffect: 'none' as const,
  hoverZoom: 1.1,
  hoverBrightness: 1.2,
  hoverDuration: 0.3,
  filter: 'none',
  lazyLoad: false,
  showLightbox: false,
}

export const advancedImageSchema = {
  properties: {
    src: {
      type: 'image',
      label: 'Image Source',
      default: '',
      description: 'Upload or enter image URL',
      category: 'Content',
    },
    alt: {
      type: 'text',
      label: 'Alt Text',
      default: 'Image',
      description: 'Alternative text for accessibility',
      category: 'Content',
    },
    objectFit: {
      type: 'select',
      label: 'Object Fit',
      default: 'cover',
      options: [
        { value: 'cover', label: 'Cover' },
        { value: 'contain', label: 'Contain' },
        { value: 'fill', label: 'Fill' },
        { value: 'none', label: 'None' },
        { value: 'scale-down', label: 'Scale Down' },
      ],
      category: 'Layout',
    },
    objectPosition: {
      type: 'select',
      label: 'Image Position Inside Container',
      default: 'center',
      options: [
        { value: 'center', label: 'Center' },
        { value: 'top', label: 'Top' },
        { value: 'bottom', label: 'Bottom' },
        { value: 'left', label: 'Left' },
        { value: 'right', label: 'Right' },
        { value: 'top left', label: 'Top Left' },
        { value: 'top right', label: 'Top Right' },
        { value: 'bottom left', label: 'Bottom Left' },
        { value: 'bottom right', label: 'Bottom Right' },
      ],
      category: 'Layout',
    },
    
    componentPositionX: {
      type: 'text',
      label: 'Horizontal Position',
      default: advancedImageDefaultProps.componentPositionX,
      description: 'Move entire component left/right (e.g., -50px, 100px, 20%, -10%). Positive = right, Negative = left',
      placeholder: 'e.g., -50px, 100px, 20%',
      category: 'Position',
    },
    
    componentPositionY: {
      type: 'text',
      label: 'Vertical Position',
      default: advancedImageDefaultProps.componentPositionY,
      description: 'Move entire component up/down (e.g., -30px, 50px, -15%, 10%). Positive = down, Negative = up',
      placeholder: 'e.g., -30px, 50px, -15%',
      category: 'Position',
    },
    
    imageZoom: {
      type: 'number',
      label: 'Image Zoom',
      default: advancedImageDefaultProps.imageZoom,
      min: 0.1,
      max: 3,
      step: 0.1,
      description: 'Zoom in/out the image inside container (1 = normal, 1.5 = 150% zoom, 0.8 = 80% zoom)',
      category: 'Layout',
    },
    
    borderRadius: {
      type: 'number',
      label: 'Border Radius (px)',
      default: 0,
      min: 0,
      max: 100,
      step: 1,
      category: 'Style',
    },
    
    shape: {
      type: 'select',
      label: 'Shape',
      default: 'default',
      options: [
        { value: 'default', label: 'Default' },
        { value: 'circle', label: 'Circle' },
        { value: 'rounded', label: 'Rounded' },
        { value: 'square', label: 'Square' },
        { value: 'hexagon', label: 'Hexagon' },
        { value: 'diamond', label: 'Diamond' },
        { value: 'star', label: 'Star' },
        { value: 'heart', label: 'Heart' },
        { value: 'parallelogram', label: 'Parallelogram' },
        { value: 'triangle', label: 'Triangle' },
        { value: 'blob', label: 'Blob' },
        { value: 'speech-bubble', label: 'Speech Bubble' },
        { value: 'cross', label: 'Cross' },
        { value: 'custom', label: 'Custom Shape' },
      ],
      category: 'Style',
    },
    
    customShape: {
      type: 'text',
      label: 'Custom Shape',
      default: '',
      description: 'CSS clip-path value (e.g., polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%))',
      category: 'Style',
      showIf: (props: any) => props.shape === 'custom',
    },
    
    showGradientBorder: {
      type: 'toggle',
      label: 'Show Gradient Border',
      default: advancedImageDefaultProps.showGradientBorder,
      description: 'Add gradient border around image',
      category: 'Style',
    },
    gradientBorderColors: {
      type: 'text',
      label: 'Border Colors',
      default: advancedImageDefaultProps.gradientBorderColors,
      description: 'Comma separated colors (e.g., #7f00ff, #00dbde, #7f00ff)',
      category: 'Style',
      showIf: (props: any) => props.showGradientBorder,
    },
    gradientBorderDirection: {
      type: 'select',
      label: 'Border Direction',
      default: advancedImageDefaultProps.gradientBorderDirection,
      options: [
        { value: 'to right', label: 'Left to Right' },
        { value: 'to left', label: 'Right to Left' },
        { value: 'to bottom', label: 'Top to Bottom' },
        { value: 'to top', label: 'Bottom to Top' },
        { value: '135deg', label: 'Diagonal (135deg)' },
        { value: '45deg', label: 'Diagonal (45deg)' },
        { value: '90deg', label: 'Vertical (90deg)' },
        { value: '180deg', label: 'Horizontal (180deg)' },
      ],
      category: 'Style',
      showIf: (props: any) => props.showGradientBorder && props.gradientBorderType !== 'conic',
    },
    gradientBorderWidth: {
      type: 'text',
      label: 'Border Width',
      default: advancedImageDefaultProps.gradientBorderWidth,
      description: 'Enter any CSS width value (e.g., 5px, 10px, 15px, 2rem, 1cm, 0.5in, 5%, 10vw)',
      placeholder: 'Enter width (e.g., 10px)',
      category: 'Style',
      showIf: (props: any) => props.showGradientBorder,
    },
    gradientBorderType: {
      type: 'select',
      label: 'Border Type',
      default: advancedImageDefaultProps.gradientBorderType,
      options: [
        { value: 'linear', label: 'Linear' },
        { value: 'radial', label: 'Radial' },
        { value: 'conic', label: 'Conic (Circular)' },
      ],
      category: 'Style',
      showIf: (props: any) => props.showGradientBorder,
    },
    
    shadow: {
      type: 'select',
      label: 'Shadow',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'sm', label: 'Small' },
        { value: 'md', label: 'Medium' },
        { value: 'lg', label: 'Large' },
        { value: 'xl', label: 'Extra Large' },
      ],
      category: 'Style',
    },
    width: {
      type: 'text',
      label: 'Width',
      default: '100%',
      placeholder: '100%, 300px, 50vw',
      category: 'Layout',
    },
    height: {
      type: 'text',
      label: 'Height',
      default: 'auto',
      placeholder: 'auto, 200px, 50vh',
      category: 'Layout',
    },
    alignment: {
      type: 'select',
      label: 'Alignment',
      default: 'left',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Layout',
    },
    caption: {
      type: 'text',
      label: 'Caption',
      default: '',
      description: 'Optional image caption',
      category: 'Content',
    },
    captionPosition: {
      type: 'select',
      label: 'Caption Position',
      default: 'bottom',
      options: [
        { value: 'bottom', label: 'Bottom' },
        { value: 'top', label: 'Top' },
        { value: 'overlay', label: 'Overlay' },
      ],
      category: 'Layout',
    },
    captionAlignment: {
      type: 'select',
      label: 'Caption Alignment',
      default: 'center',
      options: [
        { value: 'left', label: 'Left' },
        { value: 'center', label: 'Center' },
        { value: 'right', label: 'Right' },
      ],
      category: 'Layout',
    },
    showOverlay: {
      type: 'toggle',
      label: 'Show Overlay',
      default: false,
      category: 'Style',
    },
    overlayColor: {
      type: 'color',
      label: 'Overlay Color',
      default: '#000000',
      category: 'Style',
    },
    overlayOpacity: {
      type: 'number',
      label: 'Overlay Opacity',
      default: 0.3,
      min: 0,
      max: 1,
      step: 0.1,
      category: 'Style',
    },
    overlayText: {
      type: 'text',
      label: 'Overlay Text',
      default: '',
      description: 'Text to show on overlay',
      category: 'Content',
    },
    
    hoverEffect: {
      type: 'select',
      label: 'Hover Effect',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'zoom', label: 'Zoom In' },
        { value: 'fade', label: 'Fade' },
        { value: 'grayscale', label: 'Grayscale' },
        { value: 'brighten', label: 'Brighten' },
        { value: 'blur', label: 'Blur' },
        { value: 'rotate', label: 'Rotate' },
        { value: 'flip', label: 'Flip Horizontal' },
      ],
      category: 'Effects',
    },
    
    hoverZoom: {
      type: 'number',
      label: 'Hover Zoom Scale',
      default: 1.1,
      min: 1,
      max: 2,
      step: 0.1,
      category: 'Effects',
    },
    hoverBrightness: {
      type: 'number',
      label: 'Hover Brightness',
      default: 1.2,
      min: 1,
      max: 2,
      step: 0.1,
      category: 'Effects',
    },
    hoverDuration: {
      type: 'number',
      label: 'Hover Duration (s)',
      default: 0.3,
      min: 0.1,
      max: 2,
      step: 0.1,
      category: 'Effects',
    },
    filter: {
      type: 'select',
      label: 'Filter',
      default: 'none',
      options: [
        { value: 'none', label: 'None' },
        { value: 'grayscale', label: 'Grayscale' },
        { value: 'sepia', label: 'Sepia' },
        { value: 'invert', label: 'Invert' },
        { value: 'blur', label: 'Blur' },
        { value: 'brightness', label: 'Brightness' },
        { value: 'contrast', label: 'Contrast' },
        { value: 'saturate', label: 'Saturate' },
        { value: 'hue-rotate', label: 'Hue Rotate' },
      ],
      category: 'Effects',
    },
    lazyLoad: {
      type: 'toggle',
      label: 'Lazy Load',
      default: false,
      category: 'Performance',
    },
    showLightbox: {
      type: 'toggle',
      label: 'Show Lightbox',
      default: false,
      category: 'Features',
    },
  },
}

const AdvancedImageComponent: React.FC<AdvancedImageComponentProps> = ({
  src = '',
  alt = 'Image',
  objectFit = 'cover',
  objectPosition = 'center',
  borderRadius = 0,
  shape = 'default',
  customShape = '',
  
  showGradientBorder = false,
  gradientBorderColors = '#7f00ff, #00dbde, #7f00ff',
  gradientBorderDirection = '135deg',
  gradientBorderWidth = '10px',
  gradientBorderType = 'conic',
  
  shadow = 'none',
  width = '100%',
  height = 'auto',
  alignment = 'left',
  
  componentPositionX = '0px',
  componentPositionY = '0px',
  imageZoom = 1,
  
  caption = '',
  captionPosition = 'bottom',
  captionAlignment = 'center',
  showOverlay = false,
  overlayColor = '#000000',
  overlayOpacity = 0.3,
  overlayText = '',
  hoverEffect = 'none',
  hoverZoom = 1.1,
  hoverBrightness = 1.2,
  hoverDuration = 0.3,
  filter = 'none',
  lazyLoad = false,
  showLightbox = false,
  className = '',
  style = {},
  onUpdate,
  onSelect,
  ...props
}) => {
  const [isUploading, setIsUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const [showLightboxModal, setShowLightboxModal] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const domImageProps = React.useMemo(
    () =>
      Object.fromEntries(
        Object.entries(props).filter(([key]) => key.startsWith('data-') || key.startsWith('aria-') || key === 'title'),
      ),
    [props],
  )

  const getGradientBorderString = useCallback((): string => {
    if (!showGradientBorder) return ''
    
    const colors = gradientBorderColors
      .split(',')
      .map(color => color.trim())
      .join(', ')
    
    switch (gradientBorderType) {
      case 'radial':
        return `radial-gradient(circle, ${colors})`
      case 'conic':
        return `conic-gradient(from 180deg, ${colors})`
      case 'linear':
      default:
        return `linear-gradient(${gradientBorderDirection}, ${colors})`
    }
  }, [showGradientBorder, gradientBorderColors, gradientBorderDirection, gradientBorderType])

  const parseBorderWidth = useCallback((width: string): string => {
    if (!width || width.trim() === '') return '10px'
    
    const cleanWidth = width.trim()
    const validUnits = ['px', 'rem', 'em', '%', 'vw', 'vh', 'cm', 'mm', 'in', 'pt', 'pc']
    
    for (const unit of validUnits) {
      if (cleanWidth.endsWith(unit)) {
        const numValue = parseFloat(cleanWidth.replace(unit, ''))
        if (!isNaN(numValue) && numValue >= 0) {
          return cleanWidth
        }
      }
    }
    
    const numValue = parseFloat(cleanWidth)
    if (!isNaN(numValue) && numValue >= 0) {
      return `${numValue}px`
    }
    
    return '10px'
  }, [])

  const parseComponentPosition = useCallback((value: string): string => {
    if (!value || value.trim() === '') return '0px'
    
    const cleanValue = value.trim()
    
    if (cleanValue.endsWith('%')) {
      const numValue = parseFloat(cleanValue.replace('%', ''))
      if (!isNaN(numValue)) {
        return `${numValue}%`
      }
    }
    
    if (cleanValue.endsWith('px')) {
      const numValue = parseFloat(cleanValue.replace('px', ''))
      if (!isNaN(numValue)) {
        return `${numValue}px`
      }
    }
    
    const numValue = parseFloat(cleanValue)
    if (!isNaN(numValue)) {
      return `${numValue}px`
    }
    
    return '0px'
  }, [])

  const getComponentTransform = useCallback((): React.CSSProperties => {
    const translateX = parseComponentPosition(componentPositionX)
    const translateY = parseComponentPosition(componentPositionY)
    
    if (translateX === '0px' && translateY === '0px') {
      return {}
    }
    
    return {
      transform: `translate(${translateX}, ${translateY})`,
    }
  }, [componentPositionX, componentPositionY, parseComponentPosition])

  const getImageTransform = useCallback((): React.CSSProperties => {
    if (imageZoom === 1) return {}
    
    return {
      transform: `scale(${imageZoom})`,
      transformOrigin: objectPosition,
    }
  }, [imageZoom, objectPosition])

  const parsedBorderWidth = parseBorderWidth(gradientBorderWidth)

  const uploadToBackend = async (file: File) => {
    setIsUploading(true)
    setUploadProgress(0)
    setImageError(false)
    
    const formData = new FormData()
    formData.append('image', file)

    try {
      const simulateProgress = () => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10
          setUploadProgress(progress)
          if (progress >= 90) {
            clearInterval(interval)
          }
        }, 100)
        return interval
      }

      const progressInterval = simulateProgress()

      const response = await fetch(IMAGE_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const data = await response.json()
      
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const uploadedImageUrl = data.imageUrl || data.file?.url || data.uploaded?.[0]?.url || data.media?.[0]?.url

      if (uploadedImageUrl) {
        onUpdate?.({ 
          src: uploadedImageUrl,
          alt: alt || file.name,
          ...(data.metadata && {
            imageWidth: data.metadata.width,
            imageHeight: data.metadata.height
          })
        })
      }
      
      setIsUploading(false)
      setUploadProgress(0)
      
    } catch (error) {
      console.error('Upload error:', error)
      setImageError(true)
      setIsUploading(false)
      setUploadProgress(0)
      
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target?.result as string
        onUpdate?.({ src: base64, alt: file.name })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileUpload = useCallback((file: File) => {
    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size should be less than 10MB')
      return
    }

    uploadToBackend(file)
  }, [onUpdate, alt])

  const handleImageClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (showLightbox && src) {
      setShowLightboxModal(true)
    }
    onSelect?.()
  }, [onSelect, showLightbox, src])

  const handleUploadClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    fileInputRef.current?.click()
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [handleFileUpload])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      handleFileUpload(file)
    }
  }, [handleFileUpload])

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setIsLoaded(false)
    setImageError(true)
  }, [])

  const closeLightbox = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setShowLightboxModal(false)
  }, [])

  const getShapeValue = () => {
    switch (shape) {
      case 'circle':
        return { 
          borderRadius: '50%', 
          clipPath: 'none',
          aspectRatio: '1 / 1',
        }
      case 'rounded':
        return { 
          borderRadius: `${borderRadius}px`, 
          clipPath: 'none',
          aspectRatio: 'auto'
        }
      case 'square':
        return { 
          borderRadius: '0', 
          clipPath: 'none',
          aspectRatio: '1 / 1'
        }
      case 'hexagon':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
          aspectRatio: '1 / 1'
        }
      case 'diamond':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          aspectRatio: '1 / 1'
        }
      case 'star':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
          aspectRatio: '1 / 1'
        }
      case 'heart':
        return { 
          borderRadius: '0', 
          clipPath: 'path("M20,35.09,4.55,19.64a8.5,8.5,0,0,1-.13-12l.13-.13a8.72,8.72,0,0,1,12.14,0L20,11.77l3.3-3.3a8.09,8.09,0,0,1,5.83-2.58,8.89,8.89,0,0,1,6.31,2.58,8.5,8.5,0,0,1,.13,12l-.13.13Z")',
          aspectRatio: '1 / 1'
        }
      case 'parallelogram':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
          aspectRatio: '3 / 2'
        }
      case 'triangle':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          aspectRatio: '1 / 1'
        }
      case 'blob':
        return { 
          borderRadius: '50%', 
          clipPath: 'none',
          aspectRatio: '1 / 1'
        }
      case 'speech-bubble':
        return { 
          borderRadius: '20px', 
          clipPath: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
          aspectRatio: '3 / 2'
        }
      case 'cross':
        return { 
          borderRadius: '0', 
          clipPath: 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
          aspectRatio: '1 / 1'
        }
      case 'custom':
        return { 
          borderRadius: '0', 
          clipPath: customShape || 'none',
          aspectRatio: 'auto'
        }
      default:
        return { 
          borderRadius: `${borderRadius}px`, 
          clipPath: 'none',
          aspectRatio: 'auto'
        }
    }
  }

  const getShadowValue = () => {
    switch (shadow) {
      case 'sm': return '0 1px 3px rgba(0,0,0,0.12)'
      case 'md': return '0 4px 6px rgba(0,0,0,0.1)'
      case 'lg': return '0 10px 25px rgba(0,0,0,0.15)'
      case 'xl': return '0 20px 40px rgba(0,0,0,0.2)'
      default: return 'none'
    }
  }

  const getHoverStyles = () => {
    if (!isHovered || hoverEffect === 'none') return {}
    
    const baseTransition = `all ${hoverDuration}s ease`
    
    switch (hoverEffect) {
      case 'zoom':
        return {
          transform: `scale(${hoverZoom})`,
          transition: baseTransition,
        }
      case 'fade':
        return {
          opacity: 0.8,
          transition: baseTransition,
        }
      case 'grayscale':
        return {
          filter: 'grayscale(100%)',
          transition: baseTransition,
        }
      case 'brighten':
        return {
          filter: `brightness(${hoverBrightness})`,
          transition: baseTransition,
        }
      case 'blur':
        return {
          filter: 'blur(2px)',
          transition: baseTransition,
        }
      case 'rotate':
        return {
          transform: 'rotate(5deg)',
          transition: baseTransition,
        }
      case 'flip':
        return {
          transform: 'scaleX(-1)',
          transition: baseTransition,
        }
      default:
        return {}
    }
  }

  const getFilterStyle = () => {
    switch (filter) {
      case 'grayscale': return 'grayscale(100%)'
      case 'sepia': return 'sepia(100%)'
      case 'invert': return 'invert(100%)'
      case 'blur': return 'blur(2px)'
      case 'brightness': return 'brightness(1.2)'
      case 'contrast': return 'contrast(1.2)'
      case 'saturate': return 'saturate(1.5)'
      case 'hue-rotate': return 'hue-rotate(90deg)'
      default: return 'none'
    }
  }

  const shapeStyle = getShapeValue()

  const containerStyle: React.CSSProperties = {
    display: 'inline-flex',
    flexDirection: captionPosition === 'top' ? 'column-reverse' : 'column',
    justifyContent: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
    alignItems: alignment === 'center' ? 'center' : alignment === 'right' ? 'flex-end' : 'flex-start',
    width: width,
    position: 'relative',
    ...getComponentTransform(),
    transition: 'transform 0.3s ease',
    ...style
  }

  const imageWrapperStyle: React.CSSProperties = {
    width: '100%',
    height: height === 'auto' ? (shape === 'circle' || shape === 'square' ? '100%' : undefined) : height,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    boxShadow: getShadowValue(),
    cursor: showLightbox && src ? 'zoom-in' : 'pointer',
    aspectRatio: shapeStyle.aspectRatio,
    ...(shape === 'circle' && {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }),
    
    ...(showGradientBorder && {
      position: 'relative',
      padding: parsedBorderWidth,
      background: getGradientBorderString(),
      display: 'inline-flex',
    })
  }

  const innerContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: shape === 'circle' ? '50%' : shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    flex: 1,
  }

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: objectFit,
    objectPosition: objectPosition,
    display: 'block',
    filter: getFilterStyle(),
    transition: `all ${hoverDuration}s ease`,
    ...getHoverStyles(),
    ...getImageTransform(),
    ...(shape === 'circle' && {
      objectFit: 'cover',
      aspectRatio: '1 / 1',
    })
  }

  const captionStyle: React.CSSProperties = {
    marginTop: captionPosition === 'bottom' ? '8px' : 0,
    marginBottom: captionPosition === 'top' ? '8px' : 0,
    fontSize: '14px',
    color: '#666',
    textAlign: captionAlignment,
    width: '100%',
    padding: '4px 0',
    fontStyle: 'italic',
  }

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: overlayColor,
    opacity: overlayOpacity,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    pointerEvents: 'none',
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
  }

  const placeholderStyle: React.CSSProperties = {
    width: '100%',
    height: height === 'auto' ? (shape === 'circle' || shape === 'square' ? '100%' : '200px') : height,
    aspectRatio: shapeStyle.aspectRatio,
    border: '2px dashed #cbd5e0',
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    backgroundColor: dragOver ? '#ebf8ff' : '#f7fafc',
    color: '#718096',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.2s ease-in-out',
    boxShadow: getShadowValue(),
    gap: '12px',
  }

  const errorStyle: React.CSSProperties = {
    width: '100%',
    height: height === 'auto' ? (shape === 'circle' || shape === 'square' ? '100%' : '200px') : height,
    aspectRatio: shapeStyle.aspectRatio,
    border: '2px dashed #f56565',
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fed7d7',
    color: '#c53030',
    fontSize: '14px',
    gap: '8px',
  }

  const skeletonStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
    borderRadius: shapeStyle.borderRadius,
    clipPath: shapeStyle.clipPath,
    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  }

  const progressBarStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '4px',
    backgroundColor: '#e2e8f0',
    borderRadius: '2px',
  }

  const progressFillStyle: React.CSSProperties = {
    height: '100%',
    backgroundColor: '#4299e1',
    width: `${uploadProgress}%`,
    transition: 'width 0.3s ease',
    borderRadius: '2px',
  }

  if (!src) {
    return (
      <div className={`${className}`} style={containerStyle}>
        <div
          style={placeholderStyle}
          onClick={handleUploadClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <FaIcons.FaCloudUploadAlt size={32} color="#718096" />
          <div>Upload Image to Backend</div>
          <div style={{ fontSize: '12px', color: '#a0aec0' }}>
            Drag & drop or click to upload
          </div>
          <div style={{ fontSize: '10px', color: '#a0aec0' }}>
            Images will be saved to backend server
          </div>
        </div>

        {isUploading && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: shapeStyle.borderRadius,
            clipPath: shapeStyle.clipPath,
            color: 'white',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaIcons.FaSpinner className="animate-spin" />
              <span>Uploading to backend...</span>
            </div>
            {uploadProgress > 0 && (
              <div style={{ width: '80%', textAlign: 'center' }}>
                <div>{uploadProgress}%</div>
              </div>
            )}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    )
  }

  return (
    <>
      <div className={`${className}`} style={containerStyle}>
        <div 
          style={imageWrapperStyle}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {showGradientBorder && (
            <div style={innerContainerStyle}>
              {lazyLoad && !isLoaded && !imageError && (
                <div style={skeletonStyle} />
              )}
              
              {imageError ? (
                <div style={errorStyle}>
                  <FaIcons.FaExclamationTriangle size={32} />
                  <div>Failed to load image</div>
                  <button
                    onClick={handleUploadClick}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={lazyLoad && !isLoaded ? '' : src}
                  data-src={lazyLoad ? src : undefined}
                  alt={alt}
                  style={imageStyle}
                  onClick={handleImageClick}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading={lazyLoad ? "lazy" : "eager"}
                  {...domImageProps}
                />
              )}
            </div>
          )}
          
          {!showGradientBorder && (
            <>
              {lazyLoad && !isLoaded && !imageError && (
                <div style={skeletonStyle} />
              )}
              
              {imageError ? (
                <div style={errorStyle}>
                  <FaIcons.FaExclamationTriangle size={32} />
                  <div>Failed to load image</div>
                  <button
                    onClick={handleUploadClick}
                    style={{
                      marginTop: '8px',
                      padding: '6px 12px',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                    }}
                  >
                    Upload New
                  </button>
                </div>
              ) : (
                <img
                  ref={imageRef}
                  src={lazyLoad && !isLoaded ? '' : src}
                  data-src={lazyLoad ? src : undefined}
                  alt={alt}
                  style={imageStyle}
                  onClick={handleImageClick}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  loading={lazyLoad ? "lazy" : "eager"}
                  {...domImageProps}
                />
              )}
            </>
          )}

          {showOverlay && overlayText && (
            <div style={overlayStyle}>
              {overlayText}
            </div>
          )}

          {captionPosition === 'overlay' && caption && (
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '12px',
              fontSize: '14px',
              textAlign: captionAlignment,
              borderRadius: shapeStyle.borderRadius,
            }}>
              {caption}
            </div>
          )}

          {showLightbox && src && !imageError && (
            <div style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              backgroundColor: 'rgba(255,255,255,0.9)',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => {
              e.stopPropagation()
              setShowLightboxModal(true)
            }}
            >
              <FaIcons.FaExpand size={14} color="#4a5568" />
            </div>
          )}

          {isUploading && (
            <div style={progressBarStyle}>
              <div style={progressFillStyle} />
            </div>
          )}
        </div>

        {caption && captionPosition !== 'overlay' && (
          <div style={captionStyle}>
            {caption}
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>

      {showLightboxModal && src && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
          }}
          onClick={closeLightbox}
        >
          <div style={{
            position: 'relative',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}>
            <img
              src={src}
              alt={alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: objectPosition,
                borderRadius: shapeStyle.borderRadius,
                clipPath: shapeStyle.clipPath,
              }}
              onClick={(e) => e.stopPropagation()}
            />
            
            {caption && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(0,0,0,0.7)',
                color: 'white',
                padding: '16px',
                fontSize: '16px',
                textAlign: 'center',
              }}>
                {caption}
              </div>
            )}
            
            <button
              onClick={closeLightbox}
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: '20px',
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          .animate-spin {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </>
  )
}

(AdvancedImageComponent as any).schema = advancedImageSchema;

export default AdvancedImageComponent


