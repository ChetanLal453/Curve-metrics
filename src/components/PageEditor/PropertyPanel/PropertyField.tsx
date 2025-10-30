'use client'

import React, { useState } from 'react'

interface PropertyFieldProps {
  propName: string
  config: any
  value: any
  onChange: (value: any) => void
}

export const PropertyField: React.FC<PropertyFieldProps> = function PropertyField({
  propName,
  config,
  value,
  onChange
}) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  const handleListChange = (newList: string[]) => {
    onChange(newList)
  }

  switch (config.type) {
    case 'text':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.label}
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={config.placeholder}
          />
        </div>
      )

    case 'textarea':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.label}
          </label>
          <textarea
            value={value || ''}
            onChange={handleChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={config.placeholder}
          />
        </div>
      )

    case 'select':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.label}
          </label>
          <select
            value={value || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {config.options?.map((option: string | { value: string; label: string }) => {
              const optionValue = typeof option === 'string' ? option : option.value
              const optionLabel = typeof option === 'string' ? option : option.label
              return (
                <option key={optionValue} value={optionValue}>
                  {optionLabel}
                </option>
              )
            })}
          </select>
        </div>
      )

    case 'color':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.label}
          </label>
          <input
            type="color"
            value={value || '#000000'}
            onChange={handleChange}
            className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
          />
        </div>
      )

    case 'toggle':
      return (
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={value || false}
              onChange={(e) => onChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm font-medium text-gray-700">{config.label}</span>
          </label>
        </div>
      )

    case 'list':
      const listItems = Array.isArray(value) ? value : ['List item 1', 'List item 2', 'List item 3']

      const updateListItem = (index: number, newValue: string) => {
        const newList = [...listItems]
        newList[index] = newValue
        handleListChange(newList)
      }

      const addListItem = () => {
        const newList = [...listItems, 'New item']
        handleListChange(newList)
      }

      const removeListItem = (index: number) => {
        const newList = listItems.filter((_, i) => i !== index)
        handleListChange(newList)
      }

      const moveListItem = (index: number, direction: 'up' | 'down') => {
        const newList = [...listItems]
        if (direction === 'up' && index > 0) {
          [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]
        } else if (direction === 'down' && index < newList.length - 1) {
          [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
        }
        handleListChange(newList)
      }

      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.label}
          </label>
          <div className="space-y-2">
            {listItems.map((item: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateListItem(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={`Item ${index + 1}`}
                />
                <button
                  onClick={() => moveListItem(index, 'up')}
                  disabled={index === 0}
                  className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveListItem(index, 'down')}
                  disabled={index === listItems.length - 1}
                  className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeListItem(index)}
                  className="px-2 py-1 text-red-500 hover:text-red-700"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              onClick={addListItem}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
            >
              + Add Item
            </button>
          </div>
        </div>
      )

    case 'slide-array':
      const slides = Array.isArray(value) ? value : []

      const updateSlide = (index: number, field: string, fieldValue: any) => {
        const newSlides = [...slides]
        if (field.includes('.')) {
          const [parent, child] = field.split('.')
          newSlides[index] = {
            ...newSlides[index],
            [parent]: { ...newSlides[index][parent], [child]: fieldValue }
          }
        } else {
          newSlides[index] = { ...newSlides[index], [field]: fieldValue }
        }
        onChange(newSlides)
      }

      const addSlide = () => {
        const newSlide = {
          id: `slide-${Math.random().toString(36).slice(2, 11)}`, // Use slice instead of substr for better compatibility
          title: 'New Slide',
          subtitle: '',
          description: '',
          content: 'New slide content',
          mediaType: 'image', // 'image' or 'video'
          image: 'https://via.placeholder.com/800x400/6b7280/ffffff?text=New+Slide',
          video: '',
          caption: '',
          link: { url: '#', text: 'Learn More', openInNewTab: false },
          ctaButtons: [],
          visibility: true,
          backgroundColor: '#6b7280',
          textColor: '#ffffff',
          layout: 'full-width',
          imageAlignment: 'center',
          imageToTextRatio: 50,
          slideWidth: 'auto',
          slideHeight: 400,
          autoHeight: false,
          padding: 10,
          margin: 10,
          borderRadius: 5,
          shadowIntensity: 3,
          customCSS: '',
        }
        onChange([...slides, newSlide])
      }

      const removeSlide = (index: number) => {
        if (slides.length <= 1) return // Keep at least one slide
        const newSlides = slides.filter((_: any, i: number) => i !== index)
        onChange(newSlides)
      }

      const duplicateSlide = (index: number) => {
        const slideToDuplicate = slides[index]
        const duplicatedSlide = {
          ...slideToDuplicate,
          id: `slide-${Math.random().toString(36).slice(2, 11)}`, // Use random string for unique id
          title: `${slideToDuplicate.title} (Copy)`
        }
        const newSlides = [...slides]
        newSlides.splice(index + 1, 0, duplicatedSlide)
        onChange(newSlides)
      }

      const moveSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides]
        if (direction === 'up' && index > 0) {
          [newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]]
        } else if (direction === 'down' && index < newSlides.length - 1) {
          [newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]]
        }
        onChange(newSlides)
      }

      // Mini slide preview component
      const SlidePreview = ({ slide }: { slide: any }) => {
        const getObjectPositionClass = (alignment: string) => {
          switch (alignment) {
            case 'left': return 'object-left'
            case 'right': return 'object-right'
            case 'top': return 'object-top'
            case 'bottom': return 'object-bottom'
            case 'center':
            default: return 'object-center'
          }
        }

        const renderMedia = () => {
          if (slide.mediaType === 'video' && slide.video) {
            return (
              <div className="relative w-full h-full overflow-hidden rounded">
                <video
                  src={slide.video}
                  className="w-full h-full object-contain"
                  muted
                />
              </div>
            )
          } else if (slide.mediaType === 'image') {
            return (
              <div className="relative w-full h-full overflow-hidden rounded">
                {slide.image ? (
                  <img
                    src={slide.image}
                    alt={slide.title || `Slide preview`}
                    className={`w-full h-full object-contain ${getObjectPositionClass(slide.imageAlignment || 'center')}`}
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded">
                    <span className="text-xs text-gray-500">No image</span>
                  </div>
                )}
              </div>
            )
          }
          return null
        }

        const renderTextContent = () => (
          <div className="flex flex-col justify-center text-center">
            {slide.subtitle && (
              <h4 className="text-xs font-semibold mb-1 truncate">
                {slide.subtitle}
              </h4>
            )}
            {slide.title && (
              <h3 className="text-sm font-bold mb-1 truncate">
                {slide.title}
              </h3>
            )}
            {slide.content && (
              <p className="text-xs opacity-80 mb-1 line-clamp-2">
                {slide.content}
              </p>
            )}

            {/* CTA Buttons */}
            {slide.ctaButtons && slide.ctaButtons.length > 0 && slide.layout !== 'full-image' && (
              <div className="flex flex-wrap gap-1 mt-2 justify-center">
                {slide.ctaButtons.map((btn: any, btnIndex: number) => (
                  <button
                    key={btnIndex}
                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                  >
                    {btn.label || 'Button'}
                  </button>
                ))}
              </div>
            )}
          </div>
        )

        const previewStyle: React.CSSProperties = {
          backgroundColor: slide.backgroundColor || '#3b82f6',
          color: slide.textColor || '#ffffff',
          borderRadius: '4px',
          overflow: 'hidden',
          boxShadow: `0 ${slide.shadowIntensity || 3}px ${slide.shadowIntensity * 2 || 6}px rgba(0,0,0,0.1)`
        }

        return (
          <div className="w-full h-32 border border-gray-300 rounded-lg overflow-hidden" style={previewStyle}>
            {slide.layout === 'full-width' && (
              <div className="h-full flex flex-col">
                {renderMedia() && (
                  <div className="flex-1">
                    {renderMedia()}
                  </div>
                )}
                <div className="flex-1 p-2">
                  {renderTextContent()}
                </div>
              </div>
            )}

            {slide.layout === 'half-image-half-text' && (
              <div className="h-full flex">
                <div className="flex-1 p-2">
                  {renderTextContent()}
                </div>
                {renderMedia() && (
                  <div className="flex-1">
                    {renderMedia()}
                  </div>
                )}
              </div>
            )}

            {slide.layout === 'text-overlay' && renderMedia() && (
              <div className="h-full relative">
                {renderMedia()}
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                  <div className="text-center">
                    {renderTextContent()}
                  </div>
                </div>
              </div>
            )}

            {slide.layout === 'card-style' && (
              <div className="h-full bg-white rounded overflow-hidden">
                {renderMedia() && (
                  <div className="h-1/2">
                    {renderMedia()}
                  </div>
                )}
                <div className="p-2 text-gray-900">
                  {renderTextContent()}
                </div>
              </div>
            )}

            {slide.layout === 'full-image' && renderMedia() && (
              <div className="h-full relative">
                {renderMedia()}
              </div>
            )}

            {slide.layout === 'full-text' && (
              <div className="h-full flex items-center justify-center p-2">
                {renderTextContent()}
              </div>
            )}

            {!['full-width', 'half-image-half-text', 'text-overlay', 'card-style', 'full-image', 'full-text'].includes(slide.layout) && (
              <div className="h-full flex items-center justify-center p-2">
                <span className="text-xs">Preview not available</span>
              </div>
            )}
          </div>
        )
      }

      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {config.label}
          </label>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {slides.map((slide: any, index: number) => (
              <div key={slide.id || index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900">Slide {index + 1}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveSlide(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Move up"
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Move down"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => duplicateSlide(index)}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 text-sm"
                      title="Duplicate slide"
                    >
                      📋
                    </button>
                    <button
                      onClick={() => removeSlide(index)}
                      disabled={slides.length <= 1}
                      className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      title="Remove slide"
                    >
                      ×
                    </button>
                  </div>
                </div>

                {/* Slide Preview */}
                <div className="mb-4">
                  <label className="block text-xs font-medium text-gray-600 mb-2">Preview</label>
                  <SlidePreview slide={slide} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Visibility</label>
                    <input
                      type="checkbox"
                      checked={slide.visibility !== false}
                      onChange={(e) => updateSlide(index, 'visibility', e.target.checked)}
                      className="rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                    <input
                      type="text"
                      value={slide.title || ''}
                      onChange={(e) => updateSlide(index, 'title', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Slide title"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={slide.subtitle || ''}
                      onChange={(e) => updateSlide(index, 'subtitle', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Slide subtitle"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                    <textarea
                      value={slide.description || ''}
                      onChange={(e) => updateSlide(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Slide description"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Layout</label>
                    <select
                      value={slide.layout || 'full-width'}
                      onChange={(e) => updateSlide(index, 'layout', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="full-width">Full Width</option>
                      <option value="half-image-half-text">Half Image/Half Text</option>
                      <option value="text-overlay">Text Overlay</option>
                      <option value="card-style">Card Style</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Media Type</label>
                    <select
                      value={slide.mediaType || 'image'}
                      onChange={(e) => updateSlide(index, 'mediaType', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                    <textarea
                      value={slide.content || ''}
                      onChange={(e) => updateSlide(index, 'content', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Slide content"
                    />
                  </div>
                  {slide.mediaType === 'image' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-2">Image</label>
                      <div className="space-y-3">
                        <div className="flex gap-2 items-stretch">
                          <input
                            type="text"
                            value={slide.image || ''}
                            onChange={(e) => updateSlide(index, 'image', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                            placeholder="Enter image URL or upload file"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'image/*'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  // Show loading state
                                  const button = e.target as HTMLButtonElement
                                  const originalText = button.textContent
                                  button.textContent = '⏳'
                                  button.disabled = true

                                  const reader = new FileReader()
                                  reader.onload = (event) => {
                                    updateSlide(index, 'image', event.target?.result as string)
                                    button.textContent = originalText
                                    button.disabled = false
                                  }
                                  reader.onerror = () => {
                                    button.textContent = originalText
                                    button.disabled = false
                                    alert('Error reading file')
                                  }
                                  reader.readAsDataURL(file)
                                }
                              }
                              input.click()
                            }}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white rounded-md transition-colors duration-200 text-sm font-medium shadow-sm hover:shadow-md flex items-center gap-1 min-w-[100px] justify-center"
                            title="Upload image file"
                          >
                            <span className="text-base">📁</span>
                            <span>Upload</span>
                          </button>
                        </div>
                        {slide.image && slide.image.startsWith('data:') && (
                          <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                            <span className="text-green-500">✓</span>
                            <span>File uploaded successfully</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  {slide.mediaType === 'video' && (
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Video</label>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={slide.video || ''}
                            onChange={(e) => updateSlide(index, 'video', e.target.value)}
                            className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Enter video URL or upload file"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.createElement('input')
                              input.type = 'file'
                              input.accept = 'video/*'
                              input.onchange = (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0]
                                if (file) {
                                  // Check file size (limit to 50MB for videos)
                                  if (file.size > 50 * 1024 * 1024) {
                                    alert('Video file size must be less than 50MB')
                                    return
                                  }

                                  // Show loading state
                                const button = e.target as HTMLButtonElement
                                const originalText = button.textContent
                                const originalDisabled = button.disabled
                                button.textContent = '⏳'
                                button.disabled = true

                                const reader = new FileReader()
                                reader.onload = (event) => {
                                  updateSlide(index, 'video', event.target?.result as string)
                                  button.textContent = '🎥 Upload'
                                  button.disabled = originalDisabled
                                }
                                reader.onerror = () => {
                                  button.textContent = '🎥 Upload'
                                  button.disabled = originalDisabled
                                  alert('Error reading video file')
                                }
                                reader.readAsDataURL(file)
                              }
                            }
                            input.click()
                          }}
                          className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded text-sm transition-colors"
                          title="Upload video file"
                        >
                          🎥 Upload
                        </button>
                        </div>
                        {slide.video && slide.video.startsWith('data:') && (
                          <div className="text-xs text-green-600">
                            Video uploaded successfully
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                    <input
                      type="color"
                      value={slide.backgroundColor || '#3b82f6'}
                      onChange={(e) => updateSlide(index, 'backgroundColor', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Text Color</label>
                    <input
                      type="color"
                      value={slide.textColor || '#ffffff'}
                      onChange={(e) => updateSlide(index, 'textColor', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link URL</label>
                    <input
                      type="text"
                      value={slide.link?.url || ''}
                      onChange={(e) => updateSlide(index, 'link.url', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Link Text</label>
                    <input
                      type="text"
                      value={slide.link?.text || ''}
                      onChange={(e) => updateSlide(index, 'link.text', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="Learn More"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4">
                  <label className="flex items-center text-xs">
                    <input
                      type="checkbox"
                      checked={slide.link?.openInNewTab || false}
                      onChange={(e) => updateSlide(index, 'link.openInNewTab', e.target.checked)}
                      className="mr-1"
                    />
                    Open in new tab
                  </label>
                </div>

                {/* CTA Buttons Management */}
                <div className="mt-4 border-t border-gray-300 pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">CTA Buttons</label>
                  {(slide.ctaButtons || []).map((btn: any, btnIndex: number) => (
                    <div key={btnIndex} className="mb-2 p-2 border border-gray-200 rounded">
                      <div className="grid grid-cols-3 gap-2 items-center">
                        <input
                          type="text"
                          value={btn.label || ''}
                          onChange={(e) => {
                            const newButtons = [...slide.ctaButtons]
                            newButtons[btnIndex] = { ...newButtons[btnIndex], label: e.target.value }
                            updateSlide(index, 'ctaButtons', newButtons)
                          }}
                          placeholder="Button Label"
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <input
                          type="text"
                          value={btn.link || ''}
                          onChange={(e) => {
                            const newButtons = [...slide.ctaButtons]
                            newButtons[btnIndex] = { ...newButtons[btnIndex], link: e.target.value }
                            updateSlide(index, 'ctaButtons', newButtons)
                          }}
                          placeholder="Button Link"
                          className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <label className="flex items-center gap-1 text-xs">
                          <input
                            type="checkbox"
                            checked={btn.openInNewTab || false}
                            onChange={(e) => {
                              const newButtons = [...slide.ctaButtons]
                              newButtons[btnIndex] = { ...newButtons[btnIndex], openInNewTab: e.target.checked }
                              updateSlide(index, 'ctaButtons', newButtons)
                            }}
                            className="cursor-pointer"
                          />
                          New Tab
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            const newButtons = [...slide.ctaButtons]
                            newButtons.splice(btnIndex, 1)
                            updateSlide(index, 'ctaButtons', newButtons)
                          }}
                          className="col-span-3 mt-1 px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                        >
                          Remove Button
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newButtons = [...(slide.ctaButtons || []), { label: 'CTA Button', link: '', openInNewTab: false }]
                      updateSlide(index, 'ctaButtons', newButtons)
                    }}
                    className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
                  >
                    + Add CTA Button
                  </button>
                </div>

                {/* Layout & Structure Controls */}
                <div className="mt-4 border-t border-gray-300 pt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Layout & Structure</label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Image Alignment</label>
                      <select
                        value={slide.imageAlignment || 'center'}
                        onChange={(e) => updateSlide(index, 'imageAlignment', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                        <option value="center">Center</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Image to Text Ratio (%)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={slide.imageToTextRatio || 50}
                        onChange={(e) => updateSlide(index, 'imageToTextRatio', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Slide Width</label>
                      <select
                        value={slide.slideWidth || 'auto'}
                        onChange={(e) => updateSlide(index, 'slideWidth', e.target.value)}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="auto">Auto</option>
                        <option value="fixed">Fixed</option>
                        <option value="full">Full</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Slide Height (px)</label>
                      <input
                        type="number"
                        min={0}
                        value={slide.slideHeight || 400}
                        onChange={(e) => updateSlide(index, 'slideHeight', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="flex items-center gap-2 text-xs font-medium text-gray-600 mb-1">
                        <input
                          type="checkbox"
                          checked={slide.autoHeight || false}
                          onChange={(e) => updateSlide(index, 'autoHeight', e.target.checked)}
                          className="cursor-pointer"
                        />
                        Auto Height
                      </label>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Padding (px)</label>
                      <input
                        type="number"
                        min={0}
                        value={slide.padding || 10}
                        onChange={(e) => updateSlide(index, 'padding', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Margin (px)</label>
                      <input
                        type="number"
                        min={0}
                        value={slide.margin || 10}
                        onChange={(e) => updateSlide(index, 'margin', parseInt(e.target.value))}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Border Radius (px)</label>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={slide.borderRadius || 5}
                        onChange={(e) => updateSlide(index, 'borderRadius', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Shadow Intensity</label>
                      <input
                        type="range"
                        min={0}
                        max={10}
                        value={slide.shadowIntensity || 3}
                        onChange={(e) => updateSlide(index, 'shadowIntensity', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-600 mb-1">Custom CSS</label>
                      <textarea
                        value={slide.customCSS || ''}
                        onChange={(e) => updateSlide(index, 'customCSS', e.target.value)}
                        rows={3}
                        className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                        placeholder="Enter custom CSS"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addSlide}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm"
            >
              + Add Slide
            </button>
          </div>
        </div>
      )

    default:
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {config.label} ({config.type})
          </label>
          <input
            type="text"
            value={value || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )
  }
}
