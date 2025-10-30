import React, { useState, useRef, useEffect, memo } from 'react'
import dynamic from 'next/dynamic'
import { LayoutComponent } from '@/types/page-editor'

const DynamicSlider = dynamic(() => import('./components/DynamicSlider').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="p-4 text-center">Loading slider...</div>
})

interface DynamicComponentProps {
  component: LayoutComponent
  isSelected: boolean
  onSelect: () => void
  onUpdate: (newProps: Record<string, any>) => void
  editing?: boolean
}

export const DynamicComponent: React.FC<DynamicComponentProps> = memo(({
  component,
  isSelected,
  onSelect,
  onUpdate,
  editing = false
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onSelect()
  }

  const renderEditableText = (text: string, placeholder: string = 'Click to edit') => {
    return (
      <div
        contentEditable
        suppressContentEditableWarning
        className="min-h-[1.5em] p-2 border-2 border-transparent hover:border-gray-300 rounded focus:outline-none focus:border-blue-400"
        onInput={(e) => onUpdate({ ...component.props, text: e.currentTarget.innerHTML })}
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: text || placeholder }}
      />
    )
  }

  const renderComponent = () => {
    switch (component.type) {
      case 'heading': {
        const [text, setText] = useState(component.props?.text || 'Heading Text')
        const [isEditing, setIsEditing] = useState(false)
        useEffect(() => setText(component.props?.text || 'Heading Text'), [component.props?.text])

        const Tag = component.props?.level || 'h2'

        const headingStyle = {
          fontSize: component.props?.fontSize || '24px',
          fontWeight: component.props?.fontWeight || 'bold',
          color: component.props?.fontColor || '#000000',
          fontFamily: component.props?.fontFamily || 'inherit',
          textAlign: component.props?.align || 'left',
          lineHeight: component.props?.lineHeight || '1.2',
          letterSpacing: component.props?.letterSpacing || '0px',
          backgroundColor: component.props?.backgroundColor || 'transparent',
          padding: component.props?.padding || '0px',
          margin: component.props?.margin || '0px 0px 16px 0px',
          textTransform: component.props?.textTransform || 'none',
          cursor: 'pointer',
          border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
          borderRadius: '4px',
          transition: 'border-color 0.2s ease',
          minHeight: '1.5em',
          outline: 'none'
        }

        return (
          <div className="relative">
            {isEditing ? (
              <input
                type="text"
                value={text}
                onChange={(e) => {
                  const newText = e.target.value
                  setText(newText)
                  onUpdate({ ...component.props, text: newText })
                }}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === 'Escape') {
                    setIsEditing(false)
                  }
                }}
                style={{
                  ...headingStyle,
                  border: '2px solid #3b82f6',
                  backgroundColor: 'white',
                  padding: '8px 12px',
                  fontSize: component.props?.fontSize || '24px',
                  fontWeight: component.props?.fontWeight || 'bold',
                  color: component.props?.fontColor || '#000000',
                  fontFamily: component.props?.fontFamily || 'inherit',
                  textAlign: component.props?.align || 'left',
                  textTransform: component.props?.textTransform || 'none',
                  width: '100%',
                  boxSizing: 'border-box'
                }}
                autoFocus
              />
            ) : (
              React.createElement(Tag, {
                id: component.props?.customId || undefined,
                className: component.props?.customClass || undefined,
                style: headingStyle,
                onClick: (e: React.MouseEvent) => {
                  e.stopPropagation()
                  setIsEditing(true)
                  onSelect()
                },
                onDoubleClick: () => setIsEditing(true)
              }, text)
            )}
            {isSelected && (
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow">
                {Tag.toUpperCase()}
              </div>
            )}
          </div>
        )
      }

      case 'paragraph': {
        const [text, setText] = useState(component.props?.text || 'Paragraph text...')
        useEffect(() => setText(component.props?.text || 'Paragraph text...'), [component.props?.text])

        return (
          <div className="relative">
            <div
              contentEditable
              suppressContentEditableWarning
              className="min-h-[1.5em] p-2 border-2 border-transparent hover:border-gray-300 rounded focus:outline-none focus:border-blue-400"
              onInput={(e) => {
                const newText = e.currentTarget.innerHTML
                setText(newText)
                onUpdate({ ...component.props, text: newText })
              }}
              onClick={handleClick}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </div>
        )
      }

      case 'rich-text':
        return <DynamicRichText component={component} onUpdate={onUpdate} />

      case 'quote':
        return <DynamicQuote component={component} onUpdate={onUpdate} />

      case 'list':
        return <DynamicList component={component} onUpdate={onUpdate} />

      case 'image':
        return <DynamicImage component={component} onUpdate={onUpdate} />

      case 'image-gallery':
        return <DynamicGallery component={component} onUpdate={onUpdate} />

      case 'video':
        return <DynamicVideo component={component} onUpdate={onUpdate} />

      case 'icon':
        return <DynamicIcon component={component} onUpdate={onUpdate} />

      case 'divider':
        return <DynamicDivider component={component} onUpdate={onUpdate} />

      case 'button':
        return <DynamicButton component={component} onUpdate={onUpdate} />

      case 'form':
        return <DynamicForm component={component} onUpdate={onUpdate} />

      case 'accordion':
        return <DynamicAccordion component={component} onUpdate={onUpdate} />

      case 'tabs':
        return <DynamicTabs component={component} onUpdate={onUpdate} />

      case 'modal-trigger':
        return <DynamicModalTrigger component={component} onUpdate={onUpdate} />

      case 'scroller':
        return <DynamicScroller component={component} onUpdate={onUpdate} />

      case 'spacer':
        return <DynamicSpacer component={component} onUpdate={onUpdate} />

      case 'container':
        return <DynamicContainer component={component} onUpdate={onUpdate} />

      case 'grid':
        return <DynamicGrid component={component} onUpdate={onUpdate} />

      case 'flex-box':
        return <DynamicFlexBox component={component} onUpdate={onUpdate} />

      case 'card':
        return <DynamicCard component={component} onUpdate={onUpdate} isSelected={isSelected} onSelect={onSelect} />

      case 'slider':
        return <DynamicSlider component={component} onUpdate={onUpdate} />

      case 'testimonial':
        return <DynamicTestimonial component={component} onUpdate={onUpdate} />

      case 'pricing-table':
        return <DynamicPricingTable component={component} onUpdate={onUpdate} />

      case 'counter':
        return <DynamicCounter component={component} onUpdate={onUpdate} />

      case 'timeline':
        return <DynamicTimeline component={component} onUpdate={onUpdate} />

      case 'map':
        return <DynamicMap component={component} onUpdate={onUpdate} />

      case 'social-media':
        return <DynamicSocialMedia component={component} onUpdate={onUpdate} />

      case 'section':
        return <DynamicSection component={component} onUpdate={onUpdate} />

      default:
        return <div>Unsupported component type: {component.type}</div>
    }
  }

  return (
    <div
      className={`relative w-full max-w-full h-auto overflow-x-hidden border-2 rounded transition-all duration-200 ${
        isSelected
          ? 'border-blue-400 bg-blue-50 shadow-lg'
          : 'border-transparent hover:border-gray-300'
      }`}
      onClick={handleClick}
    >
      {renderComponent()}

      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute -top-3 -left-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow">
          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      )}
    </div>
  )
})

