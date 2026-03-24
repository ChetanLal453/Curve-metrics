'use client'

import React, { useState, useCallback, useRef, useEffect } from 'react'

interface PropertyFieldProps {
  propName: string
  config: any
  value: any
  onChange: (value: any) => void
}

export const PropertyField: React.FC<PropertyFieldProps> = function PropertyField({ propName, config, value, onChange }) {
  const [localValue, setLocalValue] = useState(value || '')
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Update local value when prop changes from parent
  useEffect(() => {
    setLocalValue(value || '')
  }, [value])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const newValue = e.target.value
      setLocalValue(newValue)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        onChange(newValue)
      }, 300)
    },
    [onChange],
  )

  const handleImmediateChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    onChange(e.target.value)
  }

  const normalizeSelectValue = (val: any) => {
    return Array.isArray(val) ? val[0] || '' : val || ''
  }

  switch (config.type) {
    case 'text':
      return (
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <input type="text" value={localValue} onChange={handleTextChange} className="fi" placeholder={config.placeholder} />
        </div>
      )

    case 'textarea':
      return (
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <textarea
            value={localValue}
            onChange={handleTextChange}
            rows={4}
            className="ta"
            placeholder={config.placeholder}
          />
        </div>
      )

    case 'select':
      const selectValue = normalizeSelectValue(value)
      return (
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <select value={selectValue} onChange={handleImmediateChange} className="fsel">
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
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <div className="color-row">
            <input type="color" value={value || '#000000'} onChange={handleImmediateChange} className="colorinp" />
            <input type="text" value={value || '#000000'} onChange={handleImmediateChange} className="fi" />
          </div>
        </div>
      )

    case 'number':
      return (
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <input
            type="number"
            value={value || ''}
            onChange={handleImmediateChange}
            min={config.min}
            max={config.max}
            step={config.step}
            className="fi"
          />
        </div>
      )

    case 'range':
      return (
        <div className="frow">
          <label className="flbl">{config.label}</label>
          <div className="range-row">
            <input
              type="range"
              value={value || config.default || 0}
              onChange={handleImmediateChange}
              min={config.min}
              max={config.max}
              step={config.step}
              className="rangeinp"
            />
            <span className="rangeval">{value || config.default || 0}</span>
          </div>
        </div>
      )

    case 'toggle':
      return (
        <div className="frow">
          <label className="toggle-row">
            <input type="checkbox" checked={value || false} onChange={(e) => onChange(e.target.checked)} className="toggleinp" />
            <span className="flbl !mb-0">{config.label}</span>
          </label>
        </div>
      )

    case 'list-items':
      // ✅ FIXED: Declare listItems FIRST at the top
      const listItems = Array.isArray(value) ? value : []

      // ✅ Now define functions that use listItems
      const updateListItem = (index: number, field: string, newValue: any) => {
        const newList = [...listItems]
        newList[index] = { ...newList[index], [field]: newValue }
        onChange(newList)
      }

      const addListItem = () => {
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: 'New List Item',
          description: 'Description goes here...',
          visible: true,
          iconType: 'emoji',
          iconEmoji: '⭐',
          iconImage: '',
          iconFontAwesome: 'fas fa-star',
          iconNumber: listItems.length + 1,
          order: listItems.length + 1,
        }
        onChange([...listItems, newItem])
      }

      const removeListItem = (index: number) => {
        const newList = listItems.filter((_: any, i: number) => i !== index)
        const reorderedList = newList.map((item: any, idx: number) => ({
          ...item,
          order: idx + 1,
          iconNumber: idx + 1,
        }))
        onChange(reorderedList)
      }

      const moveListItem = (index: number, direction: 'up' | 'down') => {
        const newList = [...listItems]
        if (direction === 'up' && index > 0) {
          ;[newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]
        } else if (direction === 'down' && index < newList.length - 1) {
          ;[newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]
        }

        const reorderedList = newList.map((item: any, idx: number) => ({
          ...item,
          order: idx + 1,
          iconNumber: idx + 1,
        }))
        onChange(reorderedList)
      }

      const duplicateListItem = (index: number) => {
        const itemToDuplicate = listItems[index]
        const duplicatedItem = {
          ...itemToDuplicate,
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: `${itemToDuplicate.title} (copy)`,
          order: listItems.length + 1,
          iconNumber: listItems.length + 1,
        }
        const newList = [...listItems, duplicatedItem]
        onChange(newList)
      }

      const getIconPreview = (item: any) => {
        switch (item.iconType) {
          case 'image':
            // ✅ FIXED: Show only a placeholder, NOT the actual image
            return <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">🖼️</div>
          case 'fontawesome':
            return item.iconFontAwesome ? (
              <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded flex items-center justify-center">
                <i className={item.iconFontAwesome}></i>
              </div>
            ) : (
              <div className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center text-xs">
                <i className="fas fa-question"></i>
              </div>
            )
          case 'number':
            return (
              <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold">
                {item.iconNumber || '1'}
              </div>
            )
          case 'emoji':
          default:
            return <div className="w-6 h-6 text-lg flex items-center justify-center">{item.iconEmoji || '⭐'}</div>
        }
      }

      return (
        <div className="mb-4">
          {/* SIMPLIFIED HEADER */}
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">List Items</label>
            <span className="text-xs text-gray-500">{listItems.length} items</span>
          </div>

          {/* LIST ITEMS */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {listItems
              .sort((a: any, b: any) => a.order - b.order)
              .map((item: any, index: number) => (
                <div key={item.id} className={`border rounded-lg p-4 ${item.visible === false ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                  {/* Item Header with Controls */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getIconPreview(item)}
                      <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{item.order}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => moveListItem(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30"
                          title="Move up">
                          ↑
                        </button>
                        <button
                          onClick={() => moveListItem(index, 'down')}
                          disabled={index === listItems.length - 1}
                          className="p-1 text-gray-500 hover:text-blue-500 disabled:opacity-30"
                          title="Move down">
                          ↓
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => duplicateListItem(index)} className="p-1 text-gray-500 hover:text-green-600" title="Duplicate">
                        ⎘
                      </button>
                      <button onClick={() => removeListItem(index)} className="p-1 text-red-500 hover:text-red-700" title="Remove">
                        ×
                      </button>
                    </div>
                  </div>

                  {/* Icon Selection - COMPACT LAYOUT */}
                  {/* Icon Selection - CLEAN VERSION */}
                  <div className="mb-3">
                    {/* Clean header with only icon type selection */}
                    <div className="space-y-2">
                      <div>
                        <span className="text-xs font-medium text-gray-700">Icon Type</span>
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <button
                            onClick={() => updateListItem(index, 'iconType', 'emoji')}
                            className={`px-2 py-1.5 border rounded flex items-center justify-center gap-1 text-xs ${
                              item.iconType === 'emoji' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                            }`}>
                            <span>😀</span>
                            <span>Emoji</span>
                          </button>

                          <button
                            onClick={() => updateListItem(index, 'iconType', 'image')}
                            className={`px-2 py-1.5 border rounded flex items-center justify-center gap-1 text-xs ${
                              item.iconType === 'image' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                            }`}>
                            <span>🖼️</span>
                            <span>Image</span>
                          </button>

                          <button
                            onClick={() => updateListItem(index, 'iconType', 'fontawesome')}
                            className={`px-2 py-1.5 border rounded flex items-center justify-center gap-1 text-xs ${
                              item.iconType === 'fontawesome' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                            }`}>
                            <i className="fas fa-font-awesome text-xs"></i>
                            <span>Icon</span>
                          </button>

                          <button
                            onClick={() => updateListItem(index, 'iconType', 'number')}
                            className={`px-2 py-1.5 border rounded flex items-center justify-center gap-1 text-xs ${
                              item.iconType === 'number' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
                            }`}>
                            <span>1️⃣</span>
                            <span>Number</span>
                          </button>
                        </div>
                      </div>

                      {/* Dynamic Input Fields */}
                      <div>
                        {item.iconType === 'emoji' && (
                          <div>
                            <span className="text-xs text-gray-600 mb-1 block">Emoji</span>
                            <input
                              type="text"
                              value={item.iconEmoji || ''}
                              onChange={(e) => updateListItem(index, 'iconEmoji', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center text-lg"
                              placeholder="Enter emoji"
                              maxLength={2}
                            />
                          </div>
                        )}

                        {item.iconType === 'image' && (
                          <div>
                            <span className="text-xs text-gray-600 mb-1 block">Image</span>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.iconImage || ''}
                                onChange={(e) => updateListItem(index, 'iconImage', e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Enter image URL"
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
                                      const reader = new FileReader()
                                      reader.onload = (event) => {
                                        updateListItem(index, 'iconImage', event.target?.result as string)
                                      }
                                      reader.readAsDataURL(file)
                                    }
                                  }
                                  input.click()
                                }}
                                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">
                                Upload
                              </button>
                            </div>
                          </div>
                        )}

                        {item.iconType === 'fontawesome' && (
                          <div>
                            <span className="text-xs text-gray-600 mb-1 block">FontAwesome Icon</span>
                            <input
                              type="text"
                              value={item.iconFontAwesome || ''}
                              onChange={(e) => updateListItem(index, 'iconFontAwesome', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md"
                              placeholder="fas fa-heart, fab fa-twitter, etc."
                            />
                          </div>
                        )}

                        {item.iconType === 'number' && (
                          <div>
                            <span className="text-xs text-gray-600 mb-1 block">Number</span>
                            <input
                              type="number"
                              value={item.iconNumber || index + 1}
                              onChange={(e) => updateListItem(index, 'iconNumber', parseInt(e.target.value) || 1)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-center"
                              min="1"
                              max="100"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">
                      Title <span className="text-gray-400">({(item.title || '').length}/160)</span>
                    </label>
                    <input
                      type="text"
                      value={item.title || ''}
                      onChange={(e) => updateListItem(index, 'title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Item title"
                      maxLength={160}
                    />
                  </div>

                  {/* Description Input */}
                  <div className="mb-3">
                    <label className="block text-xs text-gray-600 mb-1">
                      Description <span className="text-gray-400">({(item.description || '').length}/200)</span>
                    </label>
                    <textarea
                      value={item.description || ''}
                      onChange={(e) => updateListItem(index, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="Item description"
                      maxLength={200}
                    />
                  </div>

                  {/* Visibility Toggle */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id={`visible-${item.id}`}
                      checked={item.visible !== false}
                      onChange={(e) => updateListItem(index, 'visible', e.target.checked)}
                      className="mr-2 h-4 w-4 text-blue-600"
                    />
                    <label htmlFor={`visible-${item.id}`} className="text-xs text-gray-700">
                      Visible
                    </label>
                  </div>
                </div>
              ))}
          </div>

          {/* Add Item Button */}
          <button
            onClick={addListItem}
            className="w-full mt-3 px-4 py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 hover:border-blue-400 hover:text-blue-500 flex items-center justify-center gap-2">
            <span>+</span>
            <span>Add Item</span>
          </button>

          {/* Simple Footer */}
          <div className="mt-3 text-xs text-gray-500 flex justify-between">
            <span>Total: {listItems.length}</span>
            <span>Visible: {listItems.filter((item: any) => item.visible !== false).length}</span>
            <button
              onClick={() => {
                const newItems = listItems.map((item: any, idx: number) => ({
                  ...item,
                  iconType: 'number',
                  iconNumber: idx + 1,
                  iconImage: '',
                  iconEmoji: '',
                  iconFontAwesome: '',
                }))
                onChange(newItems)
              }}
              className="text-blue-500 hover:text-blue-700"
              title="Number all items">
              Number All
            </button>
          </div>
        </div>
      )

    case 'accordion-items':
      const accordionItems = Array.isArray(value)
        ? value
        : [
            {
              id: '1',
              title: 'Frequently Asked Question 1',
              content: 'This is the detailed answer for the first question.',
              visible: true,
            },
            {
              id: '2',
              title: 'Frequently Asked Question 2',
              content: 'This is the detailed answer for the second question.',
              visible: true,
            },
          ]

      // Use useCallback to prevent unnecessary re-renders
      const updateAccordionItem = useCallback(
        (index: number, field: string, newValue: any) => {
          const newItems = [...accordionItems]
          if (newItems[index]?.[field] !== newValue) {
            newItems[index] = { ...newItems[index], [field]: newValue }
            onChange(newItems)
          }
        },
        [accordionItems, onChange],
      )

      const addAccordionItem = useCallback(() => {
        const newItem = {
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          title: 'New Question',
          content: 'Answer goes here...',
          visible: true,
        }
        onChange([...accordionItems, newItem])
      }, [accordionItems, onChange])

      const removeAccordionItem = useCallback(
        (index: number) => {
          const newItems = accordionItems.filter((_: any, i: number) => i !== index)
          onChange(newItems)
        },
        [accordionItems, onChange],
      )

      const moveAccordionItem = useCallback(
        (index: number, direction: 'up' | 'down') => {
          const newItems = [...accordionItems]
          if (direction === 'up' && index > 0) {
            ;[newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
          } else if (direction === 'down' && index < newItems.length - 1) {
            ;[newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
          }
          onChange(newItems)
        },
        [accordionItems, onChange],
      )

      // Debounced input handlers for text fields
      const [debouncedInputs, setDebouncedInputs] = useState<{ [key: string]: string }>({})
      const debounceTimeoutRef = useRef<NodeJS.Timeout>()

      const handleTitleChange = useCallback(
        (index: number, newValue: string) => {
          setDebouncedInputs((prev) => ({
            ...prev,
            [`title-${index}`]: newValue,
          }))

          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }

          debounceTimeoutRef.current = setTimeout(() => {
            updateAccordionItem(index, 'title', newValue)
          }, 500)
        },
        [updateAccordionItem],
      )

      const handleContentChange = useCallback(
        (index: number, newValue: string) => {
          setDebouncedInputs((prev) => ({
            ...prev,
            [`content-${index}`]: newValue,
          }))

          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }

          debounceTimeoutRef.current = setTimeout(() => {
            updateAccordionItem(index, 'content', newValue)
          }, 500)
        },
        [updateAccordionItem],
      )

      // Cleanup timeout on unmount
      useEffect(() => {
        return () => {
          if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current)
          }
        }
      }, [])

      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">{config.label}</label>

          {/* Accordion Items */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {accordionItems.map((item: any, index: number) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-900 text-sm">Question {index + 1}</h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveAccordionItem(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      title="Move up">
                      ↑
                    </button>
                    <button
                      onClick={() => moveAccordionItem(index, 'down')}
                      disabled={index === accordionItems.length - 1}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      title="Move down">
                      ↓
                    </button>
                    <button
                      onClick={() => removeAccordionItem(index)}
                      className="px-2 py-1 text-red-500 hover:text-red-700 text-xs"
                      title="Remove question">
                      ×
                    </button>
                  </div>
                </div>

                {/* Question Title */}
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">Question</label>
                  <input
                    type="text"
                    value={debouncedInputs[`title-${index}`] !== undefined ? debouncedInputs[`title-${index}`] : item.title}
                    onChange={(e) => handleTitleChange(index, e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter question..."
                  />
                </div>

                {/* Answer Content */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Answer</label>
                  <textarea
                    value={debouncedInputs[`content-${index}`] !== undefined ? debouncedInputs[`content-${index}`] : item.content}
                    onChange={(e) => handleContentChange(index, e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter answer..."
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="mt-2 flex items-center">
                  <input
                    type="checkbox"
                    id={`visible-${item.id}`}
                    checked={item.visible !== false}
                    onChange={(e) => updateAccordionItem(index, 'visible', e.target.checked)}
                    className="mr-2 h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor={`visible-${item.id}`} className="text-xs text-gray-700">
                    Visible
                  </label>
                </div>
              </div>
            ))}
          </div>

          {/* Add Question Button */}
          <button
            onClick={addAccordionItem}
            className="w-full mt-3 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors duration-200 flex items-center justify-center gap-2">
            <span className="text-lg">+</span>
            <span>Add New Question</span>
          </button>

          {/* Statistics */}
          <div className="mt-3 flex justify-between items-center text-xs text-gray-500">
            <span>Total questions: {accordionItems.length}</span>
            <span>Visible: {accordionItems.filter((item: any) => item.visible !== false).length}</span>
          </div>
        </div>
      )

    case 'carousel-slides':
      const slides = Array.isArray(value) ? value : []

      const addCarouselSlide = () => {
        const newSlide = {
          id: `slide-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          components: [],
        }
        onChange([...slides, newSlide])
      }

      const removeCarouselSlide = (index: number) => {
        if (slides.length <= 1) return
        const newSlides = slides.filter((_: any, i: number) => i !== index)
        onChange(newSlides)
      }

      const moveCarouselSlide = (index: number, direction: 'up' | 'down') => {
        const newSlides = [...slides]
        if (direction === 'up' && index > 0) {
          ;[newSlides[index], newSlides[index - 1]] = [newSlides[index - 1], newSlides[index]]
        } else if (direction === 'down' && index < newSlides.length - 1) {
          ;[newSlides[index], newSlides[index + 1]] = [newSlides[index + 1], newSlides[index]]
        }
        onChange(newSlides)
      }

      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">{config.label}</label>
          <div className="space-y-3">
            {slides.map((slide: any, index: number) => (
              <div key={slide.id} className="border border-gray-200 rounded-lg p-3 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900 text-sm">
                    Slide {index + 1}
                    <span className="text-xs text-gray-500 ml-2">({slide.components?.length || 0} components)</span>
                  </h4>
                  <div className="flex gap-1">
                    <button
                      onClick={() => moveCarouselSlide(index, 'up')}
                      disabled={index === 0}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      title="Move up">
                      ↑
                    </button>
                    <button
                      onClick={() => moveCarouselSlide(index, 'down')}
                      disabled={index === slides.length - 1}
                      className="px-2 py-1 text-gray-500 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      title="Move down">
                      ↓
                    </button>
                    <button
                      onClick={() => removeCarouselSlide(index)}
                      disabled={slides.length <= 1}
                      className="px-2 py-1 text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      title="Remove slide">
                      ×
                    </button>
                  </div>
                </div>

                {/* Slide preview showing empty drop zone or components */}
                <div className="min-h-[60px] border-2 border-dashed border-gray-200 rounded p-2 bg-gray-50">
                  {slide.components && slide.components.length > 0 ? (
                    <div className="space-y-1">
                      {slide.components.map((component: any, compIndex: number) => (
                        <div key={component.id} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded text-xs">
                          <span className="text-gray-600">{component.type}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 truncate flex-1">{component.label || 'Unnamed'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 py-3">
                      <div className="text-lg mb-1">📦</div>
                      <div className="text-xs">Drop components here</div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              onClick={addCarouselSlide}
              className="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors text-sm">
              + Add Slide Container
            </button>

            <div className="text-xs text-gray-500 mt-2">Each slide is a separate container where you can drag and drop components</div>
          </div>
        </div>
      )

    case 'image':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
          <div className="space-y-3">
            <div className="flex gap-2 items-stretch">
              <input
                type="text"
                value={value || ''}
                onChange={handleImmediateChange}
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
                      const button = e.target as HTMLButtonElement
                      const originalText = button.textContent
                      button.textContent = '⏳'
                      button.disabled = true

                      const reader = new FileReader()
                      reader.onload = (event) => {
                        onChange(event.target?.result as string)
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
                title="Upload image file">
                <span className="text-base">📁</span>
                <span>Upload</span>
              </button>
            </div>
            {value && value.startsWith('data:') && (
              <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                <span className="text-green-500">✓</span>
                <span>File uploaded successfully</span>
              </div>
            )}
          </div>
        </div>
      )

    case 'component-dropzone':
      return (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">{config.label}</label>
          <div className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-blue-400 transition-colors bg-gray-50">
            <div className="text-center text-gray-500">
              <div className="text-2xl mb-1">📦</div>
              <div className="text-sm font-medium">Drop a component here</div>
              <div className="text-xs mt-1">Drag from the component library</div>
            </div>
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
            onChange={handleImmediateChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )
  }
}
