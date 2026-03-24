'use client';

import { Card, Button } from 'react-bootstrap';
import { useDraggable } from '@dnd-kit/core';

const createId = () => globalThis.crypto?.randomUUID?.() || `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface TemplatesPanelProps {
  pageId: any;
  onAddSection: any;
  templates: any;
}

export default function TemplatesPanel({ pageId, onAddSection, templates }: TemplatesPanelProps) {
  const addSection = async (template: any) => {
    const layoutResponse = await fetch(`/api/get-page-layout?page_id=${pageId}`);
    const layoutData = await layoutResponse.json();
    if (!layoutData.success || !layoutData.layout) return;

    const nextSection = {
      id: createId(),
      name: template.name || template.section_type || 'Template Section',
      type: template.section_type || template.type || 'custom',
      props: template.layout || template.content || {},
      content: template.layout || template.content || {},
      container: {
        id: `container-${createId()}`,
        rows: [],
      },
    };

    const nextLayout = {
      ...layoutData.layout,
      sections: [...(layoutData.layout.sections || []), nextSection],
    };

    const saveResponse = await fetch('/api/save-page-layout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: Number(pageId),
        layout: nextLayout,
      }),
    });

    const saveData = await saveResponse.json();
    if (saveData.success) {
      onAddSection(nextSection);
    }
  };

  return (
    <Card className="mb-3">
      <Card.Header>
        <h5>Templates</h5>
      </Card.Header>
      <Card.Body>
        <div className="templates-list">
          {templates.map((template: any, index: number) => (
            <DraggableTemplate 
              key={template.id} 
              template={template} 
              onAdd={addSection}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

// Separate draggable template component
function DraggableTemplate({ template, onAdd }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `template-${template.id}`,
    data: {
      type: 'template',
      template: template
    }
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    opacity: isDragging ? 0.5 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`mb-2 p-2 border rounded ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-all duration-200 ${
        isDragging ? 'bg-blue-50 border-blue-300' : 'bg-white hover:bg-gray-50'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <strong className="text-sm">{template.section_type}</strong>
          {template.description && (
            <p className="text-xs text-gray-500 mt-1">{template.description}</p>
          )}
        </div>
        <Button
          variant="outline-success"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(template);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