// Dynamic Rich Text Component
const DynamicRichText: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [content, setContent] = useState(component.props?.content || "<p>Start writing your rich text content here...</p>")
  useEffect(() => setContent(component.props?.content || "<p>Start writing your rich text content here...</p>"), [component.props?.content])

  return (
    <div className="border rounded p-2 min-h-[200px] bg-white">
      <div
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-h-[180px] prose prose-sm max-w-none"
        onInput={(e) => {
          const newContent = e.currentTarget.innerHTML
          setContent(newContent)
          onUpdate({ ...component.props, content: newContent })
        }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  )
}

// Dynamic Quote Component
const DynamicQuote: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [editing, setEditing] = useState<"text" | "author" | null>(null)

  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-center">
      {editing === "text" ? (
        <textarea
          value={component.props?.text || "\"This is a quote or testimonial text.\""}
          onChange={(e) => onUpdate({ ...component.props, text: e.target.value })}
          onBlur={() => setEditing(null)}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
          autoFocus
        />
      ) : (
        <p
          className="cursor-pointer hover:bg-gray-100 p-2 rounded"
          onClick={() => setEditing("text")}
        >
          {component.props?.text || "\"This is a quote or testimonial text.\""}
        </p>
      )}
      {editing === "author" ? (
        <input
          type="text"
          value={component.props?.author || "Author Name"}
          onChange={(e) => onUpdate({ ...component.props, author: e.target.value })}
          onBlur={() => setEditing(null)}
          className="text-sm text-gray-600 border rounded px-2 py-1 focus:outline-none focus:border-blue-400"
          autoFocus
        />
      ) : (
        <cite
          className="text-sm text-gray-600 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded not-italic font-semibold"
          onClick={() => setEditing("author")}
        >
          — {component.props?.author || "Author Name"}
        </cite>
      )}
    </blockquote>
  )
}

// Dynamic Video Component
const DynamicVideo: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [editing, setEditing] = useState(false)

  return (
    <div className="relative">
      {editing ? (
        <input
          type="text"
          value={component.props?.src || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
          onChange={(e) => onUpdate({ ...component.props, src: e.target.value })}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false)
            }
          }}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400 mb-2"
          placeholder="Enter video URL..."
          autoFocus
        />
      ) : (
        <div
          className="cursor-pointer hover:bg-gray-100 p-2 rounded border-2 border-dashed border-gray-300"
          onClick={() => setEditing(true)}
        >
          <iframe
            src={component.props?.src || "https://www.youtube.com/embed/dQw4w9WgXcQ"}
            className="w-full aspect-video"
            allowFullScreen
          />
        </div>
      )}
    </div>
  )
}

// Dynamic Icon Component
const DynamicIcon: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [editing, setEditing] = useState(false)

  return (
    <div className="text-center p-4">
      {editing ? (
        <input
          type="text"
          value={component.props?.name || "star"}
          onChange={(e) => onUpdate({ ...component.props, name: e.target.value })}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false)
            }
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          placeholder="Icon name (e.g., star, heart, user)"
          autoFocus
        />
      ) : (
        <div
          className="cursor-pointer hover:bg-gray-100 p-4 rounded inline-block"
          onClick={() => setEditing(true)}
        >
          <i className={`fa fa-${component.props?.name || "star"} text-4xl text-gray-600`} />
          <div className="text-sm text-gray-500 mt-2">{component.props?.name || "star"}</div>
        </div>
      )}
    </div>
  )
}

// Dynamic Divider Component
const DynamicDivider: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  return (
    <hr className="border-t-2 border-gray-300 my-4" />
  )
}

// Dynamic Button Component
const DynamicButton = ({ component, onUpdate }: { component: LayoutComponent; onUpdate: (props: any) => void }) => {
  const [editing, setEditing] = useState<"text" | "link" | null>(null)

  const getButtonClasses = () => {
    const baseClasses = "px-6 py-3 rounded font-medium transition-colors"
    const variant = component.props?.variant || "primary"
    switch (variant) {
      case "secondary":
        return `${baseClasses} bg-gray-600 text-white hover:bg-gray-700`
      case "outline":
        return `${baseClasses} border-2 border-blue-500 text-blue-500 hover:bg-blue-50`
      case "ghost":
        return `${baseClasses} text-blue-500 hover:bg-blue-50`
      default:
        return `${baseClasses} bg-blue-500 text-white hover:bg-blue-600`
    }
  }

  return (
    <div className="text-center space-y-2">
      <a
        href={component.props?.link || "#"}
        className={getButtonClasses()}
      >
        {component.props?.text || "Click Me"}
      </a>
      <div className="flex justify-center gap-2 text-sm">
        <button
          onClick={() => setEditing("text")}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Edit Text
        </button>
        <button
          onClick={() => setEditing("link")}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Edit Link
        </button>
      </div>
      {editing === "text" && (
        <input
          type="text"
          value={component.props?.text || "Click Me"}
          onChange={(e) => onUpdate({ ...component.props, text: e.target.value })}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(null)
            }
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          autoFocus
        />
      )}
      {editing === "link" && (
        <input
          type="text"
          value={component.props?.link || "#"}
          onChange={(e) => onUpdate({ ...component.props, link: e.target.value })}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(null)
            }
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          placeholder="https://example.com"
          autoFocus
        />
      )}
    </div>
  )
}

