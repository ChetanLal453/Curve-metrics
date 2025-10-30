'use client';

import { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Droppable, Draggable } from '@hello-pangea/dnd';

interface TemplatesPanelProps {
  pageId: any;
  onAddSection: any;
  templates: any;
}

export default function TemplatesPanel({ pageId, onAddSection, templates }: TemplatesPanelProps) {

  const addSection = (template: any) => {
    fetch('/api/create-section', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        page_id: pageId,
        template_id: template.id,
        section_type: template.section_type,
        content: template.content,
        order: 999 // Will be reordered
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
    <Card className="mb-3">
      <Card.Header>
        <h5>Templates</h5>
      </Card.Header>
      <Card.Body>
        <Droppable droppableId="templates" isDropDisabled={true}>
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {templates.map((template: any, index: number) => (
                <Draggable key={template.id} draggableId={`template-${template.id}`} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="mb-2 p-2 border rounded"
                      style={{ cursor: 'grab' }}
                    >
                      <strong>{template.section_type}</strong>
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="ms-2"
                        onClick={() => addSection(template)}
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
