'use client'

import React, { useState } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'

interface ListItem {
  id: string
  content: string
}

const DraggableList: React.FC = () => {
  const [items, setItems] = useState<ListItem[]>([
    { id: '1', content: 'Item 1' },
    { id: '2', content: 'Item 2' },
    { id: '3', content: 'Item 3' }
  ])

  const addItem = () => {
    const newId = Date.now().toString()
    const newContent = `Item ${items.length + 1}`
    setItems([...items, { id: newId, content: newContent }])
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return
    const reorderedItems = Array.from(items)
    const [removed] = reorderedItems.splice(result.source.index, 1)
    reorderedItems.splice(result.destination.index, 0, removed)
    setItems(reorderedItems)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col">
        <div className="h-64 border border-gray-300 rounded-lg bg-white overflow-hidden">
          <div className="flex-1 overflow-y-auto p-2">
            <Droppable droppableId="list">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {items.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`flex items-center p-3 mb-2 bg-gray-50 border rounded-lg shadow-sm hover:shadow-md transition-shadow ${
                            snapshot.isDragging ? 'opacity-50' : ''
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-move mr-3 text-gray-500 hover:text-gray-700"
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M3 4h14a1 1 0 010 2H3a1 1 0 010-2zM3 8h14a1 1 0 010 2H3a1 1 0 010-2zM3 12h14a1 1 0 010 2H3a1 1 0 010-2z"/>
                            </svg>
                          </div>
                          <span className="flex-1">{item.content}</span>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
        <div className="mt-2">
          <button
            onClick={addItem}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm font-medium flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Item
          </button>
        </div>
      </div>
    </DragDropContext>
  )
}

export default DraggableList