// Dynamic Form Component
const DynamicForm: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [fields, setFields] = useState(component.props?.fields || [
    { type: "text", name: "name", label: "Name", required: true },
    { type: "email", name: "email", label: "Email", required: true },
    { type: "textarea", name: "message", label: "Message", required: false }
  ])
  const [submitText, setSubmitText] = useState(component.props?.submitText || "Submit")

  const updateFields = (newFields: any[]) => {
    setFields(newFields)
    onUpdate({ ...component.props, fields: newFields })
  }

  const addField = () => {
    const newFields = [...fields, { type: "text", name: "field" + (fields.length + 1), label: "New Field", required: false }]
    updateFields(newFields)
  }

  const removeField = (index: number) => {
    const newFields = fields.filter((_: any, i: number) => i !== index)
    updateFields(newFields)
  }

  const updateField = (index: number, key: string, value: any) => {
    const newFields = [...fields]
    newFields[index] = { ...newFields[index], [key]: value }
    updateFields(newFields)
  }

  return (
    <div className="space-y-4 p-4 border rounded bg-gray-50">
      {fields.map((field: any, index: number) => (
        <div key={index} className="flex items-center gap-2 p-2 bg-white rounded">
          <select
            value={field.type}
            onChange={(e) => updateField(index, "type", e.target.value)}
            className="p-1 border rounded text-sm"
          >
            <option value="text">Text</option>
            <option value="email">Email</option>
            <option value="textarea">Textarea</option>
          </select>
          <input
            type="text"
            value={field.label}
            onChange={(e) => updateField(index, "label", e.target.value)}
            className="flex-1 p-1 border rounded text-sm"
            placeholder="Field label"
          />
          <label className="flex items-center gap-1 text-sm">
            <input
              type="checkbox"
              checked={field.required}
              onChange={(e) => updateField(index, "required", e.target.checked)}
            />
            Required
          </label>
          <button
            onClick={() => removeField(index)}
            className="text-red-500 hover:text-red-700 p-1"
          >
            ×
          </button>
        </div>
      ))}
      <div className="flex gap-2">
        <button
          onClick={addField}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        >
          + Add Field
        </button>
        <input
          type="text"
          value={submitText}
          onChange={(e) => {
            setSubmitText(e.target.value)
            onUpdate({ ...component.props, submitText: e.target.value })
          }}
          className="flex-1 p-1 border rounded text-sm"
          placeholder="Submit button text"
        />
      </div>
      <div className="text-sm text-gray-600">
        Form preview: {fields.length} fields, submit button: "{submitText}"
      </div>
    </div>
  )
}

// Dynamic Accordion Component
const DynamicAccordion: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [items, setItems] = useState(component.props?.items || [
    { title: "Section 1", content: "Content for section 1" },
    { title: "Section 2", content: "Content for section 2" }
  ])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<"title" | "content" | null>(null)

  const updateItems = (newItems: any[]) => {
    setItems(newItems)
    onUpdate({ ...component.props, items: newItems })
  }

  const addItem = () => {
    const newItems = [...items, { title: "New Section", content: "New content" }]
    updateItems(newItems)
    setEditingIndex(newItems.length - 1)
    setEditingField("title")
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index)
    updateItems(newItems)
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditingField(null)
    }
  }

  const updateItem = (index: number, field: "title" | "content", value: string) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    updateItems(newItems)
  }

  return (
    <div className="space-y-2">
      {items.map((item: any, index: number) => (
        <div key={index} className="border rounded">
          <div className="flex items-center justify-between p-3 bg-gray-100">
            {editingIndex === index && editingField === "title" ? (
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                onBlur={() => {
                  setEditingIndex(null)
                  setEditingField(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingIndex(null)
                    setEditingField(null)
                  }
                }}
                className="flex-1 p-1 border rounded focus:outline-none focus:border-blue-400"
                autoFocus
              />
            ) : (
              <h3
                className="flex-1 cursor-pointer hover:bg-gray-200 p-1 rounded"
                onClick={() => {
                  setEditingIndex(index)
                  setEditingField("title")
                }}
              >
                {item.title}
              </h3>
            )}
            <button
              onClick={() => removeItem(index)}
              className="text-red-500 hover:text-red-700 p-1"
            >
              ×
            </button>
          </div>
          <div className="p-3">
            {editingIndex === index && editingField === "content" ? (
              <textarea
                value={item.content}
                onChange={(e) => updateItem(index, "content", e.target.value)}
                onBlur={() => {
                  setEditingIndex(null)
                  setEditingField(null)
                }}
                className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
                rows={3}
                autoFocus
              />
            ) : (
              <p
                className="cursor-pointer hover:bg-gray-100 p-2 rounded"
                onClick={() => {
                  setEditingIndex(index)
                  setEditingField("content")
                }}
              >
                {item.content}
              </p>
            )}
          </div>
        </div>
      ))}
      <button
        onClick={addItem}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Section
      </button>
    </div>
  )
}

