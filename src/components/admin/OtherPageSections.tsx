'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Droppable, Draggable } from '@hello-pangea/dnd';

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

    fetch(`/api/get-page-sections?page_id=${selectedOtherPage}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSections(data.sections);
        }
      });
  }, [selectedOtherPage]);

  const addSection = (section: any) => {
    fetch('/api/create-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: pageId,
        template_id: section.template_id,
        section_type: section.section_type,
        content: section.content,
        order: 999
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onAddSection(data.section);
        }
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

        <Droppable droppableId={`other-${selectedOtherPage}`} isDropDisabled={true}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {sections.map((section: any, index: number) => (
                <Draggable key={`other-${section.id}`} draggableId={`other-${section.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2 p-2 border rounded"
                      style={{ cursor: 'grab' }}
                    >
                      <strong>{section.section_type}</strong>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="ms-2"
                        onClick={() => addSection(section)}
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </Card.Body>
    </Card>
  );
}
