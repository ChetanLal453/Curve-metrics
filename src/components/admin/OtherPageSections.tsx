'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { useDraggable } from '@dnd-kit/core';

const createId = () => globalThis.crypto?.randomUUID?.() || `section-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

interface OtherPageSectionsProps {
  pageId: any;
  onAddSection: any;
}

export default function OtherPageSections({ pageId, onAddSection }: OtherPageSectionsProps) {
  const [pages, setPages] = useState<any[]>([]);
  const [selectedOtherPage, setSelectedOtherPage] = useState('');
  const [sections, setSections] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/get-pages')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setPages(data.pages.filter((p: any) => p.id != pageId));
        }
      });
  }, [pageId]);

  useEffect(() => {
    if (!selectedOtherPage) return;

    fetch(`/api/get-page-layout?page_id=${selectedOtherPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.layout) {
          setSections(data.layout.sections || []);
        }
      });
  }, [selectedOtherPage]);

  const addSection = (section: any) => {
    fetch(`/api/get-page-layout?page_id=${pageId}`)
      .then(res => res.json())
      .then(layoutData => {
        if (!layoutData.success || !layoutData.layout) return;

        const nextSection = {
          ...section,
          id: createId(),
          name: section.name || section.section_type || 'Imported Section',
          type: section.type || section.section_type || 'custom',
        };

        return fetch('/api/save-page-layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            page_id: Number(pageId),
            layout: {
              ...layoutData.layout,
              sections: [...(layoutData.layout.sections || []), nextSection],
            },
          }),
        }).then(res => res.json()).then(data => {
          if (data.success) {
            onAddSection(nextSection);
          }
        });
      });
  };

  return (
    <Card>
      <Card.Header>
        <h5>Sections from Other Pages</h5>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Label>Select Page</Form.Label>
          <Form.Select value={selectedOtherPage} onChange={(e) => setSelectedOtherPage(e.target.value)}>
            <option value="">Choose a page...</option>
            {pages.map((page: any) => (
              <option key={page.id} value={page.id}>{page.title}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <div className="sections-list">
          {sections.map((section: any, index: number) => (
            <DraggableSection 
              key={`other-${section.id}`} 
              section={section} 
              onAdd={addSection}
            />
          ))}
        </div>
      </Card.Body>
    </Card>
  );
}

// Separate draggable section component
function DraggableSection({ section, onAdd }: any) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `other-${section.id}`,
    data: {
      type: 'section',
      section: section
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
          <strong className="text-sm">{section.name || section.section_type || section.type}</strong>
          {section.description && (
            <p className="text-xs text-gray-500 mt-1">{section.description}</p>
          )}
        </div>
        <Button
          variant="outline-success"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            onAdd(section);
          }}
        >
          Add
        </Button>
      </div>
    </div>
  );
}