// Dynamic Tabs Component
const DynamicTabs: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [tabs, setTabs] = useState(component.props?.tabs || [
    { title: "Tab 1", content: "Content for tab 1" },
    { title: "Tab 2", content: "Content for tab 2" }
  ])
  const [activeTab, setActiveTab] = useState(component.props?.activeTab || 0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingField, setEditingField] = useState<"title" | "content" | null>(null)

  const updateTabs = (newTabs: any[]) => {
    setTabs(newTabs)
    onUpdate({ ...component.props, tabs: newTabs })
  }

  const addTab = () => {
    const newTabs = [...tabs, { title: "New Tab", content: "New content" }]
    updateTabs(newTabs)
    setEditingIndex(newTabs.length - 1)
    setEditingField("title")
  }

  const removeTab = (index: number) => {
    const newTabs = tabs.filter((_: any, i: number) => i !== index)
    updateTabs(newTabs)
    if (activeTab >= newTabs.length) setActiveTab(newTabs.length - 1)
    if (editingIndex === index) {
      setEditingIndex(null)
      setEditingField(null)
    }
  }

  const updateTab = (index: number, field: "title" | "content", value: string) => {
    const newTabs = [...tabs]
    newTabs[index] = { ...newTabs[index], [field]: value }
    updateTabs(newTabs)
  }

  return (
    <div className="border rounded">
      <div className="flex border-b">
        {tabs.map((tab: any, index: number) => (
          <div key={index} className="flex-1">
            {editingIndex === index && editingField === "title" ? (
              <input
                type="text"
                value={tab.title}
                onChange={(e) => updateTab(index, "title", e.target.value)}
                onBlur={() => {
                  setEditingIndex(null)
                  setEditingField(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingIndex(null)
                    setEditingField(null)
                  }
                }}
                className="w-full p-2 border-0 focus:outline-none focus:border-blue-400"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setActiveTab(index)}
                className={`w-full p-3 text-left ${
                  activeTab === index
                    ? "bg-blue-500 text-white border-b-2 border-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onDoubleClick={() => {
                  setEditingIndex(index)
                  setEditingField("title")
                }}
              >
                {tab.title}
              </button>
            )}
            <button
              onClick={() => removeTab(index)}
              className="ml-2 text-red-500 hover:text-red-700 p-1 text-sm"
            >
              ×
            </button>
          </div>
        ))}
        <button
          onClick={addTab}
          className="p-3 text-blue-500 hover:text-blue-600"
        >
          +
        </button>
      </div>
      <div className="p-4">
        {editingIndex !== null && editingField === "content" && editingIndex === activeTab ? (
          <textarea
            value={tabs[activeTab]?.content || ""}
            onChange={(e) => updateTab(activeTab, "content", e.target.value)}
            onBlur={() => {
              setEditingIndex(null)
              setEditingField(null)
            }}
            className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
            rows={4}
            autoFocus
          />
        ) : (
          <div
            className="cursor-pointer hover:bg-gray-100 p-2 rounded"
            onClick={() => {
              setEditingIndex(activeTab)
              setEditingField("content")
            }}
          >
            {tabs[activeTab]?.content || "Tab content"}
          </div>
        )}
      </div>
    </div>
  )
}

// Dynamic Modal Trigger Component
const DynamicModalTrigger: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [text, setText] = useState(component.props?.text || "Open Modal")
  const [modalContent, setModalContent] = useState(component.props?.modalContent || "Modal content goes here")
  const [editing, setEditing] = useState<"text" | "content" | null>(null)

  useEffect(() => {
    setText(component.props?.text || "Open Modal")
  }, [component.props?.text])

  useEffect(() => {
    setModalContent(component.props?.modalContent || "Modal content goes here")
  }, [component.props?.modalContent])

  return (
    <div className="text-center space-y-2">
      <button
        onClick={() => alert(modalContent)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {text}
      </button>
      <div className="flex justify-center gap-2 text-sm">
        <button
          onClick={() => setEditing("text")}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Edit Button
        </button>
        <button
          onClick={() => setEditing("content")}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Edit Modal
        </button>
      </div>
      {editing === "text" && (
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            onUpdate({ ...component.props, text: e.target.value })
          }}
          onBlur={() => setEditing(null)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(null)
            }
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          autoFocus
        />
      )}
      {editing === "content" && (
        <textarea
          value={modalContent}
          onChange={(e) => {
            setModalContent(e.target.value)
            onUpdate({ ...component.props, modalContent: e.target.value })
          }}
          onBlur={() => setEditing(null)}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
          rows={3}
          autoFocus
        />
      )}
    </div>
  )
}

// Dynamic Scroller Component
const DynamicScroller: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [text, setText] = useState(component.props?.text || "Scrolling text content...")
  const [speed, setSpeed] = useState(component.props?.speed || "normal")
  const [direction, setDirection] = useState(component.props?.direction || "left")
  const [editing, setEditing] = useState(false)

  useEffect(() => {
    setText(component.props?.text || "Scrolling text content...")
  }, [component.props?.text])

  useEffect(() => {
    setSpeed(component.props?.speed || "normal")
  }, [component.props?.speed])

  useEffect(() => {
    setDirection(component.props?.direction || "left")
  }, [component.props?.direction])

  const speedMap: Record<string, string> = {
    slow: "20s",
    normal: "10s",
    fast: "5s"
  }

  return (
    <div className="space-y-2">
      <div
        className="w-full h-12 bg-gray-100 overflow-hidden flex items-center relative"
        style={{
          backgroundColor: component.props?.backgroundColor || "#f0f0f0"
        }}
      >
        <div
          className="whitespace-nowrap text-sm font-bold"
          style={{
            animation: `${direction === "right" ? "scrollRight" : "scrollLeft"} ${speedMap[speed]} linear infinite`,
            color: component.props?.textColor || "#000000"
          }}
        >
          {text}
        </div>
      </div>
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setEditing(true)}
          className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded"
        >
          Edit Text
        </button>
        <select
          value={speed}
          onChange={(e) => {
            setSpeed(e.target.value)
            onUpdate({ ...component.props, speed: e.target.value })
          }}
          className="p-1 border rounded"
        >
          <option value="slow">Slow</option>
          <option value="normal">Normal</option>
          <option value="fast">Fast</option>
        </select>
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value)
            onUpdate({ ...component.props, direction: e.target.value })
          }}
          className="p-1 border rounded"
        >
          <option value="left">Left</option>
          <option value="right">Right</option>
        </select>
      </div>
      {editing && (
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e.target.value)
            onUpdate({ ...component.props, text: e.target.value })
          }}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setEditing(false)
            }
          }}
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-400"
          autoFocus
        />
      )}
    </div>
  )
}

// Dynamic Spacer Component
const DynamicSpacer: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [height, setHeight] = useState(component.props?.height || "20px")

  useEffect(() => {
    setHeight(component.props?.height || "20px")
  }, [component.props?.height])

  return (
    <div className="flex items-center justify-center p-2 border-2 border-dashed border-gray-300 rounded">
      <div className="text-center">
        <div
          className="bg-gray-200 mx-auto"
          style={{ height: "20px", width: "2px" }}
        />
        <input
          type="text"
          value={height}
          onChange={(e) => {
            setHeight(e.target.value)
            onUpdate({ ...component.props, height: e.target.value })
          }}
          className="mt-2 p-1 border rounded text-sm text-center w-20 focus:outline-none focus:border-blue-400"
          placeholder="20px"
        />
        <div className="text-xs text-gray-500 mt-1">Spacer Height</div>
      </div>
    </div>
  )
}

// Dynamic Container Component
const DynamicContainer: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [maxWidth, setMaxWidth] = useState(component.props?.maxWidth || "1200px")

  useEffect(() => {
    setMaxWidth(component.props?.maxWidth || "1200px")
  }, [component.props?.maxWidth])

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded">
      <div className="text-center mb-4">
        <input
          type="text"
          value={maxWidth}
          onChange={(e) => {
            setMaxWidth(e.target.value)
            onUpdate({ ...component.props, maxWidth: e.target.value })
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
          placeholder="1200px"
        />
        <div className="text-sm text-gray-600 mt-1">Max Width</div>
      </div>
      <div className="bg-gray-100 p-4 rounded text-center text-gray-500">
        Container Content Area
      </div>
    </div>
  )
}

// Dynamic Grid Component
const DynamicGrid: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [columns, setColumns] = useState(component.props?.columns || 3)
  const [gap, setGap] = useState(component.props?.gap || "1rem")

  useEffect(() => {
    setColumns(component.props?.columns || 3)
  }, [component.props?.columns])

  useEffect(() => {
    setGap(component.props?.gap || "1rem")
  }, [component.props?.gap])

  return (
    <div className="p-4 border rounded">
      <div className="flex gap-2 mb-4 text-sm">
        <label className="flex items-center gap-1">
          Columns:
          <input
            type="number"
            min="1"
            max="12"
            value={columns}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              setColumns(val)
              onUpdate({ ...component.props, columns: val })
            }}
            className="w-16 p-1 border rounded focus:outline-none focus:border-blue-400"
          />
        </label>
        <label className="flex items-center gap-1">
          Gap:
          <input
            type="text"
            value={gap}
            onChange={(e) => {
              setGap(e.target.value)
              onUpdate({ ...component.props, gap: e.target.value })
            }}
            className="w-20 p-1 border rounded focus:outline-none focus:border-blue-400"
          />
        </label>
      </div>
      <div
        className="grid gap-2 p-4 bg-gray-50 rounded min-h-[200px]"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: gap
        }}
      >
        {Array.from({ length: columns * 2 }, (_, i) => (
          <div key={i} className="bg-white border rounded p-2 text-center text-gray-400 text-sm">
            Grid Cell {i + 1}
          </div>
        ))}
      </div>
    </div>
  )
}

// Dynamic Flex Box Component
const DynamicFlexBox: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [direction, setDirection] = useState(component.props?.direction || "row")

  useEffect(() => {
    setDirection(component.props?.direction || "row")
  }, [component.props?.direction])

  return (
    <div className="p-4 border rounded">
      <div className="mb-4">
        <select
          value={direction}
          onChange={(e) => {
            setDirection(e.target.value)
            onUpdate({ ...component.props, direction: e.target.value })
          }}
          className="p-2 border rounded focus:outline-none focus:border-blue-400"
        >
          <option value="row">Horizontal (Row)</option>
          <option value="column">Vertical (Column)</option>
        </select>
      </div>
      <div
        className="flex gap-2 p-4 bg-gray-50 rounded min-h-[100px] items-center justify-center"
        style={{ flexDirection: direction as any }}
      >
        <div className="bg-white border rounded p-3 text-center text-gray-400 text-sm">
          Item 1
        </div>
        <div className="bg-white border rounded p-3 text-center text-gray-400 text-sm">
          Item 2
        </div>
        <div className="bg-white border rounded p-3 text-center text-gray-400 text-sm">
          Item 3
        </div>
      </div>
    </div>
  )
}

import DynamicCard from './DynamicCard'


// Dynamic Testimonial Component
const DynamicTestimonial: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [testimonials, setTestimonials] = useState(component.props?.testimonials || [
    { quote: "This is amazing!", author: "John Doe", position: "CEO" },
    { quote: "Great service!", author: "Jane Smith", position: "Manager" }
  ])
  const [currentIndex, setCurrentIndex] = useState(0)

  const updateTestimonials = (newTestimonials: any[]) => {
    setTestimonials(newTestimonials)
    onUpdate({ ...component.props, testimonials: newTestimonials })
  }

  const addTestimonial = () => {
    const newTestimonials = [...testimonials, { quote: "New testimonial", author: "New Author", position: "Position" }]
    updateTestimonials(newTestimonials)
  }

  const removeTestimonial = (index: number) => {
    const newTestimonials = testimonials.filter((_: any, i: number) => i !== index)
    updateTestimonials(newTestimonials)
    if (currentIndex >= newTestimonials.length) setCurrentIndex(newTestimonials.length - 1)
  }

  return (
    <div className="border rounded p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          {testimonials.map((_: any, index: number) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-blue-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            onClick={addTestimonial}
            className="px-2 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
          >
            + Testimonial
          </button>
          {testimonials.length > 1 && (
            <button
              onClick={() => removeTestimonial(currentIndex)}
              className="px-2 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <div className="bg-gray-100 p-8 rounded text-center min-h-[200px] flex items-center justify-center">
        <div>
          <blockquote className="text-lg italic mb-4">
            "{testimonials[currentIndex]?.quote || "Testimonial quote"}"
          </blockquote>
          <div className="font-semibold">{testimonials[currentIndex]?.author || "Author Name"}</div>
          <div className="text-sm text-gray-600">{testimonials[currentIndex]?.position || "Position"}</div>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-2">
        Testimonial {currentIndex + 1} of {testimonials.length}
      </div>
    </div>
  )
}

// Dynamic Pricing Table Component
const DynamicPricingTable: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [plans, setPlans] = useState(component.props?.plans || [
    { name: "Basic", price: "$9", features: ["Feature 1", "Feature 2"] },
    { name: "Pro", price: "$29", features: ["Feature 1", "Feature 2", "Feature 3"] }
  ])

  const updatePlans = (newPlans: any[]) => {
    setPlans(newPlans)
    onUpdate({ ...component.props, plans: newPlans })
  }

  const addPlan = () => {
    const newPlans = [...plans, { name: "New Plan", price: "$19", features: ["Feature 1"] }]
    updatePlans(newPlans)
  }

  const removePlan = (index: number) => {
    const newPlans = plans.filter((_: any, i: number) => i !== index)
    updatePlans(newPlans)
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {plans.map((plan: any, index: number) => (
        <div key={index} className="border rounded p-4 relative">
          <button
            onClick={() => removePlan(index)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
          <h3 className="text-lg font-semibold">{plan.name}</h3>
          <div className="text-2xl font-bold text-blue-600">{plan.price}</div>
          <ul className="mt-2 space-y-1">
            {plan.features.map((feature: string, i: number) => (
              <li key={i} className="text-sm">• {feature}</li>
            ))}
          </ul>
        </div>
      ))}
      <button
        onClick={addPlan}
        className="border-2 border-dashed border-gray-300 rounded p-8 text-center text-gray-500 hover:border-blue-400"
      >
        + Add Plan
      </button>
    </div>
  )
}

// Dynamic Counter Component
const DynamicCounter: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [value, setValue] = useState(component.props?.value || 0)
  const [label, setLabel] = useState(component.props?.label || "Counter")

  useEffect(() => {
    setValue(component.props?.value || 0)
  }, [component.props?.value])

  useEffect(() => {
    setLabel(component.props?.label || "Counter")
  }, [component.props?.label])

  return (
    <div className="text-center p-4">
      <div className="text-4xl font-bold text-blue-600">{value.toLocaleString()}</div>
      <div className="text-gray-600">{label}</div>
      <div className="mt-2 flex justify-center gap-2">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            const val = parseInt(e.target.value) || 0
            setValue(val)
            onUpdate({ ...component.props, value: val })
          }}
          className="w-20 p-1 border rounded text-center"
        />
        <input
          type="text"
          value={label}
          onChange={(e) => {
            setLabel(e.target.value)
            onUpdate({ ...component.props, label: e.target.value })
          }}
          className="flex-1 p-1 border rounded"
          placeholder="Label"
        />
      </div>
    </div>
  )
}

// Dynamic Timeline Component
const DynamicTimeline: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [events, setEvents] = useState(component.props?.events || [
    { date: "2023", title: "Event 1", description: "Description" },
    { date: "2024", title: "Event 2", description: "Description" }
  ])

  const updateEvents = (newEvents: any[]) => {
    setEvents(newEvents)
    onUpdate({ ...component.props, events: newEvents })
  }

  const addEvent = () => {
    const newEvents = [...events, { date: "2025", title: "New Event", description: "Description" }]
    updateEvents(newEvents)
  }

  const removeEvent = (index: number) => {
    const newEvents = events.filter((_: any, i: number) => i !== index)
    updateEvents(newEvents)
  }

  return (
    <div className="space-y-4">
      {events.map((event: any, index: number) => (
        <div key={index} className="flex gap-4 relative">
          <div className="flex flex-col items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            {index < events.length - 1 && <div className="w-0.5 h-16 bg-gray-300 mt-2"></div>}
          </div>
          <div className="flex-1 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{event.title}</div>
                <div className="text-sm text-gray-600">{event.date}</div>
                <div className="text-sm mt-1">{event.description}</div>
              </div>
              <button
                onClick={() => removeEvent(index)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={addEvent}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        + Add Event
      </button>
    </div>
  )
}

// Dynamic Map Component
const DynamicMap: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [lat, setLat] = useState(component.props?.lat || 0)
  const [lng, setLng] = useState(component.props?.lng || 0)

  useEffect(() => {
    setLat(component.props?.lat || 0)
  }, [component.props?.lat])

  useEffect(() => {
    setLng(component.props?.lng || 0)
  }, [component.props?.lng])

  return (
    <div className="p-4 border rounded">
      <div className="bg-gray-100 h-48 rounded flex items-center justify-center text-gray-500">
        Map Placeholder
      </div>
      <div className="mt-2 flex gap-2 text-sm">
        <input
          type="number"
          value={lat}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0
            setLat(val)
            onUpdate({ ...component.props, lat: val })
          }}
          className="flex-1 p-1 border rounded"
          placeholder="Latitude"
        />
        <input
          type="number"
          value={lng}
          onChange={(e) => {
            const val = parseFloat(e.target.value) || 0
            setLng(val)
            onUpdate({ ...component.props, lng: val })
          }}
          className="flex-1 p-1 border rounded"
          placeholder="Longitude"
        />
      </div>
    </div>
  )
}

// Dynamic Social Media Component
const DynamicSocialMedia: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [platform, setPlatform] = useState(component.props?.platform || "twitter")
  const [url, setUrl] = useState(component.props?.url || "#")

  useEffect(() => {
    setPlatform(component.props?.platform || "twitter")
  }, [component.props?.platform])

  useEffect(() => {
    setUrl(component.props?.url || "#")
  }, [component.props?.url])

  return (
    <div className="text-center p-4">
      <select
        value={platform}
        onChange={(e) => {
          setPlatform(e.target.value)
          onUpdate({ ...component.props, platform: e.target.value })
        }}
        className="p-2 border rounded mb-2"
      >
        <option value="twitter">Twitter</option>
        <option value="facebook">Facebook</option>
        <option value="instagram">Instagram</option>
        <option value="linkedin">LinkedIn</option>
      </select>
      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value)
          onUpdate({ ...component.props, url: e.target.value })
        }}
        className="w-full p-2 border rounded"
        placeholder="Profile URL"
      />
      <div className="mt-2 text-2xl">
        {platform === "twitter" && "🐦"}
        {platform === "facebook" && "📘"}
        {platform === "instagram" && "📷"}
        {platform === "linkedin" && "💼"}
      </div>
    </div>
  )
}

// Dynamic Section Component
const DynamicSection: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [type, setType] = useState(component.props?.type || "home_banner")

  useEffect(() => {
    setType(component.props?.type || "home_banner")
  }, [component.props?.type])

  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded">
      <select
        value={type}
        onChange={(e) => {
          setType(e.target.value)
          onUpdate({ ...component.props, type: e.target.value })
        }}
        className="p-2 border rounded mb-2"
      >
        <option value="home_banner">Home Banner</option>
        <option value="about">About</option>
        <option value="services">Services</option>
        <option value="contact">Contact</option>
      </select>
      <div className="bg-gray-100 p-8 rounded text-center text-gray-500">
        Section: {type.replace("_", " ").toUpperCase()}
      </div>
    </div>
  )
}

// Dynamic List Component
const DynamicList: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [items, setItems] = useState<string[]>(["List item 1", "List item 2", "List item 3"])
  const [editingIndex, setEditingIndex] = useState<number | null>(null)

  useEffect(() => {
    if (component.props?.items && JSON.stringify(component.props.items) !== JSON.stringify(items)) {
      setItems(component.props.items)
    }
  }, [component.props?.items, items])

  const updateItems = (newItems: string[]) => {
    setItems(newItems)
    onUpdate({ ...component.props, items: newItems })
  }

  const addItem = () => {
    const newItems = [...items, "New item"]
    updateItems(newItems)
    setEditingIndex(newItems.length - 1)
  }

  const removeItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index)
    updateItems(newItems)
    if (editingIndex === index) setEditingIndex(null)
  }

  const updateItem = (index: number, text: string) => {
    const newItems = [...items]
    newItems[index] = text
    updateItems(newItems)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...items]
    if (direction === 'up' && index > 0) {
      [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]]
    } else if (direction === 'down' && index < newItems.length - 1) {
      [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]]
    }
    updateItems(newItems)
  }

  const listStyle = {
    fontSize: component.props?.fontSize || '16px',
    color: component.props?.fontColor || '#333333',
    fontWeight: component.props?.fontWeight || 'normal',
    textAlign: component.props?.textAlign || 'left',
    lineHeight: component.props?.lineHeight || '1.5',
    paddingLeft: component.props?.paddingLeft || '20px',
    margin: '10px 0',
    listStyleType: component.props?.type === 'unordered' ? (component.props?.bulletStyle || 'disc') : undefined
  }

  const itemStyle = {
    marginBottom: component.props?.spacingBetweenItems || '8px'
  }

  if (component.props?.type === 'ordered') {
    return (
      <div className="w-full">
        <div className="overflow-y-auto overflow-x-hidden p-2 rounded" style={{ height: '20rem' }}>
          <ol
            id={component.props?.customId || undefined}
            className={`w-full max-w-full ${component.props?.customClass || undefined}`}
            style={listStyle}
          >
            {items.map((item: string, index: number) => (
              <li key={index} style={itemStyle} className="flex items-center gap-2 group">
                {editingIndex === index ? (
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") setEditingIndex(null)
                      if (e.key === "Escape") setEditingIndex(null)
                    }}
                    className="flex-1 px-2 py-1 border rounded focus:outline-none focus:border-blue-400"
                    autoFocus
                    style={{
                      fontSize: component.props?.fontSize || '16px',
                      color: component.props?.fontColor || '#333333',
                      fontWeight: component.props?.fontWeight || 'normal'
                    }}
                  />
                ) : (
                  <span
                    className="flex-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                    onClick={() => setEditingIndex(index)}
                    style={{
                      fontSize: component.props?.fontSize || '16px',
                      color: component.props?.fontColor || '#333333',
                      fontWeight: component.props?.fontWeight || 'normal'
                    }}
                  >
                    {item}
                  </span>
                )}
                <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-blue-500 p-1 disabled:opacity-50"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === items.length - 1}
                    className="text-gray-400 hover:text-blue-500 p-1 disabled:opacity-50"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeItem(index)}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
        <button
          onClick={addItem}
          className="w-full text-blue-500 hover:text-blue-700 text-sm font-medium bg-white border-t border-gray-200 p-2 text-center"
        >
          + Add item
        </button>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="overflow-y-auto overflow-x-hidden p-2 rounded" style={{ height: '20rem' }}>
        <ul
          id={component.props?.customId || undefined}
          className={`w-full max-w-full ${component.props?.customClass || undefined}`}
          style={listStyle}
        >
          {items.map((item: string, index: number) => (
            <li key={index} style={itemStyle} className="flex items-center gap-2 group">
              {editingIndex === index ? (
                <input
                  type="text"
                  value={item}
                  onChange={(e) => updateItem(index, e.target.value)}
                  onBlur={() => setEditingIndex(null)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setEditingIndex(null)
                    if (e.key === "Escape") setEditingIndex(null)
                  }}
                  className="flex-1 px-2 py-1 border rounded focus:outline-none focus:border-blue-400"
                  autoFocus
                  style={{
                    fontSize: component.props?.fontSize || '16px',
                    color: component.props?.fontColor || '#333333',
                    fontWeight: component.props?.fontWeight || 'normal'
                  }}
                />
              ) : (
                <span
                  className="flex-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                  onClick={() => setEditingIndex(index)}
                  style={{
                    fontSize: component.props?.fontSize || '16px',
                    color: component.props?.fontColor || '#333333',
                    fontWeight: component.props?.fontWeight || 'normal'
                  }}
                >
                  {item}
                </span>
              )}
              <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                <button
                  onClick={() => moveItem(index, 'up')}
                  disabled={index === 0}
                  className="text-gray-400 hover:text-blue-500 p-1 disabled:opacity-50"
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(index, 'down')}
                  disabled={index === items.length - 1}
                  className="text-gray-400 hover:text-blue-500 p-1 disabled:opacity-50"
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  onClick={() => removeItem(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                  title="Remove item"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button
        onClick={addItem}
        className="w-full text-blue-500 hover:text-blue-700 text-sm font-medium bg-white border-t border-gray-200 p-2 text-center"
      >
        + Add item
      </button>
      </div>
      
    </div>
  )
}

// Dynamic Image Component
const DynamicImage: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [editingMode, setEditingMode] = useState<'none' | 'src' | 'alt'>('none')
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const urlInputRef = useRef<HTMLInputElement>(null)
  const altInputRef = useRef<HTMLInputElement>(null)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // If shift+click, edit URL; otherwise open file picker
    if (e.shiftKey) {
      setEditingMode('src')
      setTimeout(() => urlInputRef.current?.focus(), 0)
    } else {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (event) => {
        onUpdate({ ...component.props, src: event.target?.result as string, alt: file.name })
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUrlSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newSrc = (e.target as HTMLInputElement).value
      onUpdate({ ...component.props, src: newSrc })
      setEditingMode('none')
    } else if (e.key === 'Escape') {
      setEditingMode('none')
    }
  }

  const handleAltSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const newAlt = (e.target as HTMLInputElement).value
      onUpdate({ ...component.props, alt: newAlt })
      setEditingMode('none')
    } else if (e.key === 'Escape') {
      setEditingMode('none')
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        setIsUploading(true)
        const reader = new FileReader()
        reader.onload = (event) => {
          onUpdate({ ...component.props, src: event.target?.result as string, alt: file.name })
          setIsUploading(false)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const imageStyle: React.CSSProperties = {
    width: component.props?.width || '100%',
    height: component.props?.height || 'auto',
    maxWidth: component.props?.maxWidth || '100%',
    maxHeight: component.props?.maxHeight || 'none',
    border: component.props?.border || 'none',
    borderRadius: component.props?.borderRadius || '0px',
    padding: component.props?.padding || '0px',
    display: 'block',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    objectFit: 'cover'
  }

  const containerStyle: React.CSSProperties = {
    textAlign: component.props?.alignment || 'center',
    margin: component.props?.margin || '20px 0px',
    position: 'relative'
  }

  const imageElement = (
    <img
      id={component.props?.customId || undefined}
      className={component.props?.customClass || undefined}
      src={component.props?.src || "https://via.placeholder.com/400x300?text=Click+to+upload"}
      alt={component.props?.alt || "Image"}
      style={imageStyle}
      onClick={handleImageClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    />
  )

  const wrappedImage = component.props?.linkUrl ?
    React.createElement('a', {
      href: component.props.linkUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      style: { display: 'inline-block' }
    }, imageElement) :
    imageElement

  return (
    <figure style={containerStyle}>
      <div
        className={`relative inline-block ${dragOver ? 'ring-2 ring-blue-400 ring-opacity-50' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {wrappedImage}

        {/* Editing overlay */}
        {editingMode === 'src' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
            <input
              ref={urlInputRef}
              type="text"
              defaultValue={component.props?.src || ''}
              onKeyDown={handleUrlSubmit}
              onBlur={() => setEditingMode('none')}
              className="px-2 py-1 text-sm bg-white border rounded w-3/4"
              placeholder="Enter image URL..."
            />
          </div>
        )}

        {editingMode === 'alt' && (
          <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center rounded">
            <input
              ref={altInputRef}
              type="text"
              defaultValue={component.props?.alt || ''}
              onKeyDown={handleAltSubmit}
              onBlur={() => setEditingMode('none')}
              className="px-2 py-1 text-sm bg-white border rounded w-3/4"
              placeholder="Enter alt text..."
            />
          </div>
        )}

        {/* Upload overlay */}
        {isUploading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
            <div className="text-white text-sm">Uploading...</div>
          </div>
        )}

        {/* Drag overlay */}
        {dragOver && (
          <div className="absolute inset-0 bg-blue-500 bg-opacity-20 border-2 border-dashed border-blue-400 flex items-center justify-center rounded">
            <div className="text-blue-600 font-medium">Drop image here</div>
          </div>
        )}

        {/* Edit buttons */}
        <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity flex gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingMode('src')
              setTimeout(() => urlInputRef.current?.focus(), 0)
            }}
            className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs hover:bg-white"
            title="Edit URL"
          >
            URL
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setEditingMode('alt')
              setTimeout(() => altInputRef.current?.focus(), 0)
            }}
            className="bg-white bg-opacity-90 text-gray-700 px-2 py-1 rounded text-xs hover:bg-white"
            title="Edit Alt Text"
          >
            Alt
          </button>
        </div>
      </div>

      {/* Caption */}
      {component.props?.caption && (
        <figcaption
          className="mt-2 text-sm text-gray-600 italic cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
          onClick={() => {
            const newCaption = prompt('Edit caption:', component.props?.caption || '')
            if (newCaption !== null) {
              onUpdate({ ...component.props, caption: newCaption })
            }
          }}
        >
          {component.props.caption}
        </figcaption>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </figure>
  )
}

// Dynamic Gallery Component
const DynamicGallery: React.FC<{ component: LayoutComponent; onUpdate: (props: any) => void }> = ({ component, onUpdate }) => {
  const [images, setImages] = useState(component.props?.images || [
    { src: "https://via.placeholder.com/300x200?text=Image+1", alt: "Image 1" },
    { src: "https://via.placeholder.com/300x200?text=Image+2", alt: "Image 2" },
    { src: "https://via.placeholder.com/300x200?text=Image+3", alt: "Image 3" }
  ])

  const updateImages = (newImages: any[]) => {
    setImages(newImages)
    onUpdate({ ...(component.props || {}), images: newImages })
  }

  const addImage = () => {
    const newImages = [...images, { src: "https://via.placeholder.com/300x200?text=New+Image", alt: "New Image" }]
    updateImages(newImages)
  }

  const removeImage = (index: number) => {
    const newImages = images.filter((_: any, i: number) => i !== index)
    updateImages(newImages)
  }

  const replaceImage = (index: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const newImages = [...images]
      newImages[index] = { src: event.target?.result as string, alt: file.name }
      updateImages(newImages)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-3 gap-4">
        {images.map((image: any, index: number) => (
          <div key={index} className="relative group">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-32 object-cover rounded border cursor-pointer"
              onClick={() => {
                const input = document.createElement("input")
                input.type = "file"
                input.accept = "image/*"
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0]
                  if (file) replaceImage(index, file)
                }
                input.click()
              }}
            />
            <button
              onClick={() => removeImage(index)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={addImage}
        className="text-blue-500 hover:text-blue-700 text-sm font-medium"
      >
        + Add Image
      </button>
    </div>
  )
}

